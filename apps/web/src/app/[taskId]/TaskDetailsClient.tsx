"use client";

import { useMemo, useState } from "react";
import {
  categoryOptions,
  getCategoryConfig,
  priorityConfig,
  statusConfig,
  statusOptions,
} from "@/constants/task";
import TaskDetailsCommentsSection from "@/components/task-details/Comments";
import TaskDetailsMainSection from "@/components/task-details/MainSection";
import TaskDetailsSidebar from "@/components/task-details/TaskDetailsSidebar";
import { getNameInitials } from "@/lib/string";
import {
  formatTaskDate,
  mapTimelineItems,
  type TaskDetails,
  type TaskUser,
  type TimelineFilter,
  type TimelineItem,
} from "@/lib/task-view";
import type { Task, TaskCategory, TaskStatus } from "@/types/task.types";
import { apiFetch } from "@/utils/api";
import { currentUser } from "@/constants/currentContext";

type Props = {
  initialTask: TaskDetails;
  initialTimelineItems: TimelineItem[];
  assignableUsers: TaskUser[];
};

export default function TaskDetailsPageClient({
  initialTask,
  initialTimelineItems,
  assignableUsers,
}: Props) {
  const [task, setTask] = useState(initialTask);
  const [timelineItems, setTimelineItems] = useState(initialTimelineItems);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState("");
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("ALL");
  const [comment, setComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [assigningUser, setAssigningUser] = useState(false);
  const [assigneeError, setAssigneeError] = useState("");

  const statusMeta = useMemo(() => {
    const option = statusOptions.find((item) => item.value === task.status);

    return {
      label: statusConfig[task.status as TaskStatus].label,
      textClass: statusConfig[task.status as TaskStatus].text,
      bgClass: statusConfig[task.status as TaskStatus].bg,
      Icon: option?.icon,
    };
  }, [task.status]);

  const categoryMeta = useMemo(() => {
    const normalizedCategory = task.category as TaskCategory;
    const config = getCategoryConfig(task.category);
    const option = categoryOptions.find(
      (item) => item.value === normalizedCategory,
    );

    return {
      label: config.label,
      textClass: config.text,
      bgClass: config.bg,
      Icon: option?.icon,
    };
  }, [task.category]);

  const filteredTimelineItems = useMemo(() => {
    if (timelineFilter === "COMMENTS") {
      return timelineItems.filter((item) => item.type === "comment");
    }
    if (timelineFilter === "ACTIVITY") {
      return timelineItems.filter((item) => item.type === "activity");
    }
    return timelineItems;
  }, [timelineFilter, timelineItems]);

  const currentUserFirstLetter = getNameInitials(currentUser.name);

  const reloadTimeline = async () => {
    setTimelineLoading(true);
    setTimelineError("");

    try {
      const data = await apiFetch<
        {
          type: "comment" | "activity";
          id: string;
          datetime: string;
          message?: string;
          action?: string;
          createdBy?: { name: string | null } | null;
          performedBy?: { name: string | null } | null;
        }[]
      >(`/api/comments/task/${task.id}/timeline`);
      setTimelineItems(mapTimelineItems(data || []));
    } catch (error) {
      setTimelineError(
        error instanceof Error ? error.message : "Failed to fetch timeline",
      );
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!comment.trim()) return;

    const previousItems = timelineItems;
    const optimisticItem: TimelineItem = {
      type: "comment",
      id: `temp-${Date.now()}`,
      datetime: new Date().toISOString(),
      message: comment.trim(),
      actorName: currentUser.name,
    };

    setTimelineItems((prev) => [...prev, optimisticItem]);
    setComment("");
    setCommentSubmitting(true);
    setTimelineError("");

    try {
      await apiFetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          message: optimisticItem.message,
        }),
      });

      await reloadTimeline();
    } catch (error) {
      setTimelineItems(previousItems);
      setComment(optimisticItem.message);
      setTimelineError(
        error instanceof Error ? error.message : "Failed to create comment",
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleAssigneeChange = async (assignedToId: string | null) => {
    const previousTask = task;
    const nextAssignee = assignedToId
      ? assignableUsers.find((user) => user.id === assignedToId) || null
      : null;

    setAssigneeError("");
    setAssigningUser(true);
    setTask({
      ...task,
      assignedToId,
      assignedTo: nextAssignee,
    });

    try {
      const data = await apiFetch<{ task: TaskDetails }>(
        `/api/tasks/${task.id}/assign`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignedToId }),
        },
      );

      setTask(data.task as TaskDetails);
      await reloadTimeline();
    } catch (error) {
      setTask(previousTask);
      setAssigneeError(
        error instanceof Error ? error.message : "Failed to assign task",
      );
    } finally {
      setAssigningUser(false);
    }
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    setTask(updatedTask as TaskDetails);
    await reloadTimeline();
  };

  return (
    <div className="bg-white">
      <div className="relative grid lg:grid-cols-[1fr_300px] lg:items-start">
        <div>
          <TaskDetailsMainSection
            task={task}
            assignableUsers={assignableUsers}
            onTaskUpdated={handleTaskUpdated}
            taskId={task.id}
            title={task.title}
            isArchieved={Boolean(task.archivedById)}
            description={task.description}
            dueDateLabel={formatTaskDate(task.dueDate)}
            priorityLabel={priorityConfig[task.priority].label}
            priorityColorClass={priorityConfig[task.priority].color}
            statusMeta={statusMeta}
            categoryMeta={categoryMeta}
            category={task.category}
          />
          <TaskDetailsCommentsSection
            timelineItems={filteredTimelineItems}
            timelineLoading={timelineLoading}
            timelineError={timelineError || null}
            timelineFilter={timelineFilter}
            onTimelineFilterChange={setTimelineFilter}
            commentValue={comment}
            onCommentChange={setComment}
            onCommentSubmit={handleCreateComment}
            commentSubmitting={commentSubmitting}
            currentUserFirstLetter={currentUserFirstLetter}
          />
        </div>

        <TaskDetailsSidebar
          status={task.status}
          priority={task.priority}
          assigneeId={task.assignedToId}
          assignableUsers={assignableUsers}
          onAssigneeChange={handleAssigneeChange}
          assignDisabled={assigningUser}
          assigneeError={assigneeError || null}
          category={task.category}
          startDateLabel={formatTaskDate(task.startDate)}
          dueDateLabel={formatTaskDate(task.dueDate)}
          createdAtLabel={formatTaskDate(task.createdAt, true)}
          updatedAtLabel={formatTaskDate(task.updatedAt, true)}
          createdByLabel={task.createdBy?.name || task.createdById}
        />
      </div>
    </div>
  );
}
