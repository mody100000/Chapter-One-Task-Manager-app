"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import TaskRow from "./Taskrow";
import type { Task, TaskStatus } from "@/types/task.types";
import { statusConfig } from "@/constants/task";

type Props = {
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
};

const columns = [
  { label: "Name", className: "pl-4 pr-3 w-full" },
  { label: "Assignee", className: "px-3 w-24" },
  { label: "Priority", className: "px-3 w-24" },
  { label: "Start", className: "px-3 w-20 hidden md:table-cell" },
  { label: "Due", className: "px-3 w-20 hidden md:table-cell" },
  { label: "Category", className: "px-3 w-28 hidden lg:table-cell" },
  { label: "Delete", className: "pr-3 w-15" },
];

export default function TaskGroup({ status, tasks, onDeleteTask }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const config = statusConfig[status];

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between px-4 py-2">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          )}

          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>

          <span className="px-1.5 py-0.5 text-xs font-medium text-zinc-500">
            {tasks.length}
          </span>
        </button>
      </div>

      {!collapsed && (
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-[#F4F4F5]">
              {columns.map((col) => (
                <th
                  key={col.label}
                  className={`py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-zinc-400 ${col.className}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 pl-10 text-sm text-zinc-400 bg-white"
                >
                  No tasks
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow key={task.id} task={task} onDelete={onDeleteTask} />
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
