import { NextResponse } from "next/server";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isMasterDashboardAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.SERENE_SCENE_API_BASE_URL?.replace(/\/$/, "");
  const adminKey = process.env.SERENE_SCENE_ADMIN_API_KEY;

  if (!baseUrl || !adminKey) {
    return NextResponse.json({ error: "API not configured" }, { status: 500 });
  }

  const res = await fetch(`${baseUrl}/admin/subscribers/export.csv`, {
    headers: { "x-admin-api-key": adminKey },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Export failed" }, { status: res.status });
  }

  const csv = await res.text();
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="serenescene-product-updates-${stamp}.csv"`,
    },
  });
}
