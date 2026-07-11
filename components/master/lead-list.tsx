"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import { LeadRow } from "./lead-row";
import type { DemoLead } from "@/lib/demo-leads";

type SortKey = "newest" | "oldest" | "name-asc" | "status";

type LeadListProps = {
  leads: DemoLead[];
};

export function LeadList({ leads }: LeadListProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const { toggle, expandAll, collapseAll, isOpen } = useCollapsibleList();

  const sorted = useMemo(() => {
    const list = [...leads];
    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name-asc":
          return a.practiceName.localeCompare(b.practiceName, undefined, { sensitivity: "base" });
        case "status":
          return a.status.localeCompare(b.status) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    return list;
  }, [leads, sort]);

  const sortedIds = sorted.map((lead) => lead.id);

  return (
    <div>
      <CollapsibleListToolbar
        title="Demo & contact leads"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "name-asc", label: "Practice (A–Z)" },
              { value: "status", label: "Status" },
            ]}
          />
        }
      />
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No leads yet. Submissions from the homepage demo form appear here." />
      ) : (
        sorted.map((lead) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            isOpen={isOpen(lead.id)}
            onToggle={() => toggle(lead.id)}
          />
        ))
      )}
    </div>
  );
}
