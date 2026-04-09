"use client";

import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, Search, X } from "lucide-react";
import { getNameInitials, getStringInitial } from "@/lib/string";
import { Badge } from "./common/Badges";
import { useRouter } from "next/navigation";
import { currentTeam, currentUser } from "@/constants/currentContext";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const firstLetter = getNameInitials(currentUser.name);
  const teamLetter = getStringInitial(currentTeam.name);

  const sidebarContent = (
    <>
      <div className="px-4 py-5">
        {/* Team header */}
        <div className="mb-5 flex items-start justify-between gap-1.5 px-1 border-b border-[#E4E4E7] pb-5">
          <div className="flex items-start gap-1.5">
            <Badge letter={teamLetter} variant="team" />
            <div className="flex flex-col items-start px-1">
              <p className="font-semibold">{currentTeam.name}</p>
              <p className="text-xs text-[#A1A1AA]">{currentTeam.email}</p>
            </div>
          </div>
          {/* Close — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <div className="space-y-5 mt-10">
          <section className="space-y-2">
            <p className="px-2 text-[10px] font-bold uppercase text-[#A1A1AA]">
              General
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push("/");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl bg-[#EDE9FE] px-3 py-2 text-left text-sm font-medium text-[#7C3AED] transition"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#7C3AED]" />
                  <span>Tasks</span>
                </button>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* User button */}
      <button
        type="button"
        className="mt-auto flex w-full items-center gap-3 border-t border-[#E4E4E7] bg-white px-4 py-3 text-left transition hover:bg-zinc-50"
      >
        <Badge letter={firstLetter} variant="user" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {currentUser.name}
          </p>
          <p className="truncate text-xs text-zinc-500">{currentUser.email}</p>
        </div>
        <LogOut className="h-4 w-4 text-zinc-500" />
      </button>
    </>
  );

  return (
    <>
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-[#E4E4E7] bg-white text-zinc-900 md:flex">
        {sidebarContent}
      </aside>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex items-center justify-center rounded-xl border border-[#E4E4E7] bg-white p-2 text-zinc-500 shadow-sm md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E4E4E7] bg-white text-zinc-900 shadow-xl transition-transform duration-300 ease-in-out md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
