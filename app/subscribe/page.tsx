import Link from "next/link";
import { redirect } from "next/navigation";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { SubscribeCheckoutForm } from "@/components/marketing/SubscribeCheckoutForm";
import { fetchBillingCheckoutEnabled } from "@/lib/billing-api";
import { funnelSteps, pricingPlans } from "@/lib/marketing-content";
import { getPracticeSession } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ canceled?: string; error?: string; welcome?: string }>;
};

export default async function SubscribePage({ searchParams }: PageProps) {
  const session = await getPracticeSession();
  if (!session) {
    redirect("/practice/signup?next=/subscribe");
  }
  if (session.needsOnboarding) {
    redirect("/practice/onboarding");
  }

  const params = await searchParams;
  const checkoutEnabled = await fetchBillingCheckoutEnabled();

  return (
    <main className="min-h-screen bg-[#07111C] text-[#F8FAFB]">
      <MarketingNav />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5BC0DE]">
          Subscribe
        </p>
        <h1 className="mt-3 text-4xl font-extrabold">Start Serene Scene for {session.name}</h1>
        <p className="mt-4 max-w-2xl text-[#F8FAFB]/70">
          {pricingPlans.setup.description} {pricingPlans.subscription.description}
        </p>

        {params.welcome === "1" ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm font-bold">
            Profile saved. Complete payment below to schedule your operatory install.
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">
            {params.error === "operatories"
              ? "Choose a valid number of operatories."
              : decodeURIComponent(params.error)}
          </div>
        ) : null}

        <div className="mt-8 text-[#1B3A5B]">
          <SubscribeCheckoutForm
            checkoutEnabled={checkoutEnabled}
            canceled={params.canceled === "1"}
          />
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {funnelSteps.map((step) => (
            <li
              key={step.n}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm"
            >
              <span className="font-extrabold text-[#5BC0DE]">Step {step.n}</span>
              <p className="mt-1 font-bold">
                {"href" in step && step.href ? (
                  <Link href={step.href} className="underline">
                    {step.title}
                  </Link>
                ) : (
                  step.title
                )}
              </p>
              {"body" in step && step.body ? (
                <p className="mt-1 text-[#F8FAFB]/60">{step.body}</p>
              ) : null}
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm text-[#F8FAFB]/50">
          Questions?{" "}
          <a href="mailto:hello@serenescene.app" className="text-[#5BC0DE] underline">
            hello@serenescene.app
          </a>
        </p>
      </div>
      <MarketingFooter />
    </main>
  );
}
