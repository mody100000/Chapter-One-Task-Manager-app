import type { TaskPriority, TaskStatus } from "../generated/prisma/enums.js";
import type {
  TaskCreateInput,
  TaskUpdateInput,
  TaskWhereInput,
} from "../generated/prisma/models.js";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser } from "../utils/getCurrentUser.js";

export const getTasksWithPaginationAndFiltering = async (
  page: number,
  pageSize: number,
  filter: {
    status?: TaskStatus | undefined;
    priority?: TaskPriority | undefined;
    category?:
      | "BACKEND"
      | "FRONTEND"
      | "DEVOBS"
      | "DESIGN"
      | "TESTING"
      | undefined;
    search?: string | undefined; // search term for title or description
    userAssigned?: string | undefined; // user ID to filter tasks assigned to a specific user
  },
) => {
  const skip = (page - 1) * pageSize;
  const where: TaskWhereInput = {};

  if (filter.status) {
    where.status = filter.status;
  }

  if (filter.priority) {
    where.priority = filter.priority;
  }

  if (filter.category) {
    where.category = filter.category;
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search } },
      { description: { contains: filter.search } },
    ];
  }

  if (filter.userAssigned) {
    where.assignedToId = filter.userAssigned;
  }

  const tasks = await prisma.task.findMany({
    where,
    skip,
    take: pageSize,
    include: {
      assignedTo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalTasks = await prisma.task.count({ where });

  return {
    tasks,
    totalPages: Math.ceil(totalTasks / pageSize),
    currentPage: page,
  };
};

export const createTask = async (data: TaskCreateInput) => {
  const task = await prisma.task.create({
    data,
  });

  await recordTaskActivity(
    task.id,
    "Task created",
    (await getCurrentUser())?.id!,
  );

  return task;
};

export const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      createdBy: true,
    },
  });

  return task;
};

export const archiveTaskById = async (id: string, archivedById: string) => {
  const task = await prisma.task.update({
    where: { id },
    data: {
      archivedById,
    },
  });

  return task;
};

export const restoreTaskById = async (id: string) => {
  const task = await prisma.task.update({
    where: { id },
    data: {
      archivedById: null,
    },
  });

  return task;
};

export const assignTaskToUser = async (
  id: string,
  assignedToId: string | null,
) => {
  const task = await prisma.task.update({
    where: { id },
    data: {
      assignedToId,
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return task;
};

export const updateTaskById = async (id: string, data: TaskUpdateInput) => {
  const task = await prisma.task.update({
    where: { id },
    data,
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return task;
};

export const recordTaskActivity = async (
  taskId: string,
  action: string,
  performedById: string,
) => {
  await prisma.taskActivityLog.create({
    data: {
      task: { connect: { id: taskId } },
      action,
      performedBy: { connect: { id: performedById } },
    },
  });
};

export const deleteTask = async (id: string) => {
  await prisma.$transaction([
    prisma.taskActivityLog.deleteMany({
      where: { taskId: id },
    }),
    prisma.comment.deleteMany({
      where: { taskId: id },
    }),
    prisma.task.delete({
      where: { id },
    }),
  ]);
};
