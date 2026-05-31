"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { patchPracticeMe } from "@/lib/practice-api";
import { requirePracticeSession } from "@/lib/practice-auth";

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
    const err = result.error.toLowerCase();
    redirect(
      err.includes("google") ? "/practice/dashboard?error=review" : "/practice/dashboard?error=save",
    );
  }

  revalidatePath("/practice/dashboard");
  redirect("/practice/dashboard?saved=1");
}
