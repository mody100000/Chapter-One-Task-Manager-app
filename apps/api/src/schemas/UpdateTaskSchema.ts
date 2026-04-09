import { z } from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma/enums.js";

export const updateTaskParamsSchema = z.object({
  id: z.string().trim().min(1, "Task id is required"),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().nullable(),
  status: z.enum(Object.values(TaskStatus)),
  priority: z.enum(Object.values(TaskPriority)),
  category: z.string().nullable(),
  startDate: z.iso.datetime().optional(),
  dueDate: z.iso.datetime().optional().nullable(),
  assignedToId: z.string().trim().min(1).nullable(),
});

export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
