import Link from "next/link";
import { redirect } from "next/navigation";
import { PracticeShell } from "@/components/practice-shell";
import { submitPasswordReset } from "./actions";

type PageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

function formatResetError(error: string | undefined) {
  if (!error) return null;
  if (error === "invalid") {
    return "Enter a new password of at least 8 characters.";
  }
  if (error === "mismatch") {
    return "New password and confirmation do not match.";
  }
  try {
    return decodeURIComponent(error);
  } catch {
    return "Could not reset password. Request a new link.";
  }
}

export default async function PracticeResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.token?.trim() ?? "";
  if (!token) {
    redirect("/practice/forgot-password");
  }

  const errorMessage = formatResetError(params.error);

  return (
    <PracticeShell
      title="Choose a new password"
      subtitle="This link expires in 1 hour and can only be used once."
      navVariant="public"
      navActive="login"
      footer={
        <p className="text-[#F8FAFB]/70">
          <Link href="/practice/login" className="font-bold text-[#5BC0DE] underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      {errorMessage ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {errorMessage}
        </div>
      ) : null}

      <form action={submitPasswordReset} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <label className="block text-sm font-extrabold">
          New password (min 8 characters)
          <input
            name="newPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <label className="block text-sm font-extrabold">
          Confirm new password
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-[#1B3A5B] px-5 py-3 font-extrabold text-white hover:opacity-90"
        >
          Update password
        </button>
      </form>

      <p className="mt-4 text-center text-xs font-semibold text-[#1B3A5B]/55">
        Link expired?{" "}
        <Link href="/practice/forgot-password" className="text-[#2B8CB8] underline">
          Request a new one
        </Link>
      </p>
    </PracticeShell>
  );
}
