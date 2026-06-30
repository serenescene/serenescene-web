"use server";

import { redirect } from "next/navigation";
import { requestPracticePasswordReset } from "@/lib/practice-api";

export async function submitForgotPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) {
    redirect("/practice/forgot-password?error=missing");
  }

  const result = await requestPracticePasswordReset(email);
  if ("error" in result) {
    redirect(`/practice/forgot-password?error=${encodeURIComponent(result.error)}`);
  }

  redirect("/practice/forgot-password?sent=1");
}
