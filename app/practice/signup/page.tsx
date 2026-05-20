import Link from "next/link";
import { redirect } from "next/navigation";
import { PracticeShell } from "@/components/practice-shell";
import { getPracticeSession } from "@/lib/practice-auth";
import { signupPracticeAccount } from "./actions";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PracticeSignupPage({ searchParams }: PageProps) {
  const session = await getPracticeSession();
  if (session) {
    redirect(session.needsOnboarding ? "/practice/onboarding" : "/practice/dashboard");
  }

  const { error } = await searchParams;
  const message =
    error === "exists"
      ? "That email is already registered. Sign in instead."
      : error === "invalid"
        ? "Enter practice name, valid email, and a password of at least 8 characters."
        : error === "failed"
          ? "Could not create account. Try again or contact hello@serenescene.app."
          : null;

  return (
    <PracticeShell
      title="Get started"
      subtitle="Create your practice account in under a minute. Next you'll name your chairside experience and add your Google review link."
      footer={
        <p className="text-[#F8FAFB]/70">
          Already have an account?{" "}
          <Link href="/practice/login" className="font-bold text-[#5BC0DE] underline">
            Sign in
          </Link>
        </p>
      }
    >
      {message ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {message}
        </div>
      ) : null}

      <form action={signupPracticeAccount} className="space-y-4">
        <label className="block text-sm font-extrabold">
          Practice or doctor name
          <input
            name="name"
            required
            placeholder="e.g. Dr. Bob's Family Dentistry"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <label className="block text-sm font-extrabold">
          Work email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <label className="block text-sm font-extrabold">
          Password (min 8 characters)
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[#E85A9B] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Continue to setup
        </button>
      </form>
    </PracticeShell>
  );
}
