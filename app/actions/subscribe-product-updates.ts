"use server";

export type SubscribeProductUpdatesResult = {
  ok: boolean;
};

function apiBaseUrl() {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

export async function subscribeProductUpdates(
  formData: FormData,
): Promise<SubscribeProductUpdatesResult> {
  const email = String(formData.get("email") ?? "").trim();
  const source = String(formData.get("source") ?? "homepage").trim() || "homepage";

  if (!email) {
    return { ok: false };
  }

  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    return { ok: false };
  }

  try {
    const res = await fetch(`${baseUrl}/leads/updates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, source }),
      cache: "no-store",
    });

    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
