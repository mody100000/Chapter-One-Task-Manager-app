"use client";

import { useEffect, useState } from "react";
import { SearchX } from "lucide-react";
import Button from "@/components/common/Button";
import { TaskGroupSkeleton } from "@/components/common/TaskGroupSkeleton";
import TaskFooter from "@/components/TaskFooter";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import SprintBoardHeader from "@/components/tasks/Taskheader";
import TaskGroup from "@/components/tasks/Taskgroup";
import {
  buildTaskCounts,
  DEFAULT_TASK_COUNTS,
  type TaskUser,
} from "@/lib/task-view";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";
import { apiFetch } from "@/utils/api";

const STATUS_ORDER: TaskStatus[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "BACKLOG",
  "DONE",
];

type Props = {
  initialTasks: Task[];
  initialTaskTotal: number;
  initialTaskCounts: Record<TaskStatus, number>;
  initialTotalPages: number;
  initialPageSize: number;
  users: TaskUser[];
};

export default function SprintBoardPageClient({
  initialTasks,
  initialTaskTotal,
  initialTaskCounts,
  initialTotalPages,
  initialPageSize,
  users,
}: Props) {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskCounts, setTaskCounts] = useState(initialTaskCounts);
  const [taskTotal, setTaskTotal] = useState(initialTaskTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [statusFilter, setStatusFilter] = useState<"ALL" | TaskStatus>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<"ALL" | TaskPriority>(
    "ALL",
  );
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | TaskCategory>(
    "ALL",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const loadTasks = async (signal?: AbortSignal) => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (statusFilter !== "ALL") {
      params.set("status", statusFilter);
    }
    if (priorityFilter !== "ALL") {
      params.set("priority", priorityFilter);
    }
    if (categoryFilter !== "ALL") {
      params.set("category", categoryFilter);
    }
    if (search) {
      params.set("search", search);
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<{
        tasks: Task[];
        totalPages: number;
      }>(`/api/tasks?${params.toString()}`, {
        signal,
      });

      setTasks(data.tasks ?? []);
      setTotalPages(Math.max(data.totalPages ?? 1, 1));
    } catch (err) {
      if (!(err instanceof Error) || err.name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTaskStats = async () => {
    try {
      const data = await apiFetch<{ tasks: Task[] }>("/api/tasks?page=1&pageSize=100");
      const summary = buildTaskCounts((data.tasks ?? []) as Task[]);
      setTaskCounts(summary.counts);
      setTaskTotal(summary.total);
    } catch {
      setTaskCounts(DEFAULT_TASK_COUNTS);
      setTaskTotal(0);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    loadTasks(controller.signal);
    return () => controller.abort();
  }, [page, pageSize, statusFilter, priorityFilter, categoryFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, categoryFilter, pageSize]);

  const grouped = STATUS_ORDER.reduce<Record<TaskStatus, Task[]>>(
    (acc, status) => {
      acc[status] = tasks.filter((task) => task.status === status);
      return acc;
    },
    { BACKLOG: [], IN_PROGRESS: [], BLOCKED: [], DONE: [] },
  );

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    Boolean(search);

  const visibleStatuses = hasActiveFilters
    ? STATUS_ORDER.filter((status) => grouped[status].length > 0)
    : STATUS_ORDER;

  return (
    <div className="flex h-full flex-col bg-[#FAFAFA]">
      <SprintBoardHeader
        onAddTask={() => setIsCreateTaskOpen(true)}
        search={searchInput}
        onSearchChange={setSearchInput}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <div className="flex-1 overflow-y-auto py-4">
        {loading ? (
          <div className="py-4">
            <TaskGroupSkeleton rowCount={4} />
            <TaskGroupSkeleton rowCount={2} />
            <TaskGroupSkeleton rowCount={3} />
          </div>
        ) : null}

        {error ? (
          <div className="mx-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {!loading && !error
          ? visibleStatuses.map((status) => (
              <TaskGroup
                key={status}
                status={status}
                tasks={grouped[status]}
                onDeleteTask={(taskId) => {
                  setTasks((prev) => prev.filter((task) => task.id !== taskId));
                  loadTaskStats();

                  if (tasks.length === 1 && page > 1) {
                    setPage((prev) => prev - 1);
                    return;
                  }

                  loadTasks();
                }}
              />
            ))
          : null}

        {!loading && !error && hasActiveFilters && visibleStatuses.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
              <SearchX className="h-6 w-6 text-zinc-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-zinc-700">
              No tasks found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              No tasks match the current filters. Try adjusting your filters or
              search.
            </p>
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-4 flex items-center justify-center gap-2 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <span className="text-xs text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        ) : null}
      </div>

      <TaskFooter counts={taskCounts} total={taskTotal} />

      <CreateTaskModal
        open={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreated={() => {
          if (page === 1) {
            loadTasks();
          } else {
            setPage(1);
          }
          loadTaskStats();
        }}
        users={users}
      />
    </div>
  );
}
