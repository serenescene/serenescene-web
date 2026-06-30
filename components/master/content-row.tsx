"use client";

import { ContentPracticeAssign } from "@/components/content-practice-assign";
import { updateContentItem } from "@/app/master/content/actions";
import { CollapsibleRow, CollapsibleSection } from "./collapsible";
import type { MasterContentItem, PracticeOption } from "./content-list";

function licenseBadgeClass(status: string) {
  if (status === "approved") return "bg-emerald-100 text-emerald-800";
  if (status === "expired" || status === "rejected") {
    return "bg-rose-100 text-rose-800";
  }
  return "bg-yellow-100 text-yellow-800";
}

function formatDate(value: string | null) {
  if (!value) return "None";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function dateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

type ContentRowProps = {
  item: MasterContentItem;
  practices: PracticeOption[];
  isOpen: boolean;
  onToggle: () => void;
};

export function ContentRow({ item, practices, isOpen, onToggle }: ContentRowProps) {
  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggle={onToggle}
      header={
        <>
          <h2 className="text-lg font-extrabold text-[#1B3A5B]">{item.title}</h2>
          <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
            {item.type} · {item.durationSec}s · updated {formatDate(item.updatedAt)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${licenseBadgeClass(
                item.licenseStatus,
              )}`}
            >
              {item.licenseStatus.replace(/_/g, " ")}
            </span>
            <span className="inline-flex rounded-full bg-[#1B3A5B]/10 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]/80">
              {item.visibility.replace(/_/g, " ")}
            </span>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${
                item.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
              }`}
            >
              {item.active ? "Active" : "Inactive"}
            </span>
          </div>
        </>
      }
    >
      <form action={updateContentItem} className="space-y-4">
        <input type="hidden" name="id" value={item.id} />

        <CollapsibleSection title="Catalog & visibility" defaultOpen>
          <div className="space-y-3">
            <a
              href={item.fileUrl}
              className="block truncate text-xs font-bold text-[#2B8CB8] underline"
            >
              {item.fileUrl}
            </a>
            {item.visibility === "client_specific" ? (
              <p className="text-xs text-[#1B3A5B]/60">
                {item.assignedPractices.length > 0
                  ? `Assigned: ${item.assignedPractices.map((p) => p.name).join(", ")}`
                  : "No practices assigned yet"}
              </p>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
                Active
                <select
                  name="active"
                  defaultValue={String(item.active)}
                  className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
              <ContentPracticeAssign
                practices={practices}
                assignedPracticeIds={item.assignedPracticeIds ?? []}
                initialVisibility={item.visibility}
              />
              <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60 sm:col-span-2">
                Playlist plays
                <select
                  name="playlistPlayCount"
                  defaultValue={String(item.playlistPlayCount ?? 1)}
                  className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n === 1 ? "1 (default)" : `${n}× per loop`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Licensing">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
              License status
              <select
                name="licenseStatus"
                defaultValue={item.licenseStatus}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
              >
                <option value="needs_review">Needs review</option>
                <option value="approved">Approved</option>
                <option value="expired">Expired</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
              Commercial use
              <select
                name="commercialUseAllowed"
                defaultValue={String(item.commercialUseAllowed)}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
              Attribution
              <select
                name="attributionRequired"
                defaultValue={String(item.attributionRequired)}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
              >
                <option value="false">Not required</option>
                <option value="true">Required</option>
              </select>
            </label>
            <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
              Expiration
              <input
                name="licenseExpiresAt"
                type="date"
                defaultValue={dateInputValue(item.licenseExpiresAt)}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
              />
            </label>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Sources & proof">
          <div className="grid gap-3">
            <input
              name="sourceName"
              placeholder="Source name"
              defaultValue={item.sourceName ?? ""}
              className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
            />
            <input
              name="sourceUrl"
              placeholder="Source URL"
              defaultValue={item.sourceUrl ?? ""}
              className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="creator"
                placeholder="Creator"
                defaultValue={item.creator ?? ""}
                className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
              />
              <input
                name="vendor"
                placeholder="Vendor"
                defaultValue={item.vendor ?? ""}
                className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
              />
            </div>
            <input
              name="proofUrl"
              placeholder="Proof / receipt URL"
              defaultValue={item.proofUrl ?? ""}
              className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Notes & attribution text">
          <div className="grid gap-3">
            <textarea
              name="attributionText"
              placeholder="Attribution text, if required"
              defaultValue={item.attributionText ?? ""}
              rows={2}
              className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
            />
            <textarea
              name="licenseNotes"
              placeholder="License notes"
              defaultValue={item.licenseNotes ?? ""}
              rows={2}
              className="rounded-xl border border-[#1B3A5B]/15 px-3 py-2 text-sm"
            />
          </div>
        </CollapsibleSection>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-[#E85A9B] px-6 py-2 text-sm font-extrabold text-white hover:opacity-90"
          >
            Save content
          </button>
        </div>
      </form>
    </CollapsibleRow>
  );
}
