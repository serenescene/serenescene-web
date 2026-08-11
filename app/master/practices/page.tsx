import { redirect } from "next/navigation";
import { MasterNav } from "@/components/master-nav";
import {
  PracticeList,
  type MasterPractice,
  type MasterPracticeDevice,
} from "@/components/master/practice-list";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { createPractice } from "./actions";
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_STATUS_LABELS } from "@/lib/subscription-tiers";

export const dynamic = "force-dynamic";

async function loadPractices(): Promise<{ practices: MasterPractice[]; error: string | null }> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      practices: [],
      error: "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/practices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { practices: [], error: `Practices API returned ${res.status}.` };
    }
    const data = (await res.json()) as { practices: MasterPractice[] };
    const practices = (data.practices ?? []).map((practice) => ({
      ...practice,
      active: practice.active ?? true,
      contactName: practice.contactName ?? null,
      contactPhone: practice.contactPhone ?? null,
      contactEmail: practice.contactEmail ?? null,
      addressLine1: practice.addressLine1 ?? null,
      addressLine2: practice.addressLine2 ?? null,
      city: practice.city ?? null,
      state: practice.state ?? null,
      postalCode: practice.postalCode ?? null,
      crmNotes: practice.crmNotes ?? null,
      crmStage: practice.crmStage ?? null,
      operatoriesPlanned: practice.operatoriesPlanned ?? null,
    }));
    return { practices, error: null };
  } catch {
    return { practices: [], error: "Could not reach the Serene Scene API." };
  }
}

async function loadDevices(): Promise<MasterPracticeDevice[]> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;
  if (!baseUrl || !adminKey) return [];

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/devices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { devices: MasterPracticeDevice[] };
    return data.devices ?? [];
  } catch {
    return [];
  }
}

type PageProps = {
  searchParams: Promise<{
    saved?: string;
    password?: string;
    error?: string;
    deactivated?: string;
    reactivated?: string;
    deleted?: string;
  }>;
};

export default async function MasterPracticesPage({ searchParams }: PageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const [{ practices, error }, devices] = await Promise.all([
    loadPractices(),
    loadDevices(),
  ]);
  const devicesByPractice = devices.reduce<Record<string, MasterPracticeDevice[]>>((acc, device) => {
    (acc[device.practiceId] ??= []).push(device);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <MasterNav active="practices" />
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Practices</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Onboard dental offices. Google review links are optional but highly recommended.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {practices.length} practices
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Practice saved.
            {params.password === "1"
              ? " New login password is active — share it with the practice securely."
              : null}
          </div>
        ) : null}
        {params.deactivated === "1" ? (
          <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-400/15 p-4 text-sm font-bold">
            Practice deactivated. Tablets can no longer sign in or load content.
          </div>
        ) : null}
        {params.reactivated === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Practice reactivated.
          </div>
        ) : null}
        {params.deleted === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Practice permanently deleted.
          </div>
        ) : null}
        {params.deleted === "device" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Device unassigned. The serial can be registered again.
          </div>
        ) : null}
        {params.error === "delete-confirm" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Practice name did not match. Deletion was cancelled.
          </div>
        ) : null}
        {params.error &&
        params.error !== "delete-confirm" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {params.error === "deactivate"
              ? "Could not deactivate that practice."
              : params.error === "reactivate"
                ? "Could not reactivate that practice."
                : params.error === "delete"
                  ? "Could not delete that practice. If it has tablets or session history, deploy the latest API and run migrations, then try again."
                  : "Could not save practice. Check the form and try again."}
          </div>
        ) : null}

        <div className="mb-8 overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <div className="border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4 font-extrabold">
            Add practice
          </div>
          <form action={createPractice} className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <label className="block text-sm font-bold">
              Practice name
              <input
                name="name"
                required
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-bold">
              Login email
              <input
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-bold">
              Temporary password (min 8 chars)
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-bold">
              Subscription status
              <select
                name="subscriptionStatus"
                defaultValue="trial"
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
                placeholder="https://g.page/r/your-practice/review"
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
              <span className="mt-1 block text-xs font-bold text-[#1B3A5B]/55">
                Optional — patients can skip ratings. Most practices add this for one-tap Google reviews.
              </span>
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-[#2B8CB8] px-5 py-2 text-sm font-extrabold text-white"
              >
                Create practice
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <PracticeList practices={practices} devicesByPractice={devicesByPractice} />
        </div>
      </section>
    </main>
  );
}
