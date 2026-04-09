import { z } from "zod";

export const assignTaskParamsSchema = z.object({
  id: z.string().trim().min(1, "Task id is required"),
});

export const assignTaskBodySchema = z.object({
  assignedToId: z.string().trim().min(1).nullable(),
});
