"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginPractice } from "@/lib/practice-api";
import { setPracticeAuthCookie } from "@/lib/practice-auth";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function loginPracticeAccount(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(String(formData.get("next") ?? ""), "/practice/dashboard");

  if (!email || !password) {
    redirect(`/practice/login?error=missing${next !== "/practice/dashboard" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const result = await loginPractice(email, password);
  if ("error" in result) {
    redirect(`/practice/login?error=invalid${next !== "/practice/dashboard" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await setPracticeAuthCookie(result.token);
  revalidatePath("/practice");

  if (result.practice.needsOnboarding) {
    redirect("/practice/onboarding");
  }
  redirect(next);
}
