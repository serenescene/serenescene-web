import { NextResponse } from "next/server";

function apiBaseUrl() {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Legacy route — forwards to serenescene-api POST /leads/demo */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: "API not configured" }, { status: 503 });
  }

  const res = await fetch(`${baseUrl}/leads/demo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
