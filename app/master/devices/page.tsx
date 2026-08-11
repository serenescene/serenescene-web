import { redirect } from "next/navigation";
import { DeviceList, type MasterDevice } from "@/components/master/device-list";
import type { PracticePlaylistSlot } from "@/components/device-practice-playlist";
import { MasterNav } from "@/components/master-nav";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";
import { createDevice } from "./actions";

type Practice = {
  id: string;
  name: string;
  email: string;
};

export const dynamic = "force-dynamic";

async function loadDevices(): Promise<{ devices: MasterDevice[]; error: string | null }> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      devices: [],
      error: "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/devices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { devices: [], error: `Devices API returned ${res.status}.` };
    }
    const data = (await res.json()) as { devices: MasterDevice[] };
    return { devices: data.devices ?? [], error: null };
  } catch {
    return { devices: [], error: "Could not reach the Serene Scene API." };
  }
}

async function loadPracticePlaylists(
  practiceIds: string[],
): Promise<Record<string, PracticePlaylistSlot[]>> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;
  if (!baseUrl || !adminKey || practiceIds.length === 0) {
    return {};
  }

  const uniqueIds = [...new Set(practiceIds)];
  const entries = await Promise.all(
    uniqueIds.map(async (practiceId) => {
      try {
        const res = await fetch(
          `${baseUrl.replace(/\/$/, "")}/admin/playlist/practices/${practiceId}`,
          {
            headers: { "x-admin-api-key": adminKey },
            cache: "no-store",
          },
        );
        if (!res.ok) {
          return [practiceId, [] as PracticePlaylistSlot[]] as const;
        }
        const data = (await res.json()) as { slots: PracticePlaylistSlot[] };
        return [practiceId, data.slots ?? []] as const;
      } catch {
        return [practiceId, [] as PracticePlaylistSlot[]] as const;
      }
    }),
  );

  return Object.fromEntries(entries);
}

async function loadPractices(): Promise<Practice[]> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;
  if (!baseUrl || !adminKey) return [];

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/practices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { practices: Practice[] };
    return data.practices ?? [];
  } catch {
    return [];
  }
}

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string; deleted?: string }>;
};

export default async function MasterDevicesPage({ searchParams }: PageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const { devices, error } = await loadDevices();
  const [practices, playlistsByPractice] = await Promise.all([
    loadPractices(),
    loadPracticePlaylists(devices.map((d) => d.practiceId)),
  ]);

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <MasterNav active="devices" />
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Devices</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Register Beam Pro / tablet serials per practice and confirm they are checking in.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {devices.length} devices
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Device saved.
          </div>
        ) : null}
        {params.deleted === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Device assignment deleted. The serial can be registered again.
          </div>
        ) : null}
        {params.deleted === "bulk" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Selected device assignments deleted.
          </div>
        ) : null}
        {params.saved === "playlist" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Playlist updated. Tablets will see the change after Settings → Refresh playlist.
          </div>
        ) : null}
        {params.error === "playlist" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not update the practice playlist. Try again.
          </div>
        ) : null}
        {params.error && params.error !== "playlist" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {params.error === "delete-confirm"
              ? "Confirmation did not match. Type the serial (or DELETE for bulk) exactly."
              : params.error === "delete-none"
                ? "Select at least one device to delete."
                : params.error === "delete"
                  ? "Could not delete that device. Try again after the latest API is deployed."
                  : "Could not save device. Check the form and try again."}
          </div>
        ) : null}

        <div className="mb-8 overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <div className="border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4 font-extrabold">
            Register device
          </div>
          <form action={createDevice} className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <label className="block text-sm font-bold md:col-span-2">
              Practice
              <select
                name="practiceId"
                required
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a practice
                </option>
                {practices.map((practice) => (
                  <option key={practice.id} value={practice.id}>
                    {practice.name} ({practice.email})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold">
              Device serial
              <input
                name="serial"
                required
                placeholder="e.g. BEAM-001 or Android ID"
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-bold">
              Label (optional)
              <input
                name="label"
                placeholder="Chair 1"
                className="mt-1 w-full rounded-xl border border-[#1B3A5B]/20 px-3 py-2"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-[#2B8CB8] px-5 py-2 text-sm font-extrabold text-white"
              >
                Register device
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <DeviceList
            devices={devices}
            practices={practices}
            playlistsByPractice={playlistsByPractice}
          />
        </div>
      </section>
    </main>
  );
}
