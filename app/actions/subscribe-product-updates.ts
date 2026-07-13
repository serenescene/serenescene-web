"use server";

export type SubscribeProductUpdatesResult = {
  ok: boolean;
};

function apiBaseUrl() {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Core subscribe call, reusable from any server action (e.g. checkout opt-in). */
export async function subscribeEmailToUpdates(
  email: string,
  source = "homepage",
): Promise<boolean> {
  const trimmed = email.trim();
  if (!trimmed) return false;

  const baseUrl = apiBaseUrl();
  if (!baseUrl) return false;

  try {
    const res = await fetch(`${baseUrl}/leads/updates`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: trimmed, source: source || "homepage" }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function subscribeProductUpdates(
  formData: FormData,
): Promise<SubscribeProductUpdatesResult> {
  const email = String(formData.get("email") ?? "").trim();
  const source = String(formData.get("source") ?? "homepage").trim() || "homepage";

  const ok = await subscribeEmailToUpdates(email, source);
  return { ok };
}
