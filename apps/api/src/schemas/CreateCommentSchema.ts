import { z } from "zod";

export const createCommentSchema = z.object({
  taskId: z.string().trim().min(1, "taskId is required"),
  message: z.string().trim().min(1, "message is required"),
});
