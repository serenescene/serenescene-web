import Link from "next/link";
import { PracticeShell } from "@/components/practice-shell";
import { submitForgotPassword } from "./actions";

type PageProps = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function PracticeForgotPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <PracticeShell
      title="Forgot password"
      subtitle="Enter your practice login email. If we find an account, we'll send a reset link (expires in 1 hour)."
      navVariant="public"
      navActive="login"
      footer={
        <p className="text-[#F8FAFB]/70">
          Remember your password?{" "}
          <Link href="/practice/login" className="font-bold text-[#5BC0DE] underline">
            Sign in
          </Link>
        </p>
      }
    >
      {params.sent === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          If an account exists for that email, we sent reset instructions. Check your inbox and
          spam folder.
        </div>
      ) : null}
      {params.error === "missing" ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          Enter your work email.
        </div>
      ) : null}
      {params.error && params.error !== "missing" ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {decodeURIComponent(params.error)}
        </div>
      ) : null}

      {params.sent !== "1" ? (
        <form action={submitForgotPassword} className="space-y-4">
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
          <button
            type="submit"
            className="w-full rounded-full bg-[#2B8CB8] px-5 py-3 font-extrabold text-white hover:opacity-90"
          >
            Send reset link
          </button>
        </form>
      ) : null}
    </PracticeShell>
  );
}
