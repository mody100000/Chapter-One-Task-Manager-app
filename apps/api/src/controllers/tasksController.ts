import type { Request, Response } from "express";
import { ZodError } from "zod";
import {
  getTasksWithPaginationAndFiltering,
  createTask,
  getTaskById,
  archiveTaskById,
  restoreTaskById,
  recordTaskActivity,
  assignTaskToUser,
  updateTaskById,
  deleteTask,
} from "../services/tasksService.js";
import { taskQuerySchema } from "../schemas/GetTasksSchema.js";
import { createTaskSchema } from "../schemas/CreateTaskSchema.js";
import {
  assignTaskBodySchema,
  assignTaskParamsSchema,
} from "../schemas/AssignTaskSchema.js";
import {
  updateTaskParamsSchema,
  updateTaskSchema,
} from "../schemas/UpdateTaskSchema.js";
import { parseZodError } from "../utils/parseZodError.js";
import { TaskPriority } from "../generated/prisma/enums.js";
import { getCurrentUser } from "../utils/getCurrentUser.js";
import { getUserById } from "../services/usersService.js";

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const payload = {
      page: req.query.page,
      pageSize: req.query.pageSize,
      filter: {
        status: req.query.status,
        priority: req.query.priority,
        category: req.query.category,
        search: req.query.search,
        userAssigned: req.query.userAssigned,
      },
    };
    const parsed = taskQuerySchema.parse(payload);

    const filter = parsed.filter || {};
    const tasks = await getTasksWithPaginationAndFiltering(
      parsed.page,
      parsed.pageSize,
      filter,
    );
    res.json(tasks);
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const createNewTask = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const parsed = createTaskSchema.parse(payload);

    // Parse dates if they're provided as strings
    const startDate = parsed.startDate
      ? new Date(parsed.startDate)
      : new Date();
    const dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;

    const user = await getCurrentUser();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const task = await createTask({
      title: parsed.title,
      description: parsed.description,
      status: parsed.status,
      priority: parsed.priority ?? TaskPriority.MEDIUM,
      category: parsed.category ?? null,
      startDate,
      dueDate,
      assignedTo: parsed.assignedToId
        ? { connect: { id: parsed.assignedToId } }
        : undefined,
      createdBy: { connect: { id: user.id } },
    } as any);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(parseZodError(error));
      return;
    }
    res.status(500).json(parseZodError(error));
  }
};

export const getTaskByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Task id is required" });
      return;
    }

    const task = await getTaskById(id as string);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};

export const archiveTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
      res.status(400).json({ message: "Task id is required" });
      return;
    }

    const existingTask = await getTaskById(id);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      res.status(500).json({ message: "Default user not found" });
      return;
    }

    let archieved = false;

    if (existingTask.archivedById) {
      await Promise.all([
        restoreTaskById(id),
        recordTaskActivity(existingTask.id, "Task restored", currentUser.id),
      ]);
      archieved = false;
    } else {
      await Promise.all([
        archiveTaskById(id, currentUser.id),
        recordTaskActivity(existingTask.id, "Task archived", currentUser.id),
      ]);
      archieved = true;
    }

    res.status(200).json({
      message: "Task archived successfully",
      archieved,
    });
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};

export const assignTaskHandler = async (req: Request, res: Response) => {
  try {
    const parsedParams = assignTaskParamsSchema.parse(req.params || {});
    const parsedBody = assignTaskBodySchema.parse(req.body || {});

    const existingTask = await getTaskById(parsedParams.id);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      res.status(500).json({ message: "Default user not found" });
      return;
    }

    let assignedUserName = "Unknown user";
    if (parsedBody.assignedToId) {
      const assignedUser = await getUserById(parsedBody.assignedToId);
      if (!assignedUser) {
        res.status(404).json({ message: "Assigned user not found" });
        return;
      }
      assignedUserName = assignedUser.name || assignedUser.id;
    }

    if (existingTask.assignedToId === parsedBody.assignedToId) {
      res.status(200).json({
        message: "Task assignee is unchanged",
        task: existingTask,
      });
      return;
    }

    const updatedTask = await assignTaskToUser(
      parsedParams.id,
      parsedBody.assignedToId,
    );

    const activityAction = !parsedBody.assignedToId
      ? "Task unassigned"
      : parsedBody.assignedToId === currentUser.id
        ? "Task self-assigned"
        : `Task assigned to ${assignedUserName}`;

    await recordTaskActivity(parsedParams.id, activityAction, currentUser.id);

    res.status(200).json({
      message: "Task assignee updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  try {
    const parsedParams = updateTaskParamsSchema.parse(req.params || {});
    const parsedBody = updateTaskSchema.parse(req.body || {});

    const existingTask = await getTaskById(parsedParams.id);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      res.status(500).json({ message: "Default user not found" });
      return;
    }

    let assignedUserName = "Unknown user";
    if (parsedBody.assignedToId) {
      const assignedUser = await getUserById(parsedBody.assignedToId);
      if (!assignedUser) {
        res.status(404).json({ message: "Assigned user not found" });
        return;
      }
      assignedUserName = assignedUser.name || assignedUser.id;
    }

    const updatedTask = await updateTaskById(parsedParams.id, {
      title: parsedBody.title,
      description: parsedBody.description,
      status: parsedBody.status,
      priority: parsedBody.priority,
      category: parsedBody.category,
      startDate: parsedBody.startDate
        ? new Date(parsedBody.startDate)
        : undefined,
      dueDate: parsedBody.dueDate ? new Date(parsedBody.dueDate) : null,
      assignedTo: parsedBody.assignedToId
        ? { connect: { id: parsedBody.assignedToId } }
        : { disconnect: true },
    } as any);

    const assigneeChanged =
      existingTask.assignedToId !== parsedBody.assignedToId;
    const activityAction = assigneeChanged
      ? !parsedBody.assignedToId
        ? "Task unassigned"
        : parsedBody.assignedToId === currentUser.id
          ? "Task self-assigned"
          : `Task assigned to ${assignedUserName}`
      : "Task updated";

    await recordTaskActivity(parsedParams.id, activityAction, currentUser.id);

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (typeof id !== "string" || !id.trim()) {
      res.status(400).json({ message: "Task id is required" });
      return;
    }

    const existingTask = await getTaskById(id);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await deleteTask(id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json(parseZodError(error));
  }
};
