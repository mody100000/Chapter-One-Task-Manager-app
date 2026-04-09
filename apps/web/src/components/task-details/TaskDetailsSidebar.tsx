"use client";

import { User } from "lucide-react";
import Dropdown, { type DropdownOption } from "@/components/common/Dropdown";
import {
  categoryOptions,
  getCategoryConfig,
  priorityConfig,
  priorityOptions,
  statusConfig,
  statusOptions,
} from "@/constants/task";
import { getNameInitials } from "@/lib/string";
import type {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";

type TaskUser = {
  id: string;
  name: string | null;
};

type Props = {
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  assignableUsers: TaskUser[];
  onAssigneeChange: (userId: string | null) => void;
  assignDisabled?: boolean;
  assigneeError?: string | null;
  category: string;
  startDateLabel: string;
  dueDateLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
  createdByLabel: string;
};

export default function TaskDetailsSidebar({
  status,
  priority,
  assigneeId,
  assignableUsers,
  onAssigneeChange,
  assignDisabled = false,
  assigneeError = null,
  category,
  startDateLabel,
  dueDateLabel,
  createdAtLabel,
  updatedAtLabel,
  createdByLabel,
}: Props) {
  const statusMeta = statusConfig[status];
  const StatusIcon = statusOptions.find((item) => item.value === status)?.icon;

  const priorityMeta = priorityConfig[priority];
  const PriorityIcon = priorityOptions.find(
    (item) => item.value === priority,
  )?.icon;

  const categoryMeta = getCategoryConfig(category);
  const CategoryIcon = categoryOptions.find(
    (item) => item.value === (category as TaskCategory),
  )?.icon;
  const assigneeOptions: DropdownOption<string>[] = [
    { value: "", label: "Unassigned", icon: User },
    ...assignableUsers.map((user) => ({
      value: user.id,
      label: user.name || user.id,
      badgeLetter: getNameInitials(user.name || user.id),
    })),
  ];

  const labelClassName = "mb-1 text-xs font-medium uppercase text-zinc-400";

  return (
    <aside className="h-fit border-l border-[#E4E4E7] bg-white p-5 lg:sticky lg:top-0 lg:h-[calc(100vh-0px)]">
      <h3 className="text-sm font-semibold text-zinc-800">Details</h3>

      <div className="mt-4 space-y-4 border-y border-[#E4E4E7] py-4">
        <div>
          <p className={labelClassName}>Status</p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${statusMeta.bg} ${statusMeta.text}`}
          >
            {StatusIcon ? <StatusIcon className="h-3.5 w-3.5" /> : null}
            {statusMeta.label}
          </span>
        </div>

        <div>
          <p className={labelClassName}>Priority</p>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700">
            {PriorityIcon ? (
              <PriorityIcon className={`h-3.5 w-3.5 ${priorityMeta.color}`} />
            ) : null}
            {priorityMeta.label}
          </span>
        </div>

        <div>
          <p className={labelClassName}>Assign</p>
          <Dropdown
            value={assigneeId || ""}
            options={assigneeOptions}
            onChange={(value) => onAssigneeChange(value || null)}
            disabled={assignDisabled}
            placeholder="Unassigned"
          />
          {assigneeError ? (
            <p className="mt-1 text-xs text-red-600">{assigneeError}</p>
          ) : null}
          {assignDisabled ? (
            <p className="mt-1 text-xs text-zinc-500">Updating assignee...</p>
          ) : null}
        </div>

        <div>
          <p className={labelClassName}>Category</p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${categoryMeta.bg} ${categoryMeta.text}`}
          >
            {CategoryIcon ? <CategoryIcon className="h-3.5 w-3.5" /> : null}
            {categoryMeta.label}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div>
          <p className={labelClassName}>Start Date</p>
          <p className="text-sm font-normal text-[#3F3F46]">{startDateLabel}</p>
        </div>
        <div>
          <p className={labelClassName}>Due Date</p>
          <p className="text-sm font-normal text-[#3F3F46]">{dueDateLabel}</p>
        </div>
        <div>
          <p className={labelClassName}>Created</p>
          <p className="text-sm font-normal text-[#3F3F46]">{createdAtLabel}</p>
        </div>
        <div>
          <p className={labelClassName}>Updated</p>
          <p className="text-sm font-normal text-[#3F3F46]">{updatedAtLabel}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
        <User className="h-3.5 w-3.5" />
        Created by {createdByLabel}
      </div>
    </aside>
  );
}
