"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginPractice } from "@/lib/practice-api";
import { setPracticeAuthCookie } from "@/lib/practice-auth";

export async function loginPracticeAccount(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/practice/login?error=missing");
  }

  const result = await loginPractice(email, password);
  if ("error" in result) {
    redirect("/practice/login?error=invalid");
  }

  await setPracticeAuthCookie(result.token);
  revalidatePath("/practice");

  if (result.practice.needsOnboarding) {
    redirect("/practice/onboarding");
  }
  redirect("/practice/dashboard");
}
