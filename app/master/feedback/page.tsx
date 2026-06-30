import { redirect } from "next/navigation";
import { FeedbackList, type PracticeFeedbackGroup } from "@/components/master/feedback-list";
import { MasterNav } from "@/components/master-nav";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

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
          <FeedbackList practices={practices} />
        )}
      </section>
    </main>
  );
}
