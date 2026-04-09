"use client";

import { Flag, User, Trash2 } from "lucide-react";
import type { Task, TaskCategory } from "@/types/task.types";
import { useRouter } from "next/navigation";

import moment from "moment";
import { getNameInitials, truncateText } from "@/lib/string";
import {
  priorityConfig,
  getCategoryConfig,
  categoryConfig,
} from "@/constants/task";
import { Badge } from "../common/Badges";
import { useState } from "react";
import { apiFetch } from "@/utils/api";
import ConfirmationModal from "@/components/common/ConfirmationModal";

function formatDate(date: string | null) {
  if (!date) return <span className="text-zinc-300">—</span>;
  const formatted = moment.utc(date).format("MMM D");
  return <span className="text-zinc-500">{formatted}</span>;
}

interface TaskRowProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

export default function TaskRow({ task, onDelete }: TaskRowProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const priority = priorityConfig[task.priority]!;
  const category = getCategoryConfig(task.category);
  const firstLetter = getNameInitials(
    categoryConfig[task.category as TaskCategory]?.label || "U",
  );

  const openTaskDetails = () => {
    router.push(`/${task.id}`);
  };

  const handleDelete = async () => {
    await apiFetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });
    setShowDeleteConfirm(false);
    onDelete?.(task.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <tr
        className="group cursor-pointer border-b border-[#F4F4F5] bg-white transition-colors hover:bg-[#EDE9FE98]"
        onClick={openTaskDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openTaskDetails();
          }
        }}
        tabIndex={0}
        aria-label={`Open task ${task.title}`}
      >
        {/* Title */}
        <td className="py-2.5 pl-4 pr-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <Badge
                size="sm"
                letter={firstLetter}
                variant="task"
                className={category.dot}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#09090B]">
                  {task.title}
                </span>
                <span className="text-xs text-[#A1A1AA]">
                  {truncateText(task.description)}
                </span>
              </div>
            </div>
          </div>
        </td>

        {/* Assignee */}
        <td className="px-6 py-2.5">
          {task?.assignedTo ? (
            <Badge
              letter={getNameInitials(
                task.assignedTo.name || task.assignedTo.id,
              )}
              size="sm"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-zinc-300 text-zinc-300">
              <User className="h-3 w-3" />
            </div>
          )}
        </td>

        {/* Priority */}
        <td className="px-3 py-2.5">
          <div className={"flex items-center gap-1.5 text-xs font-medium"}>
            <Flag className={`h-3.5 w-3.5 ${priority.color}`} />
            <span className="hidden sm:inline text-[#3F3F46] text-sm font-normal">
              {priority.label}
            </span>
          </div>
        </td>

        {/* Start */}
        <td className="hidden px-3 py-2.5 text-xs md:table-cell">
          {formatDate(task.startDate)}
        </td>

        {/* Due */}
        <td className="hidden px-3 py-2.5 text-xs md:table-cell">
          {formatDate(task.dueDate)}
        </td>

        {/* Category */}
        <td className="hidden px-3 py-2.5 lg:table-cell">
          <span
            className={`rounded-md ${category.bg} px-2 py-0.5 text-xs font-medium capitalize ${category.text}`}
          >
            {task.category ? task.category : "Uncategorized"}
          </span>
        </td>

        {/* Delete */}
        <td className="py-2.5 pr-7 text-right">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-red-200 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </td>
      </tr>
      {showDeleteConfirm && (
        <ConfirmationModal
          open={showDeleteConfirm}
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
