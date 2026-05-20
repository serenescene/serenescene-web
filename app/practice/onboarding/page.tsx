import { redirect } from "next/navigation";
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
        ? "Could not save setup. Check your review link format (https://...) and try again."
        : null;

  return (
    <PracticeShell
      title="Quick setup"
      subtitle="Two steps — how patients see your experience, and where happy patients leave a Google review. You keep your existing Google listing; we don't create a new one."
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
            Example: &quot;Dr. Bob&apos;s Serene Scene Chairside XR Experience&quot; — this is your
            brand inside Serene Scene, not a new Google page.
          </p>
        </div>

        <div className="rounded-2xl bg-[#5BC0DE]/15 px-4 py-3 text-sm font-bold text-[#1B3A5B]">
          Preview: Patients will be invited to rate their visit after calming content, then open
          your real Google review page in one tap.
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
            Step 2 · Google reviews
          </p>
          <label className="mt-2 block text-sm font-extrabold">
            Your Google review link
            <input
              name="googleReviewUrl"
              type="url"
              placeholder="https://g.page/r/your-practice/review"
              className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
            />
          </label>
          <p className="mt-2 text-xs font-bold text-[#1B3A5B]/55">
            In Google Business Profile: open your location → Share review form → copy link. Paste
            your existing link — we do not replace your Google listing.
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" name="skipReviewUrl" className="h-4 w-4" />
            I&apos;ll add my Google review link later
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
