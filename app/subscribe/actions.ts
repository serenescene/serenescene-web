"use server";

import { redirect } from "next/navigation";
import { createBillingCheckout } from "@/lib/billing-api";
import { requirePracticeSession } from "@/lib/practice-auth";

export async function startCheckout(formData: FormData) {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login?next=/subscribe");
  }

  const operatories = Number.parseInt(String(formData.get("operatories") ?? "1"), 10);
  if (!Number.isInteger(operatories) || operatories < 1 || operatories > 20) {
    redirect("/subscribe?error=operatories");
  }

  const result = await createBillingCheckout(token, operatories);
  if ("error" in result) {
    redirect(`/subscribe?error=${encodeURIComponent(result.error)}`);
  }
  redirect(result.url);
}
