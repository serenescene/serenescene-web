import { safetyDisclaimer, safetySections } from "@/lib/safety-content";

export function SafetyDocument() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-[#5BC0DE]">
          Patient safety
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-[#1B3A5B]">
          Serene Scene — Safety &amp; use information
        </h1>
        <p className="mt-4 text-lg font-medium text-[#1B3A5B]/75">
          For dental staff screening patients before AR glasses and calming video during a visit.
        </p>
      </header>

      {safetySections.map((section) => (
        <section
          key={section.title}
          className="rounded-2xl border border-[#1B3A5B]/10 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-extrabold text-[#1B3A5B]">{section.title}</h2>
          {"body" in section && section.body ? (
            <p className="mt-3 font-medium text-[#1B3A5B]/80">{section.body}</p>
          ) : null}
          {"bullets" in section && section.bullets ? (
            <ul className="mt-3 list-inside list-disc space-y-2 font-medium text-[#1B3A5B]/80">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {"note" in section && section.note ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950">
              {section.note}
            </p>
          ) : null}
        </section>
      ))}

      <p className="text-sm font-medium text-[#1B3A5B]/55">{safetyDisclaimer}</p>
    </article>
  );
}
