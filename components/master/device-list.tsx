"use client";

import { useMemo, useState } from "react";
import {
  CollapsibleEmptyState,
  CollapsibleListToolbar,
  SortSelect,
  useCollapsibleList,
} from "./collapsible";
import { deleteDevices } from "@/app/master/devices/actions";
import { DeviceRow } from "./device-row";
import type { PracticePlaylistSlot } from "@/components/device-practice-playlist";

type PracticeOption = {
  id: string;
  name: string;
  email: string;
};

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
  practices: PracticeOption[];
  playlistsByPractice: Record<string, PracticePlaylistSlot[]>;
};

export function DeviceList({ devices, practices, playlistsByPractice }: DeviceListProps) {
  const [sort, setSort] = useState<SortKey>("serial-asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
  const allSelected = sortedIds.length > 0 && sortedIds.every((id) => selectedIds.includes(id));

  return (
    <div>
      <CollapsibleListToolbar
        title="All devices"
        onExpandAll={() => expandAll(sortedIds)}
        onCollapseAll={collapseAll}
        controls={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(allSelected ? [] : sortedIds)}
              className="rounded-full border border-[#1B3A5B]/20 px-3 py-1 text-xs font-extrabold text-[#1B3A5B]"
            >
              {allSelected ? "Clear selection" : "Select all"}
            </button>
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
          </div>
        }
      />
      {selectedIds.length > 0 ? (
        <form
          action={deleteDevices}
          className="flex flex-wrap items-end gap-3 border-b border-[#1B3A5B]/10 bg-rose-50 px-5 py-4"
        >
          {selectedIds.map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          <p className="text-sm font-bold text-rose-900">
            {selectedIds.length} device{selectedIds.length === 1 ? "" : "s"} selected
          </p>
          <label className="text-xs font-bold text-rose-900/80">
            Type DELETE to remove selected assignments
            <input
              name="confirm"
              required
              autoComplete="off"
              placeholder="DELETE"
              className="mt-1 block w-40 rounded-xl border border-rose-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-rose-600 px-4 py-2 text-sm font-extrabold text-white"
          >
            Delete selected
          </button>
        </form>
      ) : null}
      {sorted.length === 0 ? (
        <CollapsibleEmptyState message="No devices yet." />
      ) : (
        sorted.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            practices={practices}
            slots={playlistsByPractice[device.practiceId] ?? []}
            selected={selectedIds.includes(device.id)}
            onSelectedChange={(checked) => {
              setSelectedIds((current) =>
                checked
                  ? [...new Set([...current, device.id])]
                  : current.filter((id) => id !== device.id),
              );
            }}
            isOpen={isOpen(device.id)}
            onToggle={() => toggle(device.id)}
          />
        ))
      )}
    </div>
  );
}
