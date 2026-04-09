import TaskDetailsPageClient from "@/app/[taskId]/TaskDetailsClient";
import { apiFetch } from "@/lib/api";
import {
  mapTimelineItems,
  type TaskDetails,
  type TaskUser,
} from "@/lib/task-view";

type TimelineResponseItem = {
  type: "comment" | "activity";
  id: string;
  datetime: string;
  message?: string;
  action?: string;
  createdBy?: { name: string | null } | null;
  performedBy?: { name: string | null } | null;
};

type PageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailsPage({ params }: PageProps) {
  const { taskId } = await params;

  try {
    const [task, timeline, users] = await Promise.all([
      apiFetch<TaskDetails>(`/api/tasks/${taskId}`),
      apiFetch<TimelineResponseItem[]>(`/api/comments/task/${taskId}/timeline`),
      apiFetch<TaskUser[]>("/api/users"),
    ]);

    return (
      <TaskDetailsPageClient
        initialTask={task}
        initialTimelineItems={mapTimelineItems(timeline)}
        assignableUsers={users}
      />
    );
  } catch (error) {
    return (
      <div className="bg-[#FAFAFA] px-6 py-8">
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error instanceof Error ? error.message : "Task not found"}
        </div>
      </div>
    );
  }
}
