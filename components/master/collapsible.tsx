"use client";

import { useCallback, useState } from "react";

export function Chevron({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className={`h-5 w-5 shrink-0 text-[#2B8CB8] transition-transform duration-200 ${
        open ? "rotate-180" : ""
      } ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function useCollapsibleList() {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback((ids: string[]) => {
    setOpenIds(new Set(ids));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenIds(new Set());
  }, []);

  const isOpen = useCallback((id: string) => openIds.has(id), [openIds]);

  return { toggle, expandAll, collapseAll, isOpen };
}

type CollapsibleListToolbarProps = {
  title: string;
  hint?: string;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  controls?: React.ReactNode;
};

export function CollapsibleListToolbar({
  title,
  hint = "Click a row to expand details. All rows start collapsed.",
  onExpandAll,
  onCollapseAll,
  controls,
}: CollapsibleListToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4">
      <div>
        <span className="font-extrabold">{title}</span>
        <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">{hint}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExpandAll}
          className="rounded-full border border-[#1B3A5B]/15 bg-white px-3 py-1.5 text-xs font-extrabold text-[#1B3A5B]"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={onCollapseAll}
          className="rounded-full border border-[#1B3A5B]/15 bg-white px-3 py-1.5 text-xs font-extrabold text-[#1B3A5B]"
        >
          Collapse all
        </button>
        {controls}
      </div>
    </div>
  );
}

type CollapsibleRowProps = {
  isOpen: boolean;
  onToggle: () => void;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function CollapsibleRow({
  isOpen,
  onToggle,
  header,
  children,
  className = "",
}: CollapsibleRowProps) {
  return (
    <article className={`border-b border-[#1B3A5B]/10 last:border-b-0 ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F8FAFB]/80"
      >
        <div className="min-w-0 flex-1">{header}</div>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          <span className="hidden text-xs font-bold text-[#1B3A5B]/45 sm:inline">
            {isOpen ? "Collapse" : "Expand"}
          </span>
          <Chevron open={isOpen} />
        </div>
      </button>
      {isOpen ? (
        <div className="border-t border-[#1B3A5B]/10 px-5 pb-5 pt-4">{children}</div>
      ) : null}
    </article>
  );
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB]"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-extrabold text-[#1B3A5B] [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
          className="h-5 w-5 shrink-0 text-[#2B8CB8] transition-transform duration-200 group-open:rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="border-t border-[#1B3A5B]/10 px-4 py-4">{children}</div>
    </details>
  );
}

export function SortSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-bold text-[#1B3A5B]/70">
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-xl border border-[#1B3A5B]/20 bg-white px-3 py-1.5 text-sm font-bold text-[#1B3A5B]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CollapsibleEmptyState({ message }: { message: string }) {
  return <div className="px-5 py-12 text-center text-[#1B3A5B]/60">{message}</div>;
}
