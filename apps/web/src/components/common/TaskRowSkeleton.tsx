export function TaskRowSkeleton() {
  return (
    <tr className="border-b border-[#F4F4F5] bg-white">
      <td className="py-2.5 pl-4 pr-3">
        <div className="flex items-center gap-2.5">
          <div className="h-3.5 w-3.5 shrink-0 rounded bg-zinc-200 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-zinc-200 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-40 rounded bg-zinc-200 animate-pulse" />
              <div className="h-3 w-24 rounded bg-zinc-100 animate-pulse" />
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div className="h-6 w-6 rounded-full bg-zinc-200 animate-pulse" />
      </td>
      <td className="px-3 py-2.5">
        <div className="h-3.5 w-16 rounded bg-zinc-200 animate-pulse" />
      </td>
      <td className="hidden px-3 py-2.5 md:table-cell">
        <div className="h-3.5 w-14 rounded bg-zinc-200 animate-pulse" />
      </td>
      <td className="hidden px-3 py-2.5 md:table-cell">
        <div className="h-3.5 w-14 rounded bg-zinc-200 animate-pulse" />
      </td>
      <td className="hidden px-3 py-2.5 lg:table-cell">
        <div className="h-5 w-20 rounded-md bg-zinc-200 animate-pulse" />
      </td>
      <td className="py-2.5 pr-3 text-right">
        <div className="ml-auto h-6 w-6 rounded-lg bg-zinc-200 animate-pulse" />
      </td>
    </tr>
  );
}
