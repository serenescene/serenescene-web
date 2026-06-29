import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { getPracticeSession } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

export default async function SubscribeSuccessPage() {
  const session = await getPracticeSession();
  if (!session) {
    redirect("/practice/login");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <MarketingNav />
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-3xl border-2 border-emerald-400/40 bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-extrabold text-emerald-800">Payment received</h1>
          <p className="mt-4 text-lg font-semibold text-[#1B3A5B]/80">
            Thank you, {session.name}. We&apos;ll contact you within one business day to schedule
            hardware delivery and operatory setup.
          </p>
          <ul className="mt-6 space-y-2 text-left text-sm font-bold text-[#1B3A5B]/70">
            <li>• Watch for email from hello@serenescene.app</li>
            <li>• Complete your Google review link in the practice portal when ready</li>
            <li>• We&apos;ll register your tablet when your kit ships</li>
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/practice/dashboard"
              className="rounded-full bg-[#2B8CB8] px-6 py-3 font-extrabold text-white hover:opacity-90"
            >
              Open practice portal
            </Link>
            <Link
              href="/practice/billing"
              className="rounded-full border border-[#1B3A5B]/20 px-6 py-3 font-extrabold hover:bg-[#F8FAFB]"
            >
              View billing
            </Link>
          </div>
        </div>
      </div>
      <MarketingFooter />
    </main>
  );
}
