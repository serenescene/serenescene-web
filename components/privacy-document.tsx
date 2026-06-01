import { privacySections, PRIVACY_POLICY_REVISION } from "@/lib/privacy-content";

export function PrivacyDocument() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-4xl font-extrabold text-[#1B3A5B]">Privacy policy</h1>
      <p className="mt-3 text-sm font-bold text-[#1B3A5B]/55">
        Effective {PRIVACY_POLICY_REVISION} · Serene Scene Player &amp; practice portal
      </p>

      <div className="mt-10 space-y-8">
        {privacySections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-extrabold text-[#1B3A5B]">{section.title}</h2>
            {"body" in section && section.body ? (
              <p className="mt-3 leading-relaxed font-bold text-[#1B3A5B]/80">{section.body}</p>
            ) : null}
            {"bullets" in section && section.bullets ? (
              <ul className="mt-3 list-inside list-disc space-y-2 font-bold text-[#1B3A5B]/75">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
