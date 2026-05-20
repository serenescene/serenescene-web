"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { patchPracticeMe } from "@/lib/practice-api";
import { clearPracticeAuthCookie, requirePracticeSession } from "@/lib/practice-auth";

export async function updatePracticeProfile(formData: FormData) {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login");
  }

  const experienceTitle = String(formData.get("experienceTitle") ?? "").trim();
  const googleReviewUrl = String(formData.get("googleReviewUrl") ?? "").trim();

  const result = await patchPracticeMe(token, {
    experienceTitle: experienceTitle || null,
    googleReviewUrl: googleReviewUrl || null,
  });

  if ("error" in result) {
    redirect("/practice/dashboard?error=save");
  }

  revalidatePath("/practice/dashboard");
  redirect("/practice/dashboard?saved=1");
}

export async function logoutPractice() {
  await clearPracticeAuthCookie();
  redirect("/practice/login");
}
