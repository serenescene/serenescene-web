import Link from "next/link";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import {
  estimateTotals,
  faq,
  formatUsd,
  funnelSteps,
  PRICING,
  pricingPlans,
} from "@/lib/marketing-content";

export default function PricingPage() {
  const example = estimateTotals(2);

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <MarketingNav />

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2B8CB8]">
          Transparent pricing
        </p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
          Setup and subscription, kept separate
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#1B3A5B]/70">
          Setup and monthly service are billed separately — no hidden bundles.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 pb-12 md:grid-cols-2">
        {(["setup", "subscription"] as const).map((key) => {
          const plan = pricingPlans[key];
          return (
            <div
              key={key}
              className="rounded-3xl border-2 border-[#5BC0DE]/40 bg-white p-8 shadow-sm"
            >
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#2B8CB8]">
                {plan.title}
              </h2>
              <p className="mt-4">
                <span className="text-5xl font-extrabold">{formatUsd(plan.price)}</span>
                <span className="ml-2 text-[#1B3A5B]/60">{plan.period}</span>
              </p>
              <p className="mt-4 text-sm font-semibold text-[#1B3A5B]/75">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm font-bold text-[#1B3A5B]/80">
                {plan.includes.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-3xl bg-[#1B3A5B] p-8 text-center text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-[#5BC0DE]">Example</p>
          <p className="mt-2 text-2xl font-extrabold">
            {example.operatories} operatories = {formatUsd(example.setupTotal)} setup +{" "}
            {formatUsd(example.monthlyTotal)}/mo
          </p>
          <p className="mt-2 text-sm text-white/70">
            {PRICING.termMonths}-month service term · Billed monthly after setup
          </p>
          <Link
            href="/practice/signup?next=/practice/subscribe"
            className="mt-6 inline-block rounded-full bg-[#E85A9B] px-8 py-3 font-extrabold text-white hover:opacity-90"
          >
            Create account & subscribe
          </Link>
        </div>
      </section>

      <section className="border-t border-[#1B3A5B]/10 bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-extrabold">How to get started</h2>
          <ol className="mt-10 space-y-4">
            {funnelSteps.map((step) => (
              <li
                key={step.n}
                className="flex gap-4 rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F4D35E] font-extrabold">
                  {step.n}
                </span>
                <div>
                  <p className="font-extrabold">
                    {"href" in step && step.href ? (
                      <Link href={step.href} className="text-[#2B8CB8] underline">
                        {step.title}
                      </Link>
                    ) : (
                      step.title
                    )}
                  </p>
                  {"body" in step && typeof step.body === "string" ? (
                    <p className="mt-1 text-sm text-[#1B3A5B]/65">{step.body}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-center text-3xl font-extrabold">Common questions</h2>
        <dl className="mt-10 space-y-6">
          {faq.map((item) => (
            <div key={item.q} className="rounded-2xl border border-[#1B3A5B]/10 bg-white p-5">
              <dt className="font-extrabold">{item.q}</dt>
              <dd className="mt-2 text-sm font-semibold text-[#1B3A5B]/75">{item.a}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-center">
          <Link
            href="/practice/subscribe"
            className="rounded-full bg-[#2B8CB8] px-8 py-3 font-extrabold text-white hover:opacity-90"
          >
            Go to checkout
          </Link>
        </p>
      </section>

      <MarketingFooter />
    </main>
  );
}
