"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changePracticePassword } from "@/lib/practice-api";
import { requirePracticeSession } from "@/lib/practice-auth";

export async function updatePracticePassword(formData: FormData) {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login?next=/practice/account");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || newPassword.length < 8) {
    redirect("/practice/account?error=invalid");
  }
  if (newPassword !== confirmPassword) {
    redirect("/practice/account?error=mismatch");
  }

  const result = await changePracticePassword(token, currentPassword, newPassword);
  if ("error" in result) {
    const message = result.error.toLowerCase().includes("current password")
      ? "wrong-current"
      : result.error.toLowerCase().includes("different")
        ? "same-password"
        : "failed";
    redirect(`/practice/account?error=${message}`);
  }

  revalidatePath("/practice/account");
  redirect("/practice/account?saved=1");
}
