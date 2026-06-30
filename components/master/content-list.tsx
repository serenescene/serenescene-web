"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import { ContentRow } from "./content-row";

export type MasterContentItem = {
  id: string;
  type: string;
  title: string;
  durationSec: number;
  fileUrl: string;
  playlistPlayCount: number;
  sizeBytes: string;
  active: boolean;
  visibility: string;
  licenseStatus: string;
  sourceName: string | null;
  sourceUrl: string | null;
  creator: string | null;
  vendor: string | null;
  commercialUseAllowed: boolean;
  attributionRequired: boolean;
  attributionText: string | null;
  proofUrl: string | null;
  licenseExpiresAt: string | null;
  licenseNotes: string | null;
  updatedAt: string;
  assignedPracticeIds: string[];
  assignedPractices: { id: string; name: string; email: string }[];
};

export type PracticeOption = {
  id: string;
  name: string;
  email: string;
};

type SortKey = "title-asc" | "title-desc" | "license" | "newest" | "oldest";

type ContentListProps = {
  items: MasterContentItem[];
  practices: PracticeOption[];
};

export function ContentList({ items, practices }: ContentListProps) {
  const [sort, setSort] = useState<SortKey>("title-asc");
  const { toggle, expandAll, collapseAll, isOpen } = useCollapsibleList();

  const sorted = useMemo(() => {
    const list = [...items];
    list.sort((a, b) => {
      switch (sort) {
        case "title-asc":
          return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
        case "title-desc":
          return b.title.localeCompare(a.title, undefined, { sensitivity: "base" });
        case "license":
          return a.licenseStatus.localeCompare(b.licenseStatus);
        case "newest":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "oldest":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        default:
          return 0;
      }
    });
    return list;
  }, [items, sort]);

  const sortedIds = sorted.map((item) => item.id);

  return (
    <div>
      <CollapsibleListToolbar
        title="Editable content library"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "title-asc", label: "Title (A–Z)" },
              { value: "title-desc", label: "Title (Z–A)" },
              { value: "license", label: "License status" },
              { value: "newest", label: "Recently updated" },
              { value: "oldest", label: "Oldest updated" },
            ]}
          />
        }
      />
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No content loaded yet." />
      ) : (
        sorted.map((item) => (
          <ContentRow
            key={item.id}
            item={item}
            practices={practices}
            isOpen={isOpen(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))
      )}
    </div>
  );
}
