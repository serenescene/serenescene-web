"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { featureFlagsFromFormData } from "@/lib/feature-flags";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export async function updateGlobalFeatureFlags(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/settings/features`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({ featureFlags: featureFlagsFromFormData(formData) }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/settings?error=save");
  }

  revalidatePath("/master/settings");
  revalidatePath("/master/practices");
  redirect("/master/settings?saved=1");
}
