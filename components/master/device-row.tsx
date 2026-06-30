"use client";

import {
  DevicePracticePlaylist,
  type PracticePlaylistSlot,
} from "@/components/device-practice-playlist";
import { updateDevice } from "@/app/master/devices/actions";
import { CollapsibleRow, CollapsibleSection } from "./collapsible";
import type { MasterDevice } from "./device-list";

function formatDateTime(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

type DeviceRowProps = {
  device: MasterDevice;
  slots: PracticePlaylistSlot[];
  isOpen: boolean;
  onToggle: () => void;
};

export function DeviceRow({ device, slots, isOpen, onToggle }: DeviceRowProps) {
  const label = device.label?.trim() || "No label";

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggle={onToggle}
      header={
        <>
          <h2 className="text-lg font-extrabold text-[#1B3A5B]">{device.serial}</h2>
          <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
            {device.practiceName ?? "Unknown practice"}
            {device.practiceEmail ? ` · ${device.practiceEmail}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#1B3A5B]/10 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]/80">
              {label}
            </span>
            <span className="rounded-full bg-[#5BC0DE]/25 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]">
              Last seen {formatDateTime(device.lastSeenAt)}
            </span>
          </div>
        </>
      }
    >
      <div className="space-y-4">
        <CollapsibleSection title="Device details" defaultOpen>
          <form action={updateDevice} className="max-w-md">
            <input type="hidden" name="id" value={device.id} />
            <label className="block text-sm font-bold">
              Label
              <input
                name="label"
                defaultValue={device.label ?? ""}
                placeholder="Chair 1"
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="mt-4 rounded-full bg-[#1B3A5B] px-5 py-2 text-sm font-extrabold text-white"
            >
              Save device
            </button>
          </form>
        </CollapsibleSection>

        <CollapsibleSection title={`Practice playlist (${slots.length} slots)`}>
          <DevicePracticePlaylist practiceId={device.practiceId} slots={slots} />
        </CollapsibleSection>
      </div>
    </CollapsibleRow>
  );
}
