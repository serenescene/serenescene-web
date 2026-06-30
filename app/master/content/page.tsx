import { redirect } from "next/navigation";
import { ContentList, type MasterContentItem, type PracticeOption } from "@/components/master/content-list";
import { MasterNav } from "@/components/master-nav";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

export const dynamic = "force-dynamic";

type AdminContentResponse = {
  items: MasterContentItem[];
};

async function loadPractices(): Promise<{
  practices: PracticeOption[];
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return { practices: [], error: null };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/practices`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      return { practices: [], error: null };
    }
    const data = (await res.json()) as { practices: PracticeOption[] };
    return { practices: data.practices ?? [], error: null };
  } catch {
    return { practices: [], error: null };
  }
}

async function loadContent(): Promise<{
  items: MasterContentItem[];
  error: string | null;
}> {
  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL;
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return {
      items: [],
      error:
        "Set SERENE_SCENE_API_BASE_URL and SERENE_SCENE_ADMIN_API_KEY to load master content.",
    };
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/admin/content`, {
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        items: [],
        error: `Content API returned ${res.status}. Check the API URL and admin key.`,
      };
    }

    const data = (await res.json()) as AdminContentResponse;
    const items = (data.items ?? []).map((item) => ({
      ...item,
      assignedPracticeIds: item.assignedPracticeIds ?? [],
      assignedPractices: item.assignedPractices ?? [],
    }));
    return { items, error: null };
  } catch {
    return {
      items: [],
      error: "Could not reach the Serene Scene API.",
    };
  }
}

type MasterContentPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function MasterContentPage({
  searchParams,
}: MasterContentPageProps) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const params = await searchParams;
  const [{ items, error }, { practices }] = await Promise.all([
    loadContent(),
    loadPractices(),
  ]);

  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-8 text-[#F8FAFB]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <MasterNav active="content" />
        </div>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
              Master Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-extrabold">Content Licensing</h1>
            <p className="mt-3 max-w-2xl text-[#F8FAFB]/70">
              Internal view for content rights, commercial approval, attribution, and catalog readiness.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 text-sm font-bold">
            {items.length} content items
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            {error}
          </div>
        ) : null}
        {params.saved === "1" ? (
          <div className="mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 p-4 text-sm font-bold">
            Content item saved.
          </div>
        ) : null}
        {params.error === "assign-practices" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Client-specific content must be assigned to at least one practice.
          </div>
        ) : null}
        {params.error && params.error !== "assign-practices" ? (
          <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 p-4 text-sm font-bold">
            Could not save that content item. Please check the fields and try again.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
          <ContentList items={items} practices={practices} />
        </div>
      </section>
    </main>
  );
}
