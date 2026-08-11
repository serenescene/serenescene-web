"use client";

import Link from "next/link";
import { FeatureFlagFields } from "@/components/feature-flag-fields";
import { CRM_STAGE_LABELS, CRM_STAGES } from "@/lib/practice-crm";
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_STATUS_LABELS } from "@/lib/subscription-tiers";
import { deleteDevice } from "@/app/master/devices/actions";
import {
  deactivatePractice,
  deletePractice,
  reactivatePractice,
  updatePractice,
} from "@/app/master/practices/actions";
import { CollapsibleRow, CollapsibleSection } from "./collapsible";
import type { MasterPractice, MasterPracticeDevice } from "./practice-list";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatLastSeen(value: string | null) {
  if (!value) return "Never seen";
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Online recently";
  if (diffHours < 48) return `${diffHours}h ago`;
  return formatDate(value);
}

type PracticeRowProps = {
  practice: MasterPractice;
  devices: MasterPracticeDevice[];
  isOpen: boolean;
  onToggle: () => void;
};

export function PracticeRow({ practice, devices, isOpen, onToggle }: PracticeRowProps) {
  const crmStageLabel =
    practice.crmStage && practice.crmStage in CRM_STAGE_LABELS
      ? CRM_STAGE_LABELS[practice.crmStage as keyof typeof CRM_STAGE_LABELS]
      : null;

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggle={onToggle}
      className={practice.active ? "" : "bg-[#FFF8F0]"}
      header={
        <>
          <h2 className="text-lg font-extrabold text-[#1B3A5B]">{practice.name}</h2>
          <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
            {practice.email} · {practice.deviceCount} device(s) · joined{" "}
            {formatDate(practice.createdAt)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {!practice.active ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-extrabold text-rose-800">
                Deactivated
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                Active
              </span>
            )}
            {crmStageLabel ? (
              <span className="rounded-full bg-[#5BC0DE]/25 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]">
                {crmStageLabel}
              </span>
            ) : null}
            {practice.hasGoogleReviewUrl ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-extrabold text-emerald-800">
                Google link
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-extrabold text-amber-900">
                No Google link
              </span>
            )}
          </div>
        </>
      }
    >
      <div className="space-y-4">
          <form action={updatePractice} className="space-y-4">
            <input type="hidden" name="id" value={practice.id} />

            <CollapsibleSection title="Practice info" defaultOpen>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-bold">
                  Name
                  <input
                    name="name"
                    defaultValue={practice.name}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Login email
                  <input
                    readOnly
                    value={practice.email}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 bg-white px-3 py-2 text-[#1B3A5B]/80"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Set new password
                  <input
                    name="password"
                    type="text"
                    autoComplete="new-password"
                    minLength={8}
                    placeholder="Leave blank to keep current password"
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Subscription
                  <select
                    name="subscriptionStatus"
                    defaultValue={practice.subscriptionStatus}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  >
                    {SUBSCRIPTION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {SUBSCRIPTION_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  Google review URL (optional, highly recommended)
                  <input
                    name="googleReviewUrl"
                    type="url"
                    defaultValue={practice.googleReviewUrl ?? ""}
                    placeholder="https://g.page/r/your-practice/review"
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Contact & CRM">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-bold">
                  Primary contact name
                  <input
                    name="contactName"
                    defaultValue={practice.contactName ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Contact phone
                  <input
                    name="contactPhone"
                    type="tel"
                    defaultValue={practice.contactPhone ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  Contact / billing email
                  <input
                    name="contactEmail"
                    type="email"
                    defaultValue={practice.contactEmail ?? ""}
                    placeholder="Optional — separate from portal login"
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  Address line 1
                  <input
                    name="addressLine1"
                    defaultValue={practice.addressLine1 ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  Address line 2
                  <input
                    name="addressLine2"
                    defaultValue={practice.addressLine2 ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  City
                  <input
                    name="city"
                    defaultValue={practice.city ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  State
                  <input
                    name="state"
                    defaultValue={practice.state ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Postal code
                  <input
                    name="postalCode"
                    defaultValue={practice.postalCode ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Planned operatories
                  <input
                    name="operatoriesPlanned"
                    type="number"
                    min={0}
                    max={100}
                    defaultValue={practice.operatoriesPlanned ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  CRM stage
                  <select
                    name="crmStage"
                    defaultValue={practice.crmStage ?? ""}
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  >
                    <option value="">Not set</option>
                    {CRM_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {CRM_STAGE_LABELS[stage]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-bold md:col-span-2">
                  CRM notes
                  <textarea
                    name="crmNotes"
                    rows={4}
                    defaultValue={practice.crmNotes ?? ""}
                    placeholder="Calls, follow-ups, decision makers, install notes…"
                    className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                  />
                </label>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Billing & features">
              <label className="block text-sm font-bold">
                Stripe customer ID
                <input
                  name="stripeCustomerId"
                  defaultValue={practice.stripeCustomerId ?? ""}
                  className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                />
              </label>
              <div className="mt-4">
                <FeatureFlagFields
                  effective={practice.effectiveFeatureFlags}
                  legend={
                    practice.subscriptionStatus === "legacy"
                      ? "Legacy demo toggles (all on by default; practice can edit in portal)"
                      : "Practice feature overrides"
                  }
                />
              </div>
            </CollapsibleSection>

            <button
              type="submit"
              className="rounded-full bg-[#1B3A5B] px-5 py-2 text-sm font-extrabold text-white"
            >
              Save practice
            </button>
          </form>

          <CollapsibleSection title={`Devices (${devices.length})`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#1B3A5B]/70">
                Tablets registered to this practice
              </span>
              <Link
                href="/master/devices"
                className="text-xs font-bold text-[#2B8CB8] underline"
              >
                Manage devices
              </Link>
            </div>
            {devices.length === 0 ? (
              <p className="mt-2 text-sm font-semibold text-[#1B3A5B]/55">
                No tablets registered yet.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {devices.map((device) => (
                  <li
                    key={device.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F8FAFB] px-3 py-2 text-sm font-semibold text-[#1B3A5B]/80"
                  >
                    <span>
                      {device.label?.trim() || "Tablet"} · {device.serial} · Last seen:{" "}
                      {formatLastSeen(device.lastSeenAt)}
                    </span>
                    <form action={deleteDevice} className="flex flex-wrap items-end gap-2">
                      <input type="hidden" name="id" value={device.id} />
                      <input type="hidden" name="confirmSerial" value={device.serial} />
                      <input type="hidden" name="redirectTo" value="practices" />
                      <button
                        type="submit"
                        className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800 hover:bg-rose-200"
                      >
                        Unassign
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Danger zone">
            <div className="flex flex-wrap gap-3">
              {practice.active ? (
                <form action={deactivatePractice}>
                  <input type="hidden" name="id" value={practice.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-amber-500/50 bg-amber-50 px-4 py-2 text-sm font-extrabold text-amber-900"
                  >
                    Deactivate practice
                  </button>
                </form>
              ) : (
                <form action={reactivatePractice}>
                  <input type="hidden" name="id" value={practice.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-emerald-500/50 bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-900"
                  >
                    Reactivate practice
                  </button>
                </form>
              )}

              <form action={deletePractice} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={practice.id} />
                <label className="text-xs font-bold text-[#1B3A5B]/70">
                  Type <span className="font-extrabold text-rose-700">{practice.name}</span> to
                  delete permanently
                  <input
                    name="confirmName"
                    required
                    autoComplete="off"
                    placeholder={practice.name}
                    className="mt-1 block w-64 rounded-xl border border-rose-300 px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-rose-600 px-4 py-2 text-sm font-extrabold text-white"
                >
                  Delete permanently
                </button>
              </form>
              {practice.active ? (
                <p className="w-full text-xs font-semibold text-[#1B3A5B]/55">
                  Active practices can be deleted in one step — typing the name confirms you want
                  this removed.
                </p>
              ) : null}
            </div>
          </CollapsibleSection>
      </div>
    </CollapsibleRow>
  );
}
