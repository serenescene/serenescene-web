"use server";

import { redirect } from "next/navigation";
import { createPracticeBillingPortalSession } from "@/lib/practice-api";
import { clearPracticeAuthCookie, requirePracticeSession } from "@/lib/practice-auth";

export async function logoutPractice() {
  await clearPracticeAuthCookie();
  redirect("/practice/login");
}

export async function openBillingPortal() {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login");
  }

  const result = await createPracticeBillingPortalSession(token);
  if ("error" in result) {
    redirect(`/practice/billing?error=${encodeURIComponent(result.error ?? "Billing unavailable")}`);
  }
  redirect(result.url);
}
