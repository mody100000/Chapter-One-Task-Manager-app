import { z } from "zod";
import { TaskPriority, TaskStatus } from "../generated/prisma/enums.js";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().nullable(),
  status: z.enum(Object.values(TaskStatus)).default(TaskStatus.BACKLOG),
  priority: z.enum(Object.values(TaskPriority)).default(TaskPriority.MEDIUM),
  category: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  dueDate: z.iso.datetime().optional().nullable(),
  assignedToId: z.string().optional(),
});

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
