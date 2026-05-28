import { redirect } from "next/navigation";
import { ContentPracticeAssign } from "@/components/content-practice-assign";
import { MasterNav } from "@/components/master-nav";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { updateContentItem } from "./actions";

type AdminContentItem = {
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

type PracticeOption = {
  id: string;
  name: string;
  email: string;
};

export const dynamic = "force-dynamic";

type AdminContentResponse = {
  items: AdminContentItem[];
};

async function loadPractices(): Promise<{
  practices: PracticeOption[];
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return { practices: [], error: null };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/practices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { practices: [], error: null };
    }
    const data = (await res.json()) as { practices: PracticeOption[] };
    return { practices: data.practices ?? [], error: null };
  } catch {
    return { practices: [], error: null };
  }
}

async function loadContent(): Promise<{
  items: AdminContentItem[];
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      items: [],
      error:
        "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY to load master content.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/content`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        items: [],
        error: `Content API returned ${res.status}. Check the API URL and admin key.`,
      };
    }

    const data = (await res.json()) as AdminContentResponse;
    const items = (data.items ?? []).map((item) => ({
      ...item,
      assignedPracticeIds: item.assignedPracticeIds ?? [],
      assignedPractices: item.assignedPractices ?? [],
    }));
    return { items, error: null };
  } catch {
    return {
      items: [],
      error: "Could not reach the Serene Scene API.",
    };
  }
}

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

type MasterContentPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function MasterContentPage({
  searchParams,
}: MasterContentPageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const [{ items, error }, { practices }] = await Promise.all([
    loadContent(),
    loadPractices(),
  ]);

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <MasterNav active="content" />
        </div>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Content Licensing</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Internal view for content rights, commercial approval, attribution, and catalog readiness.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {items.length} content items
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Content item saved.
          </div>
        ) : null}
        {params.error === "assign-practices" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Client-specific content must be assigned to at least one practice.
          </div>
        ) : null}
        {params.error && params.error !== "assign-practices" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not save that content item. Please check the fields and try again.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <div className="border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/60">
              Editable Content Library
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-5 py-12 text-center text-[#1B3A5B]/60">
              No content loaded yet.
            </div>
          ) : (
            items.map((item) => (
              <form
                key={item.id}
                action={updateContentItem}
                className="border-b border-[#1B3A5B]/10 px-5 py-5 last:border-b-0"
              >
                <input type="hidden" name="id" value={item.id} />

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 lg:col-span-4">
                    <div className="font-extrabold">{item.title}</div>
                    <div className="mt-1 text-xs text-[#1B3A5B]/55">
                      {item.type} · {item.durationSec}s · updated {formatDate(item.updatedAt)}
                    </div>
                    <a
                      href={item.fileUrl}
                      className="mt-2 block truncate text-xs font-bold text-[#2B8CB8] underline"
                    >
                      {item.fileUrl}
                    </a>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${licenseBadgeClass(
                          item.licenseStatus
                        )}`}
                      >
                        {item.licenseStatus.replace(/_/g, " ")}
                      </span>
                      <span className="inline-flex rounded-full bg-[#1B3A5B]/10 px-3 py-1 text-xs font-extrabold text-[#1B3A5B]/80">
                        {item.visibility.replace(/_/g, " ")}
                      </span>
                    </div>
                    {item.visibility === "client_specific" ? (
                      <p className="mt-2 text-xs text-[#1B3A5B]/60">
                        {item.assignedPractices.length > 0
                          ? `Assigned: ${item.assignedPractices.map((p) => p.name).join(", ")}`
                          : "No practices assigned yet"}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-span-12 grid gap-3 sm:grid-cols-2 lg:col-span-4">
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

                    <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
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
                      <span className="mt-1 block text-[11px] font-medium normal-case text-[#1B3A5B]/55">
                        How many times this video plays in each playlist cycle (e.g. ads).
                      </span>
                    </label>
                  </div>

                  <div className="col-span-12 grid gap-3 lg:col-span-4">
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

                  <div className="col-span-12 grid gap-3 lg:col-span-8 lg:col-start-5">
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
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="rounded-full bg-[#E85A9B] px-6 py-2 text-sm font-extrabold text-white hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
