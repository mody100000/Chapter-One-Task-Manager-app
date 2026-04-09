"use client";

import moment from "moment";
import { Circle } from "lucide-react";
import { Badge } from "@/components/common/Badges";
import Button from "@/components/common/Button";
import { getNameInitials } from "@/lib/string";
import type { TimelineFilter, TimelineItem } from "@/lib/task-view";

type Props = {
  timelineItems: TimelineItem[];
  timelineLoading: boolean;
  timelineError: string | null;
  timelineFilter: TimelineFilter;
  onTimelineFilterChange: (value: TimelineFilter) => void;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: () => void;
  commentSubmitting: boolean;
  currentUserFirstLetter: string;
};

const filterOptions: { value: TimelineFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "COMMENTS", label: "Comments" },
  { value: "ACTIVITY", label: "Activity" },
];

export default function TaskDetailsCommentsSection({
  timelineItems,
  timelineLoading,
  timelineError,
  timelineFilter,
  onTimelineFilterChange,
  commentValue,
  onCommentChange,
  onCommentSubmit,
  commentSubmitting,
  currentUserFirstLetter,
}: Props) {
  return (
    <section className="border-t border-[#E4E4E7] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between  px-6 py-4">
        <h2 className="text-sm font-bold text-zinc-800">Comments & Activity</h2>

        {/* 3-button filter row */}
        <div className="flex items-center gap-1.5 p-1">
          {filterOptions.map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              onClick={() => onTimelineFilterChange(opt.value)}
              variant={timelineFilter === opt.value ? "primary" : "outline"}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Timeline */}
        {timelineLoading ? (
          <div className="flex items-center justify-center py-10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#7C3AED] border-t-transparent" />
          </div>
        ) : timelineError ? (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {timelineError}
          </div>
        ) : timelineItems.length === 0 ? (
          <div className="mb-6 rounded-xl border border-dashed border-[#E4E4E7] bg-[#FAFAFA] px-4 py-8 text-center text-sm text-zinc-400">
            Nothing here yet — be the first to comment!
          </div>
        ) : (
          <div className="mb-6">
            {timelineItems.map((item, index) => {
              const isLast = index === timelineItems.length - 1;
              const isActivity = item.type === "activity";

              return (
                <div key={item.id} className="flex gap-4">
                  {/* Left track */}
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    {isActivity ? (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4F4F5] text-zinc-600">
                        <Circle className="h-3.5 w-3.5" />
                      </div>
                    ) : (
                      <Badge
                        letter={getNameInitials(item.actorName)}
                        variant="user"
                        size="sm"
                      />
                    )}
                    <span
                      className={`my-1 block w-px flex-1 ${isLast ? "bg-transparent" : "bg-zinc-200"}`}
                      style={{ minHeight: "16px" }}
                    />
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-4 ${isLast ? "pb-0" : ""}`}>
                    <div className="mb-1 flex flex-wrap items-baseline gap-1">
                      <span className="text-xs text-zinc-400">
                        {isActivity ? item.action : ""} by
                      </span>

                      <span className="text-sm font-semibold text-zinc-800">
                        {item.actorName}
                      </span>
                      <span className="text-[11px] text-zinc-400">·</span>
                      <span className="text-[11px] text-zinc-400">
                        {moment.utc(item.datetime).fromNow()}
                      </span>
                    </div>

                    {/* Comment body */}
                    {item.type === "comment" && (
                      <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3">
                        <p className="whitespace-pre-line text-sm leading-6 text-zinc-700">
                          {item.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Comment composer */}
        <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge letter={currentUserFirstLetter} variant="user" size="sm" />
            <span className="text-xs font-semibold text-zinc-500">
              Add a comment
            </span>
          </div>
          <textarea
            value={commentValue}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Write your comment..."
            rows={3}
            className="mb-3 w-full rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/25 transition-shadow resize-none"
          />
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={onCommentSubmit}
              loading={commentSubmitting}
              disabled={!commentValue.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
