import { openBillingPortal } from "@/app/practice/actions";
import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { formatSubscriptionStatus } from "@/lib/practice-format";
import { requirePracticePage } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PracticeBillingPage({ searchParams }: PageProps) {
  const { practice } = await requirePracticePage();
  const params = await searchParams;
  const statusLabel = formatSubscriptionStatus(practice.subscriptionStatus);

  return (
    <PracticeShell
      title="Billing & plan"
      subtitle="Subscription status and payment management for your Serene Scene account."
      navVariant="authenticated"
      navActive="billing"
      footer={<PracticeLogoutFooter />}
    >
      {params.error ? (
        <div className="mb-4 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
          {params.error}
        </div>
      ) : null}

      <div className="rounded-2xl bg-[#F8FAFB] p-4 text-sm">
        <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
          Current status
        </p>
        <p className="mt-1 text-2xl font-extrabold capitalize text-[#1B3A5B]">{statusLabel}</p>
        <p className="mt-2 font-bold text-[#1B3A5B]/60">
          Account: {practice.email}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {practice.hasBillingPortal ? (
          <form action={openBillingPortal}>
            <button
              type="submit"
              className="w-full rounded-full bg-[#1B3A5B] px-5 py-3 font-extrabold text-white hover:opacity-90"
            >
              Manage billing in Stripe
            </button>
          </form>
        ) : (
          <div className="rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4 text-sm font-bold text-[#1B3A5B]/75">
            Self-serve billing is not linked yet for this practice. For invoices, payment method, or
            plan changes, email{" "}
            <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
              hello@serenescene.app
            </a>
            .
          </div>
        )}
      </div>

      <ul className="mt-8 list-inside list-disc space-y-2 text-sm font-bold text-[#1B3A5B]/65">
        <li>Per-operatory pricing includes hardware, content updates, and support.</li>
        <li>Patients are never charged — this subscription is for your practice only.</li>
        <li>
          Questions about your contract?{" "}
          <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
            Contact Serene Scene
          </a>
        </li>
      </ul>
    </PracticeShell>
  );
}
