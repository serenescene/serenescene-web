import Link from "next/link";
import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { deviceOnlineLabel, formatPracticeDateTime } from "@/lib/practice-format";
import { fetchPracticeDevices } from "@/lib/practice-api";
import { requirePracticePage } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

export default async function PracticeDevicesPage() {
  const { token } = await requirePracticePage();
  const result = await fetchPracticeDevices(token);

  return (
    <PracticeShell
      title="Devices"
      subtitle="Tablets registered to your practice. Last seen updates when the player reaches the API."
      navVariant="authenticated"
      navActive="devices"
      footer={<PracticeLogoutFooter />}
    >
      {"error" in result ? (
        <div className="rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">{result.error}</div>
      ) : result.devices.length === 0 ? (
        <div className="rounded-2xl bg-[#F8FAFB] p-5 text-sm font-bold text-[#1B3A5B]/70">
          <p>No tablets registered yet.</p>
          <p className="mt-3">
            Serene Scene will register your device during installation. Questions?{" "}
            <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
              hello@serenescene.app
            </a>
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {result.devices.map((device) => {
            const status = deviceOnlineLabel(device.lastSeenAt);
            const statusColor =
              status.tone === "ok"
                ? "text-emerald-800"
                : status.tone === "warn"
                  ? "text-amber-800"
                  : "text-[#1B3A5B]/55";
            return (
              <li
                key={device.id}
                className="rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4"
              >
                <p className="text-lg font-extrabold text-[#1B3A5B]">
                  {device.label?.trim() || "Serene Scene tablet"}
                </p>
                <p className="mt-1 font-mono text-xs font-bold text-[#1B3A5B]/55">
                  Serial: {device.serial}
                </p>
                <p className={`mt-2 text-sm font-bold ${statusColor}`}>{status.label}</p>
                <p className="mt-1 text-xs font-bold text-[#1B3A5B]/45">
                  Registered {formatPracticeDateTime(device.createdAt)}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-6 text-sm font-bold text-[#1B3A5B]/60">
        Offline more than 24 hours? See{" "}
        <Link href="/practice/help" className="text-[#2B8CB8] underline">
          Help
        </Link>{" "}
        or email support.
      </p>
    </PracticeShell>
  );
}
