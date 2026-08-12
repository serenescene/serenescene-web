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

export async function uploadSplashImage(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const file = formData.get("splash");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/master/settings?error=splash-file");
  }
  if (file.size > 2 * 1024 * 1024) {
    redirect("/master/settings?error=splash-size");
  }
  const mime = file.type.trim().toLowerCase();
  if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) {
    redirect("/master/settings?error=splash-type");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");
  const buffer = Buffer.from(await file.arrayBuffer());

  const res = await fetch(`${baseUrl}/admin/settings/splash`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      mime,
      data: buffer.toString("base64"),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/settings?error=splash");
  }

  revalidatePath("/master/settings");
  redirect("/master/settings?saved=splash");
}

export async function clearSplashImage() {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/settings/splash`, {
    method: "DELETE",
    headers: { "x-admin-api-key": adminKey },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/settings?error=splash");
  }

  revalidatePath("/master/settings");
  redirect("/master/settings?saved=splash-cleared");
}
