import { z } from "zod";

export const getTaskTimelineSchema = z.object({
  taskId: z.string().trim().min(1, "taskId is required"),
});
