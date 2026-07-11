"use client";

import { updateDemoLead } from "@/app/master/leads/actions";
import {
  DEMO_LEAD_STATUS_LABELS,
  DEMO_LEAD_STATUSES,
  type DemoLead,
} from "@/lib/demo-leads";
import { CollapsibleRow } from "./collapsible";

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusBadgeClass(status: string) {
  if (status === "new") return "bg-[#5BC0DE]/25 text-[#1B3A5B]";
  if (status === "won") return "bg-emerald-100 text-emerald-800";
  if (status === "lost") return "bg-rose-100 text-rose-800";
  if (status === "qualified") return "bg-amber-100 text-amber-900";
  return "bg-[#1B3A5B]/10 text-[#1B3A5B]/80";
}

type LeadRowProps = {
  lead: DemoLead;
  isOpen: boolean;
  onToggle: () => void;
};

export function LeadRow({ lead, isOpen, onToggle }: LeadRowProps) {
  const statusLabel =
    lead.status in DEMO_LEAD_STATUS_LABELS
      ? DEMO_LEAD_STATUS_LABELS[lead.status as keyof typeof DEMO_LEAD_STATUS_LABELS]
      : lead.status;

  return (
    <CollapsibleRow
      isOpen={isOpen}
      onToggle={onToggle}
      header={
        <>
          <h2 className="text-lg font-extrabold text-[#1B3A5B]">{lead.practiceName}</h2>
          <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
            {lead.contactName} · {lead.email} · {formatWhen(lead.createdAt)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${statusBadgeClass(lead.status)}`}
            >
              {statusLabel}
            </span>
            {lead.operatories ? (
              <span className="rounded-full bg-[#1B3A5B]/10 px-2 py-0.5 text-xs font-extrabold text-[#1B3A5B]/80">
                {lead.operatories} operatory hint
              </span>
            ) : null}
          </div>
        </>
      }
    >
      <div className="space-y-4">
        {lead.message ? (
          <div className="rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/60">
              Message
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold text-[#1B3A5B]/85">
              {lead.message}
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${encodeURIComponent(lead.email)}?subject=${encodeURIComponent(`Serene Scene — ${lead.practiceName}`)}`}
            className="rounded-full bg-[#2B8CB8] px-4 py-2 font-extrabold text-white"
          >
            Email lead
          </a>
          <a
            href={`/master/practices`}
            className="rounded-full border border-[#1B3A5B]/20 px-4 py-2 font-extrabold text-[#1B3A5B]"
          >
            Open practices
          </a>
        </div>

        <form action={updateDemoLead} className="space-y-4 rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4">
          <input type="hidden" name="id" value={lead.id} />
          <label className="block text-sm font-bold">
            Status
            <select
              name="status"
              defaultValue={lead.status}
              className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 bg-white px-3 py-2"
            >
              {DEMO_LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {DEMO_LEAD_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold">
            Internal notes
            <textarea
              name="internalNotes"
              rows={4}
              defaultValue={lead.internalNotes ?? ""}
              placeholder="Call notes, follow-up date, why lost, etc."
              className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 bg-white px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#1B3A5B] px-5 py-2 text-sm font-extrabold text-white"
          >
            Save lead
          </button>
        </form>
      </div>
    </CollapsibleRow>
  );
}
