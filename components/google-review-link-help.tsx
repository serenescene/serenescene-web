export function GoogleReviewLinkHelp() {
  return (
    <details className="mt-3 rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] px-4 py-3 text-sm">
      <summary className="cursor-pointer font-extrabold text-[#2B8CB8]">
        How to find your Google review link
      </summary>
      <ol className="mt-3 list-inside list-decimal space-y-2 font-bold text-[#1B3A5B]/75">
        <li>Open Google Business Profile for your dental office (business.google.com).</li>
        <li>Select your location.</li>
        <li>Tap <span className="text-[#1B3A5B]">Ask for reviews</span> or{" "}
          <span className="text-[#1B3A5B]">Share review form</span>.
        </li>
        <li>Copy the link — it often starts with https://g.page/r/…/review</li>
        <li>Paste it below. This is your existing Google listing; Serene Scene does not create a new one.</li>
      </ol>
    </details>
  );
}
