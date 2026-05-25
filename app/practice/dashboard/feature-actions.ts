"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { featureFlagsFromFormData } from "@/lib/feature-flags";
import { patchPracticeMe } from "@/lib/practice-api";
import { requirePracticeSession } from "@/lib/practice-auth";

export async function updatePracticeFeatureFlags(formData: FormData) {
  let token: string;
  let practice;
  try {
    ({ token, practice } = await requirePracticeSession());
  } catch {
    redirect("/practice/login");
  }

  if (!practice.isLegacyTier && practice.subscriptionStatus !== "legacy") {
    redirect("/practice/dashboard?error=features");
  }

  const result = await patchPracticeMe(token, {
    featureFlags: featureFlagsFromFormData(formData),
  });

  if ("error" in result) {
    redirect("/practice/dashboard?error=features-save");
  }

  revalidatePath("/practice/dashboard");
  redirect("/practice/dashboard?features=saved");
}
