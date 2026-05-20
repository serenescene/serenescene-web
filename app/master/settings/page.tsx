import { redirect } from "next/navigation";
import { FeatureFlagFields } from "@/components/feature-flag-fields";
import { MasterNav } from "@/components/master-nav";
import type { FeatureFlags } from "@/lib/feature-flags";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { updateGlobalFeatureFlags } from "./actions";

export const dynamic = "force-dynamic";

async function loadGlobalFeatures(): Promise<{
  effective: FeatureFlags;
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      effective: {
        reviewCapture: true,
        kioskAutoplay: true,
        deviceTelemetry: true,
        kioskLockTask: true,
      },
      error: "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/settings/features`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        effective: {
          reviewCapture: true,
          kioskAutoplay: true,
          deviceTelemetry: true,
          kioskLockTask: true,
        },
        error: `Settings API returned ${res.status}. Run the latest API migration.`,
      };
    }
    const data = (await res.json()) as { effective: FeatureFlags };
    return { effective: data.effective, error: null };
  } catch {
    return {
      effective: {
        reviewCapture: true,
        kioskAutoplay: true,
        deviceTelemetry: true,
        kioskLockTask: true,
      },
      error: "Could not reach the Serene Scene API.",
    };
  }
}

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function MasterSettingsPage({ searchParams }: PageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const { effective, error } = await loadGlobalFeatures();

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-3xl">
        <div className="mb-6">
          <MasterNav active="settings" />
        </div>

        <h1 className="text-4xl font-extrabold">Platform features</h1>
        <p className="mt-3 text-[#F8FAFB]/70">
          Turn off features platform-wide if they malfunction or test poorly. Per-practice
          overrides are on the Practices page.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Global feature flags saved.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not save feature flags.
          </div>
        ) : null}

        <form
          action={updateGlobalFeatureFlags}
          className="mt-8 overflow-hidden rounded-3xl bg-white p-6 text-[#1B3A5B] shadow-2xl"
        >
          <FeatureFlagFields
            effective={effective}
            legend="Global defaults (all practices unless overridden)"
          />
          <button
            type="submit"
            className="mt-6 rounded-full bg-[#2B8CB8] px-5 py-2 text-sm font-extrabold text-white"
          >
            Save global features
          </button>
        </form>
      </section>
    </main>
  );
}
