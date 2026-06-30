"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import { DeviceRow } from "./device-row";
import type { PracticePlaylistSlot } from "@/components/device-practice-playlist";

export type MasterDevice = {
  id: string;
  practiceId: string;
  serial: string;
  label: string | null;
  lastSeenAt: string | null;
  createdAt: string;
  practiceName: string | null;
  practiceEmail: string | null;
};

type SortKey = "serial-asc" | "serial-desc" | "practice" | "newest" | "last-seen";

type DeviceListProps = {
  devices: MasterDevice[];
  playlistsByPractice: Record<string, PracticePlaylistSlot[]>;
};

export function DeviceList({ devices, playlistsByPractice }: DeviceListProps) {
  const [sort, setSort] = useState<SortKey>("serial-asc");
  const { toggle, expandAll, collapseAll, isOpen } = useCollapsibleList();

  const sorted = useMemo(() => {
    const list = [...devices];
    list.sort((a, b) => {
      switch (sort) {
        case "serial-asc":
          return a.serial.localeCompare(b.serial, undefined, { sensitivity: "base" });
        case "serial-desc":
          return b.serial.localeCompare(a.serial, undefined, { sensitivity: "base" });
        case "practice":
          return (a.practiceName ?? "").localeCompare(b.practiceName ?? "", undefined, {
            sensitivity: "base",
          });
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "last-seen": {
          const aTime = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
          const bTime = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
          return bTime - aTime;
        }
        default:
          return 0;
      }
    });
    return list;
  }, [devices, sort]);

  const sortedIds = sorted.map((device) => device.id);

  return (
    <div>
      <CollapsibleListToolbar
        title="All devices"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { value: "serial-asc", label: "Serial (A–Z)" },
              { value: "serial-desc", label: "Serial (Z–A)" },
              { value: "practice", label: "Practice name" },
              { value: "last-seen", label: "Last seen" },
              { value: "newest", label: "Newest registered" },
            ]}
          />
        }
      />
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No devices yet." />
      ) : (
        sorted.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            slots={playlistsByPractice[device.practiceId] ?? []}
            isOpen={isOpen(device.id)}
            onToggle={() => toggle(device.id)}
          />
        ))
      )}
    </div>
  );
}
