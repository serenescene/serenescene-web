import { redirect } from "next/navigation";
import { GoogleReviewLinkHelp } from "@/components/google-review-link-help";
import { GoogleReviewRecommendedWarning } from "@/components/google-review-recommended-warning";
import { PracticeShell } from "@/components/practice-shell";
import { suggestedExperienceTitle } from "@/lib/experience-title";
import { getPracticeSession } from "@/lib/practice-auth";
import { completePracticeOnboarding } from "./actions";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PracticeOnboardingPage({ searchParams }: PageProps) {
  const session = await getPracticeSession();
  if (!session) {
    redirect("/practice/login");
  }
  if (!session.needsOnboarding) {
    redirect("/practice/dashboard");
  }

  const { error } = await searchParams;
  const defaultTitle =
    session.experienceTitle ?? suggestedExperienceTitle(session.name);

  const message =
    error === "title"
      ? "Add a name for your patient experience."
      : error === "save"
        ? "Could not save setup. If you added a link, use https://g.page/... or google.com."
        : null;

  return (
    <PracticeShell
      title="Quick setup"
      subtitle="Name your chairside experience. A Google review link is optional but highly recommended."
    >
      {message ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">{message}</div>
      ) : null}

      <form action={completePracticeOnboarding} className="space-y-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
            Step 1 · Patient experience
          </p>
          <label className="mt-2 block text-sm font-extrabold">
            What patients see on the tablet
            <input
              name="experienceTitle"
              required
              defaultValue={defaultTitle}
              className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
            />
          </label>
          <p className="mt-2 text-xs font-bold text-[#1B3A5B]/55">
            Example: &quot;Dr. Smith&apos;s Serene Scene Chairside XR Experience&quot;
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
            Step 2 · Google reviews (optional)
          </p>
          <GoogleReviewRecommendedWarning className="mt-2" />
          <label className="mt-3 block text-sm font-extrabold">
            Your Google review link
            <input
              name="googleReviewUrl"
              type="url"
              defaultValue={session.googleReviewUrl ?? ""}
              placeholder="https://g.page/r/your-practice/review"
              className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
            />
          </label>
          <GoogleReviewLinkHelp />
          <label className="mt-3 flex items-start gap-2 text-sm font-bold">
            <input type="checkbox" name="skipReviewUrl" className="mt-1 h-4 w-4" />
            <span>
              Skip for now — I understand reviews work best when this link is added later
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-[#2B8CB8] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Finish setup
        </button>
      </form>
    </PracticeShell>
  );
}
