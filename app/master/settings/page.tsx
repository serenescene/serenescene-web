import { redirect } from "next/navigation";
import { SettingsPanel } from "@/components/master/settings-panel";
import { SplashUpload } from "@/components/master/splash-upload";
import { MasterNav } from "@/components/master-nav";
import type { FeatureFlags } from "@/lib/feature-flags";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

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

async function loadSplashMeta(): Promise<{ hasCustom: boolean; updatedAt: string | null }> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;
  if (!baseUrl || !adminKey) {
    return { hasCustom: false, updatedAt: null };
  }
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/settings/splash`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) return { hasCustom: false, updatedAt: null };
    const data = (await res.json()) as { hasCustom?: boolean; updatedAt?: string | null };
    return { hasCustom: !!data.hasCustom, updatedAt: data.updatedAt ?? null };
  } catch {
    return { hasCustom: false, updatedAt: null };
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
  const [{ effective, error }, splash] = await Promise.all([
    loadGlobalFeatures(),
    loadSplashMeta(),
  ]);
  const apiBaseUrl = process.env.SERENE_SCENE_API_BASE_URL?.replace(/\/$/, "") ?? "";

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
        {params.saved === "splash" ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Splash image saved. Player Devices will use it on the next launch.
          </div>
        ) : null}
        {params.saved === "splash-cleared" ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Custom splash removed. The default logo is back.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {params.error === "splash-file"
              ? "Choose an image file to upload."
              : params.error === "splash-size"
                ? "Image must be 2 MB or smaller."
                : params.error === "splash-type"
                  ? "Use a JPEG, PNG, or WebP image."
                  : params.error === "splash"
                    ? "Could not save the splash image. Deploy the latest API first."
                    : "Could not save feature flags."}
          </div>
        ) : null}

        <div className="mt-8 space-y-6">
          <SplashUpload
            apiBaseUrl={apiBaseUrl}
            hasCustom={splash.hasCustom}
            updatedAt={splash.updatedAt}
          />
          <SettingsPanel effective={effective} />
        </div>
      </section>
    </main>
  );
}
