import moment from "moment";
import type { Task, TaskStatus } from "@/types/task.types";

export type TaskUser = {
  id: string;
  name: string | null;
};

export type TaskDetails = Task & {
  assignedTo?: TaskUser | null;
  createdBy?: TaskUser | null;
};

export type TimelineFilter = "ALL" | "COMMENTS" | "ACTIVITY";

export type TimelineItem =
  | {
      type: "comment";
      id: string;
      datetime: string;
      actorName: string;
      message: string;
    }
  | {
      type: "activity";
      id: string;
      datetime: string;
      actorName: string;
      action: string;
    };

export const DEFAULT_TASK_COUNTS: Record<TaskStatus, number> = {
  BACKLOG: 0,
  IN_PROGRESS: 0,
  BLOCKED: 0,
  DONE: 0,
};

export function buildTaskCounts(tasks: Task[]) {
  const counts = { ...DEFAULT_TASK_COUNTS };

  tasks.forEach((task) => {
    counts[task.status] += 1;
  });

  return {
    counts,
    total: tasks.length,
  };
}

export function formatTaskDate(date: string | null, withTime = false) {
  if (!date) return "—";

  return withTime
    ? moment.utc(date).format("MMM D, YYYY • HH:mm")
    : moment.utc(date).format("MMM D, YYYY");
}

export function mapTimelineItems(
  items: {
    type: "comment" | "activity";
    id: string;
    datetime: string;
    message?: string;
    action?: string;
    createdBy?: { name: string | null } | null;
    performedBy?: { name: string | null } | null;
  }[],
): TimelineItem[] {
  return items.map((item) => {
    if (item.type === "activity") {
      return {
        type: "activity",
        id: item.id,
        datetime: item.datetime,
        action: item.action || "updated task",
        actorName: item.performedBy?.name || "Unknown user",
      };
    }

    return {
      type: "comment",
      id: item.id,
      datetime: item.datetime,
      message: item.message || "",
      actorName: item.createdBy?.name || "Unknown user",
    };
  });
}
