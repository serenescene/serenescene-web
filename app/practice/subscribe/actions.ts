"use server";

import { redirect } from "next/navigation";
import { subscribeEmailToUpdates } from "@/app/actions/subscribe-product-updates";
import { createBillingCheckout } from "@/lib/billing-api";
import { requirePracticeSession } from "@/lib/practice-auth";

export type CheckoutActionResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function startCheckout(formData: FormData): Promise<CheckoutActionResult> {
  let token: string;
  let practiceEmail: string;
  try {
    const session = await requirePracticeSession();
    token = session.token;
    practiceEmail = session.practice.email;
  } catch {
    redirect("/practice/login?next=/practice/subscribe");
  }

  const operatories = Number.parseInt(String(formData.get("operatories") ?? "1"), 10);
  if (!Number.isInteger(operatories) || operatories < 1 || operatories > 20) {
    return { ok: false, error: "Choose a valid quantity of hardware bundles." };
  }

  if (formData.get("productUpdatesOptIn") != null && practiceEmail) {
    void subscribeEmailToUpdates(practiceEmail, "checkout");
  }

  const result = await createBillingCheckout(token, operatories);
  if ("error" in result) {
    return { ok: false, error: result.error };
  }
  return { ok: true, url: result.url };
}
