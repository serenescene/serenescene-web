import { redirect } from "next/navigation";
import { FeatureFlagFields } from "@/components/feature-flag-fields";
import { MasterNav } from "@/components/master-nav";
import type { FeatureFlags } from "@/lib/feature-flags";
import { SUBSCRIPTION_STATUSES, SUBSCRIPTION_STATUS_LABELS } from "@/lib/subscription-tiers";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { createPractice, updatePractice } from "./actions";

type Practice = {
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
  createdAt: string;
};

export const dynamic = "force-dynamic";

async function loadPractices(): Promise<{ practices: Practice[]; error: string | null }> {
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
    const data = (await res.json()) as { practices: Practice[] };
    return { practices: data.practices ?? [], error: null };
  } catch {
    return { practices: [], error: "Could not reach the Serene Scene API." };
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function MasterPracticesPage({ searchParams }: PageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const { practices, error } = await loadPractices();

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
          </div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not save practice. Check the form and try again.
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
          <div className="border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4 font-extrabold">
            Existing practices
          </div>
          {practices.length === 0 ? (
            <div className="px-5 py-12 text-center text-[#1B3A5B]/60">No practices yet.</div>
          ) : (
            practices.map((practice) => (
              <form
                key={practice.id}
                action={updatePractice}
                className="border-b border-[#1B3A5B]/10 px-5 py-5 last:border-b-0"
              >
                <input type="hidden" name="id" value={practice.id} />
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#1B3A5B]/55">
                  <span>
                    {practice.email} · {practice.deviceCount} device(s) · joined{" "}
                    {formatDate(practice.createdAt)}
                  </span>
                  {practice.subscriptionStatus === "legacy" ? (
                    <span className="rounded-full bg-[#5BC0DE]/25 px-2 py-0.5 font-extrabold text-[#1B3A5B]">
                      Legacy demo
                    </span>
                  ) : null}
                  {practice.hasGoogleReviewUrl || practice.isGoLiveReady ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-extrabold text-emerald-800">
                      Google link set
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 font-extrabold text-amber-900">
                      Highly recommended: add Google link
                    </span>
                  )}
                </div>
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
                  <label className="block text-sm font-bold md:col-span-2">
                    Stripe customer ID
                    <input
                      name="stripeCustomerId"
                      defaultValue={practice.stripeCustomerId ?? ""}
                      className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                    />
                  </label>
                </div>
                <FeatureFlagFields
                  effective={practice.effectiveFeatureFlags}
                  legend={
                    practice.subscriptionStatus === "legacy"
                      ? "Legacy demo toggles (all on by default; practice can edit in portal)"
                      : "Practice feature overrides"
                  }
                />
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-[#1B3A5B] px-5 py-2 text-sm font-extrabold text-white"
                >
                  Save practice
                </button>
              </form>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
