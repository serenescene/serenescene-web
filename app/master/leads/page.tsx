import { redirect } from "next/navigation";
import { LeadList } from "@/components/master/lead-list";
import { MasterNav } from "@/components/master-nav";
import type { DemoLead } from "@/lib/demo-leads";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

export const dynamic = "force-dynamic";

async function loadLeads(): Promise<{ leads: DemoLead[]; error: string | null }> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      leads: [],
      error: "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/leads`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { leads: [], error: `Leads API returned ${res.status}. Run the latest API migration.` };
    }
    const data = (await res.json()) as { leads: DemoLead[] };
    return { leads: data.leads ?? [], error: null };
  } catch {
    return { leads: [], error: "Could not reach the Serene Scene API." };
  }
}

type PageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function MasterLeadsPage({ searchParams }: PageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const { leads, error } = await loadLeads();
  const newCount = leads.filter((lead) => lead.status === "new").length;

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6">
          <MasterNav active="leads" />
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Leads</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Demo requests from the marketing site. You get an email alert; leads get an auto-reply.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
            {newCount > 0 ? ` · ${newCount} new` : ""}
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Lead updated.
          </div>
        ) : null}
        {params.error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not save that lead.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <LeadList leads={leads} />
        </div>
      </section>
    </main>
  );
}
