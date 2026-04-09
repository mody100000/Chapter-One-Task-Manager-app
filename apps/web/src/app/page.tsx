import SprintBoardPageClient from "@/app/TaskClient";
import { apiFetch } from "@/lib/api";
import { buildTaskCounts, type TaskUser } from "@/lib/task-view";
import type { Task } from "@/types/task.types";

type TasksResponse = {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
};

export default async function SprintBoardPage() {
  const [tasksResponse, statsResponse, users] = await Promise.all([
    apiFetch<TasksResponse>("/api/tasks?page=1&pageSize=10"),
    apiFetch<TasksResponse>("/api/tasks?page=1&pageSize=100"),
    apiFetch<TaskUser[]>("/api/users"),
  ]);

  const summary = buildTaskCounts(statsResponse.tasks);

  return (
    <SprintBoardPageClient
      initialTasks={tasksResponse.tasks}
      initialTaskCounts={summary.counts}
      initialTaskTotal={summary.total}
      initialTotalPages={tasksResponse.totalPages}
      initialPageSize={10}
      users={users}
    />
  );
}
