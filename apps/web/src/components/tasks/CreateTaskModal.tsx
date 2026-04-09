"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { User, X } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Dropdown, { type DropdownOption } from "@/components/common/Dropdown";
import {
  categoryOptions,
  priorityOptions,
  statusOptions,
} from "@/constants/task";
import { getNameInitials } from "@/lib/string";
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";
import { apiFetch } from "@/utils/api";

type TaskUser = {
  id: string;
  name: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
  mode?: "create" | "edit";
  initialTask?: Task | null;
  users?: TaskUser[];
};

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function CreateTaskModal({
  open,
  onClose,
  onCreated,
  mode = "create",
  initialTask = null,
  users,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("BACKLOG");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [category, setCategory] = useState<TaskCategory>("FRONTEND");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState(getTodayDateInputValue());
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignableUsers, setAssignableUsers] = useState<TaskUser[]>([]);

  const dueDateError = useMemo(() => {
    if (!dueDate || !startDate) return "";
    if (new Date(dueDate).getTime() < new Date(startDate).getTime()) {
      return "Due date must be after start date";
    }
    return "";
  }, [dueDate, startDate]);

  const assigneeOptions: DropdownOption<string>[] = [
    { value: "", label: "Unassigned", icon: User },
    ...assignableUsers.map((user) => ({
      value: user.id,
      label: user.name || user.id,
      badgeLetter: getNameInitials(user.name || user.id),
    })),
  ];

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setStatus("BACKLOG");
    setPriority("MEDIUM");
    setCategory("FRONTEND");
    setAssignee("");
    setStartDate(getTodayDateInputValue());
    setDueDate("");
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    if (loading) return;
    onClose();
  }, [loading, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) return;

    if (users?.length) {
      setAssignableUsers(users);
      return;
    }

    const controller = new AbortController();
    apiFetch<TaskUser[]>("/api/users", { signal: controller.signal })
      .then((data) => setAssignableUsers((data || []) as TaskUser[]))
      .catch((fetchError: Error) => {
        if (fetchError.name !== "AbortError") setError(fetchError.message);
      });

    return () => controller.abort();
  }, [open, users]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setCategory(initialTask.category || "FRONTEND");
      setAssignee(initialTask.assignedToId || "");
      setStartDate(toDateInputValue(initialTask.startDate) || getTodayDateInputValue());
      setDueDate(toDateInputValue(initialTask.dueDate));
      setError(null);
      return;
    }

    resetForm();
  }, [open, mode, initialTask, resetForm]);

  if (!open) return null;

  const isEdit = mode === "edit" && !!initialTask;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (dueDateError) {
      setError(dueDateError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{ task: Task }>(
        isEdit ? `/api/tasks/${initialTask.id}` : "/api/tasks",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
            category,
            assignedToId: isEdit ? assignee || null : assignee || undefined,
            startDate: startDate
              ? new Date(`${startDate}T00:00:00`).toISOString()
              : undefined,
            dueDate: dueDate
              ? new Date(`${dueDate}T00:00:00`).toISOString()
              : null,
          }),
        },
      );

      onCreated(data.task as Task);
      onClose();
      toast.success(isEdit ? "Task updated successfully!" : "Task created successfully!");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Failed to ${isEdit ? "update" : "create"} task`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              {isEdit ? "Update Task" : "Create Task"}
            </h2>
            <p className="text-sm text-zinc-500">
              {isEdit
                ? "Edit task details and save your changes."
                : "Add a new task to the sprint board."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md p-1 text-zinc-500 transition hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Task title"
          />

          <Input
            as="textarea"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Task details"
          />

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Dropdown
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
            <Dropdown
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={priorityOptions}
            />
            <Dropdown
              label="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Dropdown
              label="Assignee"
              value={assignee}
              onChange={setAssignee}
              options={assigneeOptions}
              placeholder="Unassigned"
            />
            <Input
              label="Start Date"
              type="date"
              required
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <Input
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              error={dueDateError}
            />
          </div>

          {error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEdit ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
