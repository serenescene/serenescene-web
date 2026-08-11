import { deletePlaylistSlot, duplicatePlaylistSlot } from "@/app/master/devices/actions";

export type PracticePlaylistSlot = {
  slotId: string;
  contentItemId: string;
  enabled: boolean;
  sortOrder: number;
  title: string;
  durationSec: number;
};

type DevicePracticePlaylistProps = {
  practiceId: string;
  slots: PracticePlaylistSlot[];
};

function formatDuration(seconds: number) {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function DevicePracticePlaylist({
  practiceId,
  slots,
}: DevicePracticePlaylistProps) {
  const titleCounts = slots.reduce<Record<string, number>>((acc, slot) => {
    acc[slot.title] = (acc[slot.title] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-4 rounded-2xl border border-[#1B3A5B]/12 bg-[#F8FAFB] p-4">
      <div className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/60">
        Playlist loaded for this practice
      </div>
      <p className="mt-1 text-xs text-[#1B3A5B]/55">
        Tablets pull this list on refresh. Duplicate ads here (admin only).
      </p>

      {slots.length === 0 ? (
        <p className="mt-3 text-sm text-[#1B3A5B]/60">
          No approved videos for this practice yet.
        </p>
      ) : (
        <ol className="mt-3 space-y-2">
          {slots.map((slot, index) => {
            const copyTotal = titleCounts[slot.title] ?? 1;
            const copyIndex =
              slots.slice(0, index + 1).filter((s) => s.title === slot.title).length;

            return (
              <li
                key={slot.slotId}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[#1B3A5B]">{slot.title}</div>
                  <div className="text-xs text-[#1B3A5B]/55">
                    {formatDuration(slot.durationSec)} · Position {index + 1}
                    {copyTotal > 1 ? ` · Copy ${copyIndex} of ${copyTotal}` : ""}
                    {!slot.enabled ? " · Disabled" : ""}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form action={duplicatePlaylistSlot}>
                    <input type="hidden" name="practiceId" value={practiceId} />
                    <input type="hidden" name="slotId" value={slot.slotId} />
                    <button
                      type="submit"
                      className="rounded-full bg-[#5BC0DE]/35 px-3 py-1 text-xs font-extrabold text-[#1B3A5B] hover:bg-[#5BC0DE]/55"
                    >
                      Duplicate
                    </button>
                  </form>
                  <form action={deletePlaylistSlot}>
                    <input type="hidden" name="practiceId" value={practiceId} />
                    <input type="hidden" name="slotId" value={slot.slotId} />
                    <button
                      type="submit"
                      className="rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800 hover:bg-rose-200"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
