import Link from "next/link";
import { DemoRequestForm } from "@/components/DemoRequestForm";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import {
  benefits,
  faq,
  formatUsd,
  hero,
  howItWorks,
  PRICING,
  pricingPlans,
  trustPoints,
} from "@/lib/marketing-content";

type HomeProps = {
  searchParams: Promise<{ demoSent?: string; demoError?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const demoSent = params.demoSent === "1";
  const demoError = params.demoError;

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#07111C] px-6 py-24 text-[#F8FAFB]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2B8CB8_0%,_transparent_55%)] opacity-30" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5BC0DE]">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-7xl">
            {hero.headline}
            <br />
            <span className="text-[#5BC0DE]">{hero.headlineAccent}</span>
            <br />
            <span className="text-[#E85A9B]">{hero.headlineBrand}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#F8FAFB]/75 md:text-xl">
            {hero.subhead}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={hero.primaryCta.href}
              className="rounded-full bg-[#E85A9B] px-8 py-4 text-lg font-extrabold text-white hover:opacity-90"
            >
              {hero.primaryCta.label}
            </Link>
            <a
              href={hero.secondaryCta.href}
              className="rounded-full border border-white/30 px-8 py-4 text-lg font-extrabold hover:bg-white/10"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
          <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#F8FAFB]/55">
            {trustPoints.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl">
          Why practices choose Serene Scene
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-3xl border border-[#1B3A5B]/10 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-extrabold text-[#2B8CB8]">{b.title}</h3>
              <p className="mt-2 text-[#1B3A5B]/75">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-[#1B3A5B]/10 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-extrabold md:text-4xl">How it works</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4D35E] text-xl font-extrabold">
                  {s.step}
                </div>
                <h3 className="text-xl font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm font-semibold text-[#1B3A5B]/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">Simple, per-operatory pricing</h2>
        <p className="mt-3 text-[#1B3A5B]/65">
          Setup and monthly service are billed separately — no hidden bundles.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-[#5BC0DE] bg-white p-8">
            <p className="text-sm font-extrabold uppercase text-[#2B8CB8]">
              {pricingPlans.setup.title}
            </p>
            <p className="mt-2 text-4xl font-extrabold">
              {formatUsd(PRICING.setupPerOperatory)}
              <span className="text-base font-semibold text-[#1B3A5B]/60"> / chair</span>
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#E85A9B] bg-white p-8">
            <p className="text-sm font-extrabold uppercase text-[#E85A9B]">
              {pricingPlans.subscription.title}
            </p>
            <p className="mt-2 text-4xl font-extrabold">
              {formatUsd(PRICING.monthlyPerOperatory)}
              <span className="text-base font-semibold text-[#1B3A5B]/60"> / chair / mo</span>
            </p>
          </div>
        </div>
        <Link
          href="/practice/signup?next=/practice/subscribe"
          className="mt-8 inline-block rounded-full bg-[#2B8CB8] px-8 py-4 font-extrabold text-white hover:opacity-90"
        >
          Get started
        </Link>
        <p className="mt-4 text-sm">
          <Link href="/pricing" className="font-bold text-[#2B8CB8] underline">
            See full pricing & FAQ
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[#1B3A5B]/10 bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-extrabold">Frequently asked</h2>
          <dl className="mt-10 space-y-5">
            {faq.slice(0, 4).map((item) => (
              <div key={item.q} className="rounded-2xl bg-[#F8FAFB] p-5">
                <dt className="font-extrabold">{item.q}</dt>
                <dd className="mt-2 text-sm font-semibold text-[#1B3A5B]/75">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center text-sm">
            <Link href="/pricing#faq" className="font-bold text-[#2B8CB8] underline">
              More questions on the pricing page
            </Link>
          </p>
        </div>
      </section>

      {/* Demo request */}
      <section
        id="demo-request"
        className="border-t border-[#1B3A5B]/10 py-20"
        aria-labelledby="demo-request-heading"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 id="demo-request-heading" className="text-3xl font-extrabold md:text-4xl">
            Request a demo
          </h2>
          <p className="mt-3 text-lg text-[#1B3A5B]/70">
            Tell us about your practice and we&apos;ll follow up within one business day.
          </p>
          {demoSent ? (
            <p className="mt-8 rounded-2xl bg-[#5BC0DE]/15 px-4 py-3 font-bold">
              Thanks — your demo request was received.
            </p>
          ) : null}
          {demoError === "missing" ? (
            <p className="mb-6 mt-8 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 font-bold">
              Please fill in practice name, contact name, and email.
            </p>
          ) : null}
          {demoError === "send" ? (
            <p className="mb-6 mt-8 rounded-2xl bg-[#E85A9B]/15 px-4 py-3 font-bold">
              Something went wrong. Email{" "}
              <a href="mailto:hello@serenescene.app" className="underline">
                hello@serenescene.app
              </a>{" "}
              directly.
            </p>
          ) : null}
          {!demoSent ? (
            <div className="mt-8 text-left">
              <DemoRequestForm />
            </div>
          ) : null}
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
