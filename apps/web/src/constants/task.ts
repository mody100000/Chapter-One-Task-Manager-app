import type {
  TaskCategory,
  TaskStatus,
  TaskPriority,
} from "@/types/task.types";
import type { ComponentType } from "react";
import {
  Bug,
  CheckCircle2,
  Flag,
  Inbox,
  Monitor,
  OctagonAlert,
  PenTool,
  Server,
  Shapes,
  Timer,
} from "lucide-react";

type StyledOption<T extends string | number> = {
  value: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  dotClassName?: string;
  textClassName?: string;
  bgClassName?: string;
};

export const statusConfig: Record<
  TaskStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-blue-500",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  BACKLOG: {
    label: "Backlog",
    dot: "bg-zinc-400",
    text: "text-zinc-500",
    bg: "bg-zinc-100",
  },
  BLOCKED: {
    label: "Blocked",
    dot: "bg-red-500",
    text: "text-red-600",
    bg: "bg-red-50",
  },
  DONE: {
    label: "Done",
    dot: "bg-green-500",
    text: "text-green-600",
    bg: "bg-green-50",
  },
};

export const priorityConfig: Record<
  TaskPriority,
  { label: string; color: string }
> = {
  LOW: { label: "Low", color: "text-zinc-400" },
  MEDIUM: { label: "Medium", color: "text-yellow-500" },
  HIGH: { label: "High", color: "text-red-500" },
};

export const categoryConfig: Record<
  TaskCategory,
  { label: string; text: string; bg: string; dot: string }
> = {
  BACKEND: {
    label: "Backend",
    text: "text-blue-500",
    bg: "bg-blue-100",
    dot: "bg-blue-500",
  },
  FRONTEND: {
    label: "Frontend",
    text: "text-red-500",
    bg: "bg-red-100",
    dot: "bg-red-500",
  },
  DEVOBS: {
    label: "DevObs",
    text: "text-green-500",
    bg: "bg-green-100",
    dot: "bg-green-500",
  },
  DESIGN: {
    label: "Design",
    text: "text-purple-500",
    bg: "bg-purple-100",
    dot: "bg-purple-500",
  },
  TESTING: {
    label: "Testing",
    text: "text-yellow-500",
    bg: "bg-yellow-100",
    dot: "bg-yellow-500",
  },
};

export const statusOptions: StyledOption<TaskStatus>[] = (
  Object.keys(statusConfig) as TaskStatus[]
).map((value) => {
  const config = statusConfig[value];
  const statusIcons = {
    IN_PROGRESS: Timer,
    BACKLOG: Inbox,
    BLOCKED: OctagonAlert,
    DONE: CheckCircle2,
  };

  return {
    value,
    label: config.label,
    icon: statusIcons[value],
    iconClassName: config.text,
    textClassName: config.text,
    bgClassName: config.bg,
  };
});

export const statusFilterOptions: StyledOption<"ALL" | TaskStatus>[] = [
  {
    value: "ALL",
    label: "All status",
    icon: Shapes,
    iconClassName: "text-zinc-500",
    textClassName: "text-zinc-600",
    bgClassName: "bg-zinc-50",
  },
  ...statusOptions,
];

export const priorityOptions: StyledOption<TaskPriority>[] = [
  {
    value: "LOW",
    label: priorityConfig.LOW.label,
    icon: Flag,
    iconClassName: "text-zinc-400",
    textClassName: priorityConfig.LOW.color,
    bgClassName: "bg-zinc-50",
  },
  {
    value: "MEDIUM",
    label: priorityConfig.MEDIUM.label,
    icon: Flag,
    iconClassName: "text-yellow-500",
    textClassName: priorityConfig.MEDIUM.color,
    bgClassName: "bg-yellow-50",
  },
  {
    value: "HIGH",
    label: priorityConfig.HIGH.label,
    icon: Flag,
    iconClassName: "text-red-500",
    textClassName: priorityConfig.HIGH.color,
    bgClassName: "bg-red-50",
  },
];

export const priorityFilterOptions: StyledOption<"ALL" | TaskPriority>[] = [
  {
    value: "ALL",
    label: "All priority",
    icon: Flag,
    iconClassName: "text-zinc-500",
    textClassName: "text-zinc-600",
    bgClassName: "bg-zinc-50",
  },
  ...priorityOptions,
];

export const categoryOptions: StyledOption<TaskCategory>[] = (
  Object.keys(categoryConfig) as TaskCategory[]
).map((value) => {
  const config = categoryConfig[value];
  const categoryIcons = {
    BACKEND: Server,
    FRONTEND: Monitor,
    DEVOBS: Shapes,
    DESIGN: PenTool,
    TESTING: Bug,
  };

  return {
    value,
    label: config.label,
    icon: categoryIcons[value],
    iconClassName: config.text,
    textClassName: config.text,
    bgClassName: config.bg,
  };
});

export const categoryFilterOptions: StyledOption<"ALL" | TaskCategory>[] = [
  {
    value: "ALL",
    label: "All category",
    icon: Shapes,
    iconClassName: "text-zinc-500",
    textClassName: "text-zinc-600",
    bgClassName: "bg-zinc-50",
  },
  ...categoryOptions,
];

export const pageSizeOptions: StyledOption<number>[] = [
  { label: "3 / page", value: 3 },
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
];
// Safe getter for category from backend string
export function getCategoryConfig(category: string) {
  return categoryConfig[category as TaskCategory] || categoryConfig["BACKEND"];
}
