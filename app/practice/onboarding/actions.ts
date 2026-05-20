"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { patchPracticeMe } from "@/lib/practice-api";
import { getPracticeToken, requirePracticeSession } from "@/lib/practice-auth";

export async function completePracticeOnboarding(formData: FormData) {
  let token: string;
  try {
    ({ token } = await requirePracticeSession());
  } catch {
    redirect("/practice/login");
  }

  const experienceTitle = String(formData.get("experienceTitle") ?? "").trim();
  const googleReviewUrl = String(formData.get("googleReviewUrl") ?? "").trim();
  const skipReviewUrl = formData.get("skipReviewUrl") === "on";

  if (!experienceTitle) {
    redirect("/practice/onboarding?error=title");
  }

  const body: Record<string, unknown> = {
    experienceTitle,
    completeOnboarding: true,
  };
  if (!skipReviewUrl && googleReviewUrl) {
    body.googleReviewUrl = googleReviewUrl;
  }

  const result = await patchPracticeMe(token, body);
  if ("error" in result) {
    redirect("/practice/onboarding?error=save");
  }

  revalidatePath("/practice");
  redirect("/practice/dashboard?welcome=1");
}
