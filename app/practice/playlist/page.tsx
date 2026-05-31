import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { formatDurationSec } from "@/lib/practice-format";
import { fetchPracticePlaylist } from "@/lib/practice-api";
import { requirePracticePage } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

export default async function PracticePlaylistPage() {
  const { token } = await requirePracticePage();
  const result = await fetchPracticePlaylist(token);

  const enabledSlots = "error" in result ? [] : result.slots.filter((s) => s.enabled);
  const disabledCount = "error" in result ? 0 : result.slots.length - enabledSlots.length;

  return (
    <PracticeShell
      title="Your playlist"
      subtitle="Videos assigned to your practice, in the order patients experience on the tablet."
      navVariant="authenticated"
      navActive="playlist"
      footer={<PracticeLogoutFooter />}
    >
      {"error" in result ? (
        <div className="rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">{result.error}</div>
      ) : enabledSlots.length === 0 ? (
        <div className="rounded-2xl bg-[#F8FAFB] p-5 text-sm font-bold text-[#1B3A5B]/70">
          No active videos in your playlist yet. Serene Scene updates content remotely — ask your
          team when your library is ready.
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm font-bold text-[#1B3A5B]/60">
            {enabledSlots.length} active slot{enabledSlots.length === 1 ? "" : "s"}
            {disabledCount > 0 ? ` · ${disabledCount} hidden on tablet` : ""}
          </p>
          <ol className="space-y-2">
            {enabledSlots.map((slot, index) => (
              <li
                key={slot.slotId}
                className="flex items-start gap-3 rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] px-4 py-3"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5BC0DE]/30 text-sm font-extrabold text-[#1B3A5B]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-[#1B3A5B]">{slot.title}</p>
                  <p className="mt-0.5 text-xs font-bold text-[#1B3A5B]/55">
                    {formatDurationSec(slot.durationSec)} · {slot.type}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-6 text-xs font-bold text-[#1B3A5B]/50">
        Playlist changes are managed by Serene Scene. On the tablet: Settings → Refresh playlist.
      </p>
    </PracticeShell>
  );
}
