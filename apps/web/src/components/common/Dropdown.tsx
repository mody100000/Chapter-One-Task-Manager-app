"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { Badge } from "@/components/common/Badges";

export type DropdownOption<T extends string | number> = {
  value: T;
  label: string;
  badgeLetter?: string;
  icon?: ComponentType<{ className?: string }>;
  iconClassName?: string;
  dotClassName?: string;
  textClassName?: string;
  bgClassName?: string;
};

type Props<T extends string | number> = {
  label?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export default function Dropdown<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select",
  className = "",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);

    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const valueNode = selected ? (
    <span className="flex items-center gap-2">
      {selected.badgeLetter ? (
        <Badge letter={selected.badgeLetter} size="sm" />
      ) : selected.icon ? (
        <selected.icon
          className={`h-3.5 w-3.5 ${selected.iconClassName ?? "text-zinc-500"}`}
        />
      ) : selected.dotClassName ? (
        <span className={`h-2 w-2 rounded-full ${selected.dotClassName}`} />
      ) : null}
      <span className={selected.textClassName ?? "text-zinc-800"}>
        {selected.label}
      </span>
    </span>
  ) : (
    <span className="text-zinc-400">{placeholder}</span>
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <span className="mb-1.5 block text-xs font-medium text-zinc-700">
          {label}
        </span>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E4E4E7] bg-white px-3 text-sm whitespace-normal disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 lg:whitespace-nowrap"
      >
        {valueNode}
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      {open ? (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white p-1 shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition ${
                  isSelected
                    ? (option.bgClassName ?? "bg-violet-50")
                    : "hover:bg-zinc-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {option.badgeLetter ? (
                    <Badge letter={option.badgeLetter} size="sm" />
                  ) : option.icon ? (
                    <option.icon
                      className={`h-3.5 w-3.5 ${option.iconClassName ?? "text-zinc-500"}`}
                    />
                  ) : option.dotClassName ? (
                    <span
                      className={`h-2 w-2 rounded-full ${option.dotClassName}`}
                    />
                  ) : null}
                  <span className={option.textClassName ?? "text-zinc-700"}>
                    {option.label}
                  </span>
                </span>

                {isSelected ? (
                  <Check className="h-4 w-4 text-[#7C3AED]" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
