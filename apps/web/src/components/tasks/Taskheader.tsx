"use client";

import { LayoutList, Plus, Search, MoreVertical } from "lucide-react";
import Button from "@/components/common/Button";
import Dropdown from "@/components/common/Dropdown";
import {
  categoryFilterOptions,
  priorityFilterOptions,
  statusFilterOptions,
} from "@/constants/task";
import type {
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "@/types/task.types";
import { pageSizeOptions } from "../../constants/task";

const views = [{ label: "List", icon: LayoutList }];

type Props = {
  onAddTask?: () => void;
  activeView?: string;
  search: string;
  onSearchChange: (value: string) => void;
  status: "ALL" | TaskStatus;
  onStatusChange: (value: "ALL" | TaskStatus) => void;
  priority: "ALL" | TaskPriority;
  onPriorityChange: (value: "ALL" | TaskPriority) => void;
  category: "ALL" | TaskCategory;
  onCategoryChange: (value: "ALL" | TaskCategory) => void;
  pageSize: number;
  onPageSizeChange: (value: number) => void;
};

export default function SprintBoardHeader({
  onAddTask,
  activeView = "List",
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  category,
  onCategoryChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  return (
    <div>
      <div className="border-b border-[#E4E4E7] bg-[#FAFAFA]">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h1 className="text-2xl font-bold text-[#09090B]">Task Manager</h1>
          <div className="flex items-center gap-2">
            <Button icon={Plus} size="lg" onClick={onAddTask}>
              New Task
            </Button>
          </div>
        </div>

        {/* Views + Filters row */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto px-6 pb-0 scrollbar-none">
          {/* View tabs */}
          <div className="flex items-center gap-0.5">
            {views.map(({ label, icon: Icon }) => {
              const isActive = label === activeView;
              return (
                <button
                  key={label}
                  type="button"
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition whitespace-nowrap
                  ${
                    isActive
                      ? "border-[#7C3AED] text-[#7C3AED]"
                      : "border-transparent text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col gap-2 px-6 pt-4 pb-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Dropdown<"ALL" | TaskStatus>
            value={status}
            onChange={onStatusChange}
            options={statusFilterOptions}
            className="w-36"
          />

          <Dropdown<"ALL" | TaskPriority>
            value={priority}
            onChange={onPriorityChange}
            options={priorityFilterOptions}
            className="w-36"
          />

          <Dropdown<"ALL" | TaskCategory>
            value={category}
            onChange={onCategoryChange}
            options={categoryFilterOptions}
            className="w-36"
          />

          <Dropdown<number>
            value={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeOptions}
            className="w-28"
          />
        </div>

        <label className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-2.5 sm:w-40 lg:w-56">
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks"
            className="w-full border-0 bg-transparent text-xs text-zinc-700 placeholder:text-zinc-400 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
