"use client";

import { useMemo, useState } from "react";
import type { FeatureFlags } from "@/lib/feature-flags";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import { PracticeRow } from "./practice-row";

export type MasterPractice = {
  id: string;
  name: string;
  email: string;
  googleReviewUrl: string | null;
  onboardingCompletedAt: string | null;
  hasGoogleReviewUrl: boolean;
  isGoLiveReady: boolean;
  stripeCustomerId: string | null;
  subscriptionStatus: string;
  effectiveFeatureFlags: FeatureFlags;
  deviceCount: number;
  active: boolean;
  deactivatedAt: string | null;
  createdAt: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  crmNotes: string | null;
  crmStage: string | null;
  operatoriesPlanned: number | null;
};

export type MasterPracticeDevice = {
  id: string;
  practiceId: string;
  serial: string;
  label: string | null;
  lastSeenAt: string | null;
  createdAt: string;
};

type SortKey = "name-asc" | "name-desc" | "newest" | "oldest" | "status";

type PracticeListProps = {
  practices: MasterPractice[];
  devicesByPractice: Record<string, MasterPracticeDevice[]>;
};

export function PracticeList({ practices, devicesByPractice }: PracticeListProps) {
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
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "status":
          if (a.active !== b.active) return a.active ? -1 : 1;
          return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
        default:
          return 0;
      }
    });
    return list;
  }, [practices, sort]);

  const sortedIds = sorted.map((practice) => practice.id);

  return (
    <div>
      <CollapsibleListToolbar
        title="Existing practices"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "name-asc", label: "Name (A–Z)" },
              { value: "name-desc", label: "Name (Z–A)" },
              { value: "status", label: "Status (active first)" },
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
            ]}
          />
        }
      />
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No practices yet." />
      ) : (
        sorted.map((practice) => (
          <PracticeRow
            key={practice.id}
            practice={practice}
            devices={devicesByPractice[practice.id] ?? []}
            isOpen={isOpen(practice.id)}
            onToggle={() => toggle(practice.id)}
          />
        ))
      )}
    </div>
  );
}
