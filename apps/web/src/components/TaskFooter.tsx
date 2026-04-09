import { StatusBadge } from "./common/Badges";
import { statusConfig } from "@/constants/task";
import type { TaskStatus } from "@/types/task.types";

const STATUS_ORDER: TaskStatus[] = [
  "IN_PROGRESS",
  "BLOCKED",
  "BACKLOG",
  "DONE",
];

const defaultCounts: Record<TaskStatus, number> = {
  BACKLOG: 0,
  IN_PROGRESS: 0,
  BLOCKED: 0,
  DONE: 0,
};

type TaskFooterProps = {
  counts?: Record<TaskStatus, number>;
  total?: number;
};

export default function TaskFooter({
  counts = defaultCounts,
  total = 0,
}: TaskFooterProps) {
  return (
    <footer className="flex items-center justify-between border-t border-[#E4E4E7] bg-white px-4 py-3 sm:px-6">
      <span className="text-sm text-[#71717A]">{total} Tasks</span>

      <div className="flex items-center gap-2 sm:gap-4">
        {STATUS_ORDER.map((status) => (
          <StatusBadge
            key={status}
            count={counts[status]}
            label={statusConfig[status].label}
            dotClass={statusConfig[status].dot}
            textClass={statusConfig[status].text}
          />
        ))}
      </div>
    </footer>
  );
}
