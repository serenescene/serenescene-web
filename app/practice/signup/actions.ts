"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registerPractice } from "@/lib/practice-api";
import { setPracticeAuthCookie } from "@/lib/practice-auth";
import { safeRedirectPath } from "@/lib/safe-redirect";

export async function signupPracticeAccount(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(String(formData.get("next") ?? ""), "/practice/onboarding");

  if (!name || !email || password.length < 8) {
    redirect(`/practice/signup?error=invalid${next !== "/practice/onboarding" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  const result = await registerPractice({ name, email, password });
  if ("error" in result) {
    if (result.error.toLowerCase().includes("already")) {
      redirect(`/practice/signup?error=exists${next !== "/practice/onboarding" ? `&next=${encodeURIComponent(next)}` : ""}`);
    }
    redirect(`/practice/signup?error=failed${next !== "/practice/onboarding" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await setPracticeAuthCookie(result.token);
  revalidatePath("/practice");
  redirect(next === "/subscribe" ? "/practice/onboarding" : next);
}
