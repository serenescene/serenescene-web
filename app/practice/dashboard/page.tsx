import { redirect } from "next/navigation";
import { FeatureFlagFields } from "@/components/feature-flag-fields";
import { GoogleReviewLinkHelp } from "@/components/google-review-link-help";
import { GoogleReviewRecommendedWarning } from "@/components/google-review-recommended-warning";
import { PracticeShell } from "@/components/practice-shell";
import { DEFAULT_FEATURE_FLAGS, type FeatureFlags } from "@/lib/feature-flags";
import { suggestedExperienceTitle } from "@/lib/experience-title";
import { getPracticeSession } from "@/lib/practice-auth";
import { logoutPractice, updatePracticeProfile } from "./actions";
import { updatePracticeFeatureFlags } from "./feature-actions";

type PageProps = {
  searchParams: Promise<{
    welcome?: string;
    saved?: string;
    error?: string;
    review?: string;
    features?: string;
  }>;
};

export default async function PracticeDashboardPage({ searchParams }: PageProps) {
  const session = await getPracticeSession();
  if (!session) {
    redirect("/practice/login");
  }
  if (session.needsOnboarding) {
    redirect("/practice/onboarding");
  }

  const params = await searchParams;
  const experienceTitle =
    session.experienceTitle ?? suggestedExperienceTitle(session.name);
  const hasReviewLink = !!(session.hasGoogleReviewUrl ?? session.googleReviewUrl);
  const isLegacy =
    session.isLegacyTier === true || session.subscriptionStatus === "legacy";
  const effectiveFeatures: FeatureFlags = session.featureFlags ?? DEFAULT_FEATURE_FLAGS;

  return (
    <PracticeShell
      title={`Welcome, ${session.name}`}
      subtitle="Your Serene Scene practice hub. Update your experience name and optional Google review link anytime."
      navVariant="authenticated"
      navActive="dashboard"
      footer={
        <form action={logoutPractice}>
          <button type="submit" className="font-bold text-[#5BC0DE] underline">
            Sign out
          </button>
        </form>
      }
    >
      {params.welcome === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          Setup complete. Our team can install your tablet when you&apos;re ready.
        </div>
      ) : null}
      {params.review === "skipped" ? (
        <GoogleReviewRecommendedWarning className="mb-4" />
      ) : null}
      {params.saved === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          Saved.
        </div>
      ) : null}
      {params.features === "saved" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          Feature toggles saved. Reopen the tablet app to apply.
        </div>
      ) : null}
      {params.error ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {params.error === "review"
            ? "That link does not look like a Google review URL. Use g.page or Google Business Profile."
            : params.error === "features" || params.error === "features-save"
              ? "Could not save feature toggles. Legacy (demo) tier required."
              : "Could not save. Try again."}
        </div>
      ) : null}

      {isLegacy ? (
        <div className="mb-6 rounded-2xl border border-[#5BC0DE]/40 bg-[#5BC0DE]/10 px-4 py-3 text-sm font-bold text-[#1B3A5B]">
          <span className="font-extrabold">Legacy demo tier</span> — all features are unlocked. Use the
          toggles below to demo the app with individual features on or off.
        </div>
      ) : null}

      {!hasReviewLink ? <GoogleReviewRecommendedWarning className="mb-6" /> : null}

      <div className="mb-6 grid gap-3 rounded-2xl bg-[#F8FAFB] p-4 text-sm">
        <div>
          <span className="font-extrabold text-[#1B3A5B]/50">Status</span>
          <p className="font-bold capitalize">{session.subscriptionStatus.replace(/_/g, " ")}</p>
        </div>
        <div>
          <span className="font-extrabold text-[#1B3A5B]/50">Login email</span>
          <p className="font-bold">{session.email}</p>
        </div>
        <div>
          <span className="font-extrabold text-[#1B3A5B]/50">Google review link</span>
          <p className="font-bold">
            {hasReviewLink && session.googleReviewUrl ? (
              <a
                href={session.googleReviewUrl}
                className="text-[#2B8CB8] underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                Connected
              </a>
            ) : (
              <span className="text-amber-800">Not set — highly recommended</span>
            )}
          </p>
        </div>
      </div>

      <form action={updatePracticeProfile} className="space-y-4">
        <label className="block text-sm font-extrabold">
          Patient experience name
          <input
            name="experienceTitle"
            defaultValue={experienceTitle}
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <label className="block text-sm font-extrabold">
          Google review URL <span className="font-bold text-amber-800">(optional, highly recommended)</span>
          <input
            name="googleReviewUrl"
            type="url"
            defaultValue={session.googleReviewUrl ?? ""}
            placeholder="https://g.page/r/..."
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <GoogleReviewLinkHelp />
        <button
          type="submit"
          className="w-full rounded-full bg-[#1B3A5B] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Save profile
        </button>
      </form>

      {isLegacy && session.canEditFeatureFlags !== false ? (
        <form action={updatePracticeFeatureFlags} className="mt-8 space-y-4">
          <h2 className="text-lg font-extrabold text-[#1B3A5B]">Demo feature toggles</h2>
          <FeatureFlagFields
            effective={effectiveFeatures}
            legend="Tablet & app features"
            variant="legacy-demo"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-[#2B8CB8] px-5 py-3 font-extrabold text-white hover:opacity-90"
          >
            Save feature toggles
          </button>
        </form>
      ) : null}

      <div className="mt-8 rounded-2xl border border-[#1B3A5B]/10 p-4 text-sm">
        <p className="font-extrabold">Tablet notes</p>
        <ul className="mt-2 list-inside list-disc space-y-1 font-bold text-[#1B3A5B]/70">
          <li>Patients are never required to rate or review</li>
          <li>
            {hasReviewLink
              ? "Optional “Share feedback” opens your Google review page"
              : "Add a Google link so patients can optionally leave a review in one tap"}
          </li>
        </ul>
        <p className="mt-4 text-xs font-bold text-[#1B3A5B]/50">
          Questions? Email hello@serenescene.app
        </p>
      </div>
    </PracticeShell>
  );
}
