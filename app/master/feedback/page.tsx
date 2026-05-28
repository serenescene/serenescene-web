import { redirect } from "next/navigation";
import { MasterNav } from "@/components/master-nav";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

type FeedbackEntry = {
  id: string;
  starRating: number;
  comment: string | null;
  deviceLabel: string | null;
  createdAt: string;
};

type PracticeFeedbackGroup = {
  id: string;
  name: string;
  email: string;
  feedback: FeedbackEntry[];
};

export const dynamic = "force-dynamic";

async function loadFeedback(): Promise<{
  practices: PracticeFeedbackGroup[];
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      practices: [],
      error:
        "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY to load feedback.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/feedback`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        practices: [],
        error: `Feedback API returned ${res.status}. Check the API URL and admin key.`,
      };
    }
    const data = (await res.json()) as { practices: PracticeFeedbackGroup[] };
    return { practices: data.practices ?? [], error: null };
  } catch {
    return { practices: [], error: "Could not reach the Serene Scene API." };
  }
}

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function starsLabel(rating: number) {
  return `${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)`;
}

export default async function MasterFeedbackPage() {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const { practices, error } = await loadFeedback();
  const totalFeedback = practices.reduce((sum, p) => sum + p.feedback.length, 0);

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6">
          <MasterNav active="feedback" />
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Patient feedback</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Ratings and comments submitted from tablets, grouped by practice.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {totalFeedback} submission{totalFeedback === 1 ? "" : "s"}
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}

        {practices.length === 0 && !error ? (
          <div className="rounded-3xl bg-white/10 px-6 py-12 text-center text-[#F8FAFB]/70">
            No feedback yet. Patients can use Share feedback on a paired tablet.
          </div>
        ) : (
          <div className="space-y-8">
            {practices.map((practice) => (
              <section
                key={practice.id}
                className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl"
              >
                <div className="border-b border-[#1B3A5B]/10 bg-[#F8FAFB] px-5 py-4">
                  <h2 className="text-xl font-extrabold">{practice.name}</h2>
                  <p className="mt-1 text-sm text-[#1B3A5B]/60">{practice.email}</p>
                  <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
                    {practice.feedback.length} submission
                    {practice.feedback.length === 1 ? "" : "s"}
                  </p>
                </div>

                <ul className="divide-y divide-[#1B3A5B]/10">
                  {practice.feedback.map((entry) => (
                    <li key={entry.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="text-lg font-extrabold text-[#E85A9B]">
                          {starsLabel(entry.starRating)}
                        </div>
                        <div className="text-xs font-bold text-[#1B3A5B]/55">
                          {formatWhen(entry.createdAt)}
                          {entry.deviceLabel ? ` · ${entry.deviceLabel}` : ""}
                        </div>
                      </div>
                      {entry.comment ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1B3A5B]/85">
                          {entry.comment}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs font-bold text-[#1B3A5B]/45">
                          No comment
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
