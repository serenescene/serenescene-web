"use server";

import { redirect } from "next/navigation";
import { resetPracticePasswordWithToken } from "@/lib/practice-api";

export async function submitPasswordReset(formData: FormData) {
  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    redirect("/practice/forgot-password");
  }
  if (newPassword.length < 8) {
    redirect(`/practice/reset-password?token=${encodeURIComponent(token)}&error=invalid`);
  }
  if (newPassword !== confirmPassword) {
    redirect(`/practice/reset-password?token=${encodeURIComponent(token)}&error=mismatch`);
  }

  const result = await resetPracticePasswordWithToken(token, newPassword);
  if ("error" in result) {
    redirect(
      `/practice/reset-password?token=${encodeURIComponent(token)}&error=${encodeURIComponent(result.error)}`,
    );
  }

  redirect("/practice/login?reset=1");
}
