"use client";

import { useMemo, useState } from "react";
import type { FeatureFlags } from "@/lib/feature-flags";
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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4">
        <span className="font-extrabold">Existing practices</span>
        <label className="flex items-center gap-2 text-sm font-bold text-[#1B3A5B]/70">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-[#1B3A5B]/20 bg-white px-3 py-1.5 text-sm font-bold text-[#1B3A5B]"
          >
            <option value="name-asc">Name (A–Z)</option>
            <option value="name-desc">Name (Z–A)</option>
            <option value="status">Status (active first)</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      {sorted.length === 0 ? (
        <div className="px-5 py-12 text-center text-[#1B3A5B]/60">No practices yet.</div>
      ) : (
        sorted.map((practice) => (
          <PracticeRow
            key={practice.id}
            practice={practice}
            devices={devicesByPractice[practice.id] ?? []}
          />
        ))
      )}
    </div>
  );
}
