"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import type { MarketingSubscriber } from "@/lib/marketing-subscribers";

type SortKey = "newest" | "oldest" | "email-asc";

type SubscriberListProps = {
  subscribers: MarketingSubscriber[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SubscriberList({ subscribers }: SubscriberListProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const { toggle, expandAll, collapseAll, isOpen } = useCollapsibleList();

  const sorted = useMemo(() => {
    const list = [...subscribers];
    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "email-asc":
          return a.email.localeCompare(b.email, undefined, { sensitivity: "base" });
        default:
          return 0;
      }
    });
    return list;
  }, [subscribers, sort]);

  const sortedIds = sorted.map((subscriber) => subscriber.id);

  return (
    <div>
      <CollapsibleListToolbar
        title="Product update signups"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "email-asc", label: "Email A–Z" },
            ]}
          />
        }
      />
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No product-update signups yet. They appear here when someone subscribes on the marketing site." />
      ) : (
        <ul className="divide-y divide-[#1B3A5B]/10">
          {sorted.map((subscriber) => {
            const open = isOpen(subscriber.id);
            return (
              <li key={subscriber.id}>
                <button
                  type="button"
                  onClick={() => toggle(subscriber.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-[#F8FAFB]"
                  aria-expanded={open}
                >
                  <span className="min-w-0 truncate font-bold">{subscriber.email}</span>
                  <span className="shrink-0 text-sm text-[#1B3A5B]/60">
                    {formatDate(subscriber.createdAt)}
                  </span>
                </button>
                {open ? (
                  <div className="border-t border-[#1B3A5B]/10 bg-[#F8FAFB] px-6 py-4 text-sm">
                    <p>
                      <span className="font-semibold">Source:</span> {subscriber.source}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold">Subscribed:</span>{" "}
                      {formatDate(subscriber.createdAt)}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
