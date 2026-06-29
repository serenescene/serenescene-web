export async function fetchBillingCheckoutEnabled(): Promise<boolean> {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) return false;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/billing/config`, {
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { checkoutEnabled?: boolean };
    return data.checkoutEnabled === true;
  } catch {
    return false;
  }
}

export async function createBillingCheckout(
  token: string,
  operatories: number,
): Promise<{ url: string } | { error: string }> {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) {
    return { error: "Billing API is not configured." };
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/billing/checkout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ operatories }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? `Checkout failed (${res.status})` };
  }
  const url = (data as { url?: string }).url;
  if (!url) return { error: "Checkout URL missing" };
  return { url };
}
