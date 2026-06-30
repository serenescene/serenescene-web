"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  CollapsibleRow,
  CollapsibleSection,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";

export type FeedbackEntry = {
  id: string;
  starRating: number;
  comment: string | null;
  deviceLabel: string | null;
  createdAt: string;
};

export type PracticeFeedbackGroup = {
  id: string;
  name: string;
  email: string;
  feedback: FeedbackEntry[];
};

type SortKey = "name-asc" | "name-desc" | "most-feedback" | "newest";

type FeedbackListProps = {
  practices: PracticeFeedbackGroup[];
};

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function starsLabel(rating: number) {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`;
}

function averageRating(entries: FeedbackEntry[]) {
  if (entries.length === 0) return null;
  const sum = entries.reduce((total, entry) => total + entry.starRating, 0);
  return (sum / entries.length).toFixed(1);
}

export function FeedbackList({ practices }: FeedbackListProps) {
  const [sort, setSort] = useState<SortKey>("name-asc");
  const { toggle, expandAll, collapseAll, isOpen } = useCollapsibleList();

  const sorted = useMemo(() => {
    const list = [...practices];
    list.sort((a, b) => {
      switch (sort) {
        case "name-asc":
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        case "name-desc":
          return b.name.localeCompare(a.name, undefined, { sensitivity: "base" });
        case "most-feedback":
          return b.feedback.length - a.feedback.length;
        case "newest": {
          const latest = (group: PracticeFeedbackGroup) =>
            group.feedback.reduce(
              (max, entry) => Math.max(max, new Date(entry.createdAt).getTime()),
              0,
            );
          return latest(b) - latest(a);
        }
        default:
          return 0;
      }
    });
    return list;
  }, [practices, sort]);

  const sortedIds = sorted.map((practice) => practice.id);

  if (practices.length === 0) {
    return (
      <div className="rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
        <CollapsibleEmptyState message="No feedback yet." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
      <CollapsibleListToolbar
        title="Feedback by practice"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "name-asc", label: "Practice (A–Z)" },
              { value: "name-desc", label: "Practice (Z–A)" },
              { value: "most-feedback", label: "Most submissions" },
              { value: "newest", label: "Newest activity" },
            ]}
          />
        }
      />
      {sorted.map((practice) => {
        const avg = averageRating(practice.feedback);
        return (
          <CollapsibleRow
            key={practice.id}
            isOpen={isOpen(practice.id)}
            onToggle={() => toggle(practice.id)}
            header={
              <>
                <h2 className="text-lg font-extrabold text-[#1B3A5B]">{practice.name}</h2>
                <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">{practice.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#5BC0DE]/25 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]">
                    {practice.feedback.length} submission
                    {practice.feedback.length === 1 ? "" : "s"}
                  </span>
                  {avg ? (
                    <span className="rounded-full bg-[#E85A9B]/15 px-2 py-0.5 text-xs font-extrabold text-[#E85A9B]">
                      Avg {avg}/5
                    </span>
                  ) : null}
                </div>
              </>
            }
          >
            <div className="space-y-3">
              {practice.feedback.map((entry) => (
                <CollapsibleSection
                  key={entry.id}
                  title={`${starsLabel(entry.starRating)} · ${formatWhen(entry.createdAt)}`}
                >
                  <p className="text-xs font-bold text-[#1B3A5B]/55">
                    {entry.deviceLabel ? `Device: ${entry.deviceLabel}` : "No device label"}
                  </p>
                  {entry.comment ? (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1B3A5B]/85">
                      {entry.comment}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs font-bold text-[#1B3A5B]/45">No comment</p>
                  )}
                </CollapsibleSection>
              ))}
            </div>
          </CollapsibleRow>
        );
      })}
    </div>
  );
}
