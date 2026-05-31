import Link from "next/link";

export function PracticeHelpContent() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <h2 className="text-lg font-extrabold text-[#1B3A5B]">Before each patient</h2>
        <ul className="mt-2 list-inside list-disc space-y-2 font-bold text-[#1B3A5B]/75">
          <li>Complete the safety screen when the app starts (staff confirmation).</li>
          <li>Connect XR glasses via USB-C; wait for &quot;Glasses connected&quot; in the app header.</li>
          <li>Video should autoplay on the glasses within a few seconds.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-extrabold text-[#1B3A5B]">Tablet controls</h2>
        <ul className="mt-2 list-inside list-disc space-y-2 font-bold text-[#1B3A5B]/75">
          <li>Play / pause, volume, and next / previous are on the tablet screen.</li>
          <li>Playlist order is managed by Serene Scene; use Settings → Refresh playlist after updates.</li>
          <li>
            Wi-Fi: Settings (gear) → <strong>Connect to Wi-Fi</strong> if swipe-down is blocked in kiosk
            mode.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-extrabold text-[#1B3A5B]">Google reviews (optional)</h2>
        <p className="mt-2 font-bold leading-relaxed text-[#1B3A5B]/75">
          Patients are never required to rate or review. When configured, &quot;Share feedback&quot; on the
          tablet can open your Google review page after they rate their experience.
        </p>
        <p className="mt-2">
          <Link href="/practice/dashboard" className="font-extrabold text-[#2B8CB8] underline">
            Update your Google review link
          </Link>{" "}
          in Practice hub.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-extrabold text-[#1B3A5B]">If something stops working</h2>
        <ul className="mt-2 list-inside list-disc space-y-2 font-bold text-[#1B3A5B]/75">
          <li>
            Check{" "}
            <Link href="/practice/devices" className="text-[#2B8CB8] underline">
              Devices
            </Link>{" "}
            — last seen should be within the last day on office Wi-Fi.
          </li>
          <li>Confirm office Wi-Fi and that the tablet can reach the internet.</li>
          <li>
            Settings → Restart app, or contact{" "}
            <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
              hello@serenescene.app
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4">
        <p className="font-extrabold text-[#1B3A5B]">Full safety information</p>
        <p className="mt-2 font-bold text-[#1B3A5B]/70">
          <Link href="/safety" className="text-[#2B8CB8] underline">
            serenescene.app/safety
          </Link>
        </p>
      </section>
    </div>
  );
}
