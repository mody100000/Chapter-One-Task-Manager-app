import type { Request, Response } from "express";
import { createCommentSchema } from "../schemas/CreateCommentSchema.js";
import { getTaskTimelineSchema } from "../schemas/GetTaskTimelineSchema.js";
import { getTaskById } from "../services/tasksService.js";
import { createComment, getTaskTimeline } from "../services/commentsService.js";
import { parseZodError } from "../utils/parseZodError.js";
import { getCurrentUser } from "../utils/getCurrentUser.js";

export const createCommentOnTask = async (req: Request, res: Response) => {
  try {
    const parsed = createCommentSchema.parse(req.body || {});

    const task = await getTaskById(parsed.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      res.status(500).json({ message: "Default user not found" });
      return;
    }

    const comment = await createComment(parsed.taskId, parsed.message, currentUser.id);

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};

export const getTaskTimelineHandler = async (req: Request, res: Response) => {
  try {
    const parsed = getTaskTimelineSchema.parse(req.params || {});

    const task = await getTaskById(parsed.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const timeline = await getTaskTimeline(parsed.taskId);
    res.status(200).json(timeline);
  } catch (error) {
    res.status(400).json(parseZodError(error));
  }
};
