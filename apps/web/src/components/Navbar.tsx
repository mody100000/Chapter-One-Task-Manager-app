import Breadcrumb from "./common/Breadcrumb";
import { getNameInitials } from "@/lib/string";
import { Badge } from "./common/Badges";
import { currentUser } from "@/constants/currentContext";

export default function Navbar() {
  const firstLetter = getNameInitials(currentUser.name);

  return (
    <header className="flex items-center justify-between border-b border-[#E4E4E7] bg-white px-4 py-3 sm:px-6">
      <Breadcrumb />
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User */}
        <button
          type="button"
          className="transition hover:opacity-80 flex items-center gap-2 rounded-md px-2 py-1"
        >
          <Badge letter={firstLetter} variant="user" />
          <div>
            <p className="truncate text-xs font-semibold text-zinc-900">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-zinc-500">
              {currentUser.email}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
