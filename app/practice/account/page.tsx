import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { requirePracticePage } from "@/lib/practice-auth";
import { updatePracticePassword } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function PracticeAccountPage({ searchParams }: PageProps) {
  const { practice } = await requirePracticePage();
  const params = await searchParams;

  const errorMessage =
    params.error === "invalid"
      ? "Enter your current password and a new password of at least 8 characters."
      : params.error === "mismatch"
        ? "New password and confirmation do not match."
        : params.error === "wrong-current"
          ? "Current password is incorrect."
          : params.error === "same-password"
            ? "Choose a password that is different from your current one."
            : params.error === "failed"
              ? "Could not update password. Try again or contact hello@serenescene.app."
              : null;

  return (
    <PracticeShell
      title="Account & security"
      subtitle="Sign-in email and password for your practice portal. Tablets use the same practice login when pairing."
      navVariant="authenticated"
      navActive="account"
      footer={<PracticeLogoutFooter />}
    >
      {params.saved === "1" ? (
        <div className="mb-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 px-4 py-3 text-sm font-bold">
          Password updated. Use your new password on this portal and when pairing tablets.
        </div>
      ) : null}
      {errorMessage ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-2xl bg-[#F8FAFB] p-4 text-sm">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
          Practice
        </p>
        <p className="mt-1 text-lg font-extrabold text-[#1B3A5B]">{practice.name}</p>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
          Login email
        </p>
        <p className="mt-1 font-bold text-[#1B3A5B]/80">{practice.email}</p>
        <p className="mt-2 text-xs font-semibold text-[#1B3A5B]/55">
          To change your login email, contact{" "}
          <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
            hello@serenescene.app
          </a>
          .
        </p>
      </div>

      <form action={updatePracticePassword} className="mt-6 space-y-4">
        <p className="text-sm font-extrabold text-[#1B3A5B]">Change password</p>
        <label className="block text-sm font-bold">
          Current password
          <input
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 outline-none focus:border-[#5BC0DE]"
          />
        </label>
        <label className="block text-sm font-bold">
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
        <label className="block text-sm font-bold">
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
    </PracticeShell>
  );
}
