import Link from "next/link";
import { redirect } from "next/navigation";
import { PracticeShell } from "@/components/practice-shell";
import { getPracticeSession } from "@/lib/practice-auth";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { loginPracticeAccount } from "./actions";

type PageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function PracticeLoginPage({ searchParams }: PageProps) {
  const { error, next: nextRaw } = await searchParams;
  const next = safeRedirectPath(nextRaw, "/practice/dashboard");

  const session = await getPracticeSession();
  if (session) {
    if (session.needsOnboarding) {
      redirect("/practice/onboarding");
    }
    redirect(next);
  }

  const message =
    error === "invalid"
      ? "Email or password did not match."
      : error === "missing"
        ? "Enter your email and password."
        : null;

  return (
    <PracticeShell
      title="Practice sign in"
      subtitle="Manage your Serene Scene setup, review link, and patient experience name."
      navVariant="public"
      navActive="login"
      footer={
        <p className="text-[#F8FAFB]/70">
          New here?{" "}
          <Link href="/practice/signup" className="font-bold text-[#5BC0DE] underline">
            Create your practice account
          </Link>
        </p>
      }
    >
      {message ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">{message}</div>
      ) : null}

      <form action={loginPracticeAccount} className="space-y-4">
        <input type="hidden" name="next" value={next} />
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
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[#E85A9B] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Sign in
        </button>
      </form>
    </PracticeShell>
  );
}
