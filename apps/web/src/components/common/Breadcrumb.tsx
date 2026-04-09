"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Checks if a segment looks like an ID (e.g. uuid, numeric, or short hash)
function isId(segment: string) {
  return (
    /^\d+$/.test(segment) || // numeric
    /^[a-f0-9-]{8,}$/i.test(segment) || // uuid / hash
    /^[a-zA-Z0-9]{20,}$/.test(segment) // long alphanumeric id
  );
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = isId(segment) ? "Task Details" : formatSegment(segment);
    const isLast = index === segments.length - 1;
    return { label, href, isLast };
  });

  return (
    <nav className="invisible md:visible flex items-center gap-x-1.5">
      <Link
        href="/"
        className="text-[#71717A] hover:underline flex items-center gap-1"
      >
        Tasks
      </Link>

      {crumbs.map((crumb) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="h-4 w-4 text-[#71717A]" />
          {crumb.isLast ? (
            <h2 className="text-gray-800">{crumb.label}</h2>
          ) : (
            <Link href={crumb.href} className="text-[#71717A] hover:underline">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
