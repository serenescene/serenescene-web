"use server";

import { redirect } from "next/navigation";
import { createBillingCheckout } from "@/lib/billing-api";
import { requirePracticeSession } from "@/lib/practice-auth";

export type CheckoutActionResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function startCheckout(formData: FormData): Promise<CheckoutActionResult> {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login?next=/practice/subscribe");
  }

  const operatories = Number.parseInt(String(formData.get("operatories") ?? "1"), 10);
  if (!Number.isInteger(operatories) || operatories < 1 || operatories > 20) {
    return { ok: false, error: "Choose a valid quantity of hardware bundles." };
  }

  const result = await createBillingCheckout(token, operatories);
  if ("error" in result) {
    return { ok: false, error: result.error };
  }
  return { ok: true, url: result.url };
}
