"use client";

import {
  DevicePracticePlaylist,
  type PracticePlaylistSlot,
} from "@/components/device-practice-playlist";
import { deleteDevice, updateDevice } from "@/app/master/devices/actions";
import { CollapsibleRow, CollapsibleSection } from "./collapsible";
import type { MasterDevice } from "./device-list";

type PracticeOption = {
  id: string;
  name: string;
  email: string;
};

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
  practices: PracticeOption[];
  slots: PracticePlaylistSlot[];
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export function DeviceRow({
  device,
  practices,
  slots,
  selected,
  onSelectedChange,
  isOpen,
  onToggle,
}: DeviceRowProps) {
  const label = device.label?.trim() || "No label";

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggle={onToggle}
      leading={
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectedChange(e.target.checked)}
          aria-label={`Select ${device.serial}`}
        />
      }
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
          <form action={updateDevice} className="max-w-md space-y-4">
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
            <label className="block text-sm font-bold">
              Assigned practice
              <select
                name="practiceId"
                defaultValue={device.practiceId}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              >
                {practices.map((practice) => (
                  <option key={practice.id} value={practice.id}>
                    {practice.name} ({practice.email})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#1B3A5B] px-5 py-2 text-sm font-extrabold text-white"
            >
              Save device
            </button>
          </form>
        </CollapsibleSection>

        <CollapsibleSection title="Remove assignment">
          <form action={deleteDevice} className="flex max-w-md flex-wrap items-end gap-2">
            <input type="hidden" name="id" value={device.id} />
            <label className="text-xs font-bold text-[#1B3A5B]/70">
              Type <span className="font-extrabold text-rose-700">{device.serial}</span> to
              unassign and delete this device
              <input
                name="confirmSerial"
                required
                autoComplete="off"
                placeholder={device.serial}
                className="mt-1 block w-64 rounded-xl border border-rose-300 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-rose-600 px-4 py-2 text-sm font-extrabold text-white"
            >
              Delete device
            </button>
          </form>
          <p className="mt-2 text-xs font-semibold text-[#1B3A5B]/55">
            Frees the serial so it can be registered to another practice. Session history for
            this tablet is removed; patient feedback is kept without the device link.
          </p>
        </CollapsibleSection>

        <CollapsibleSection title={`Practice playlist (${slots.length} slots)`}>
          <DevicePracticePlaylist practiceId={device.practiceId} slots={slots} />
        </CollapsibleSection>
      </div>
    </CollapsibleRow>
  );
}
