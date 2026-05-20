import Link from "next/link";
import { redirect } from "next/navigation";
import { PracticeShell } from "@/components/practice-shell";
import { suggestedExperienceTitle } from "@/lib/experience-title";
import { getPracticeSession } from "@/lib/practice-auth";
import { logoutPractice, updatePracticeProfile } from "./actions";

type PageProps = {
  searchParams: Promise<{ welcome?: string; saved?: string; error?: string }>;
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

  return (
    <PracticeShell
      title={`Welcome, ${session.name}`}
      subtitle="Your Serene Scene practice hub. Update your review link anytime — changes apply when the tablet app is reopened."
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
          Setup complete. Our team will help connect your tablet — you can update details below
          anytime.
        </div>
      ) : null}
      {params.saved === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          Saved.
        </div>
      ) : null}
      {params.error ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          Could not save. Check your Google link starts with https://
        </div>
      ) : null}

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
            {session.googleReviewUrl ? (
              <a
                href={session.googleReviewUrl}
                className="text-[#2B8CB8] underline break-all"
                target="_blank"
                rel="noreferrer"
              >
                Connected
              </a>
            ) : (
              <span className="text-[#E85A9B]">Not set — add below for patient reviews</span>
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
          Google review URL
          <input
            name="googleReviewUrl"
            type="url"
            defaultValue={session.googleReviewUrl ?? ""}
            placeholder="https://g.page/r/..."
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[#1B3A5B] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Save changes
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-[#1B3A5B]/10 p-4 text-sm">
        <p className="font-extrabold">Next steps</p>
        <ul className="mt-2 list-inside list-disc space-y-1 font-bold text-[#1B3A5B]/70">
          <li>Our team installs the tablet player and AR glasses</li>
          <li>Patients watch calming content, then tap to leave a Google review</li>
          <li>Questions? Email hello@serenescene.app</li>
        </ul>
        <p className="mt-4 text-xs font-bold text-[#1B3A5B]/50">
          Prefer a call?{" "}
          <Link href="/#contact" className="text-[#2B8CB8] underline">
            Request a demo
          </Link>
        </p>
      </div>
    </PracticeShell>
  );
}
