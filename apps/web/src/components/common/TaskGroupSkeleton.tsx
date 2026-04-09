import { TaskRowSkeleton } from "./TaskRowSkeleton";

export function TaskGroupSkeleton({ rowCount = 3 }: { rowCount?: number }) {
  return (
    <div className="mx-4 mb-4 overflow-hidden rounded-xl border border-[#F4F4F5] bg-white">
      {/* Group header */}
      <div className="flex items-center gap-2 border-b border-[#F4F4F5] px-4 py-3">
        <div className="h-4 w-4 rounded bg-zinc-200 animate-pulse" />
        <div className="h-3.5 w-24 rounded bg-zinc-200 animate-pulse" />
        <div className="ml-2 h-4 w-6 rounded-full bg-zinc-100 animate-pulse" />
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TaskRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
