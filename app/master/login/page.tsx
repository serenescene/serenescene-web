import { redirect } from "next/navigation";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { loginMasterDashboard } from "./actions";

type MasterLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function MasterLoginPage({
  searchParams,
}: MasterLoginPageProps) {
  if (await isMasterDashboardAuthenticated()) {
    redirect("/master/content");
  }

  const { error } = await searchParams;
  const message =
    error === "config"
      ? "Set ADMIN_DASHBOARD_PASSWORD in serenescene-web/.env, then restart the web server."
      : error === "invalid"
        ? "Incorrect password."
        : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111C] px-6 text-[#F8FAFB]">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 text-[#1B3A5B] shadow-2xl">
        <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#5BC0DE]">
          Master Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-extrabold">Secure Login</h1>
        <p className="mt-3 text-sm text-[#1B3A5B]/65">
          Enter the internal dashboard password to manage content licensing.
        </p>

        {message ? (
          <div className="mt-6 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
            {message}
          </div>
        ) : null}

        <form action={loginMasterDashboard} className="mt-6 space-y-4">
          <label className="block text-sm font-extrabold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 text-lg outline-none focus:border-[#5BC0DE]"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-[#E85A9B] px-5 py-3 font-extrabold text-white hover:opacity-90"
          >
            Enter Dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
