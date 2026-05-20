"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { registerPractice } from "@/lib/practice-api";
import { setPracticeAuthCookie } from "@/lib/practice-auth";

export async function signupPracticeAccount(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    redirect("/practice/signup?error=invalid");
  }

  const result = await registerPractice({ name, email, password });
  if ("error" in result) {
    if (result.error.toLowerCase().includes("already")) {
      redirect("/practice/signup?error=exists");
    }
    redirect("/practice/signup?error=failed");
  }

  await setPracticeAuthCookie(result.token);
  revalidatePath("/practice");
  redirect("/practice/onboarding");
}
