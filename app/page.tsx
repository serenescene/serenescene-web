import { DemoRequestForm } from "@/components/DemoRequestForm";
import { Nav } from "@/components/Nav";

const DEMO_MAILTO =
  "mailto:hello@serenescene.app?subject=Serene%20Scene%20Demo%20Request";

type HomeProps = {
  searchParams: Promise<{ demoSent?: string; demoError?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const demoSent = params.demoSent === "1";
  const demoError = params.demoError;

  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <Nav />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Calm patients.<br />
          <span className="text-[#5BC0DE]">Better reviews.</span><br />
          <span className="text-[#E85A9B]">Serene Scene.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#1B3A5B]/70 max-w-2xl mx-auto mb-10">
          Serene Scene transforms the dental chair into an immersive escape — improving patient comfort and your practice&apos;s satisfaction ratings.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/practice/signup"
            className="inline-block bg-[#2B8CB8] text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90"
          >
            Get started free
          </a>
          <a
            href="#contact"
            className="inline-block bg-[#E85A9B] text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90"
          >
            Request a Demo
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How it works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { n: "1", t: "Patient settles in", d: "Your assistant places lightweight XR glasses on the patient before the procedure begins." },
            { n: "2", t: "They escape", d: "Calming nature scenes and ambient music fill their view, distracting from the sights and sounds of the procedure." },
            { n: "3", t: "You earn the review", d: "After the visit, patients rate their experience and are invited to leave a Google review — at peak relaxation." },
          ].map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D35E] text-[#1B3A5B] text-2xl font-bold flex items-center justify-center mb-4">
                {s.n}
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.t}</h3>
              <p className="text-[#1B3A5B]/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-center text-[#1B3A5B]/60 mb-12">One plan. Everything included.</p>
          <div className="p-10 rounded-2xl border-2 border-[#5BC0DE] bg-[#F8FAFB]">
            <div className="text-[#5BC0DE] font-semibold mb-2 text-center">Per Operatory</div>
            <div className="text-center mb-2">
              <span className="text-5xl font-bold">$249</span>
              <span className="text-xl font-normal">/month</span>
            </div>
            <div className="text-sm text-[#1B3A5B]/60 mb-1 text-center">+ $1,000 one-time setup</div>
            <div className="text-sm text-[#1B3A5B]/60 mb-8 text-center">24-month term</div>
            <ul className="space-y-3 text-[#1B3A5B]/80 max-w-md mx-auto">
              <li>✓ XR glasses + Android player included</li>
              <li>✓ Full content library, updated monthly</li>
              <li>✓ Patient satisfaction analytics dashboard</li>
              <li>✓ Automated Google review invitations</li>
              <li>✓ Staff training & onboarding</li>
              <li>✓ Hardware swap on failure</li>
            </ul>
            <div className="text-center mt-8">
              <a
                href={DEMO_MAILTO}
                className="inline-block bg-[#E85A9B] text-white px-8 py-3 rounded-full font-semibold hover:opacity-90"
              >
                Get Started
              </a>
            </div>
          </div>
          <p className="text-center text-sm text-[#1B3A5B]/50 mt-6">
            Multiple operatories? <a href="#contact" className="underline">Ask about volume pricing.</a>
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-3xl mx-auto px-8 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to give your patients a serene scene?</h2>
        <p className="text-xl text-[#1B3A5B]/70 mb-8">
          Email us and we&apos;ll set up a 15-minute demo.
        </p>
        <a
          href="mailto:hello@serenescene.app"
          className="inline-block bg-[#E85A9B] text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90"
        >
          hello@serenescene.app
        </a>
      </section>

      {/* Demo request */}
      <section
        id="demo-request"
        className="border-t border-[#1B3A5B]/10 bg-white py-20"
        aria-labelledby="demo-request-heading"
      >
        <div className="mx-auto max-w-3xl px-8 text-center">
          <h2
            id="demo-request-heading"
            className="mb-3 text-3xl font-bold md:text-4xl"
          >
            Request a demo
          </h2>
          <p className="mb-10 text-lg text-[#1B3A5B]/70">
            Tell us about your practice and we&apos;ll follow up shortly.
          </p>
          {demoSent ? (
            <p className="rounded-lg bg-[#5BC0DE]/15 px-4 py-3 text-[#1B3A5B]">
              Thanks — your demo request was received.
            </p>
          ) : null}
          {demoError === "missing" ? (
            <p className="mb-6 rounded-lg bg-[#E85A9B]/15 px-4 py-3 text-[#1B3A5B]">
              Please fill in practice name, contact name, and email.
            </p>
          ) : null}
          {demoError === "send" ? (
            <p className="mb-6 rounded-lg bg-[#E85A9B]/15 px-4 py-3 text-[#1B3A5B]">
              Something went wrong sending your request. Please try again or email us directly.
            </p>
          ) : null}
          {!demoSent ? <DemoRequestForm /> : null}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1B3A5B]/10 py-8 text-center text-sm text-[#1B3A5B]/50">
        <p>
          <a href="/safety" className="font-semibold text-[#2B8CB8] underline">
            Safety &amp; use information
          </a>
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Envision Yourself Empowered, LLC · Serene Scene
        </p>
      </footer>
    </main>
  );
}
