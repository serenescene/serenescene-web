"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function formString(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function updateContentItem(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) {
    redirect("/master/content?error=missing-id");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/content/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      active: formData.get("active") === "true",
      visibility: formString(formData, "visibility"),
      licenseStatus: formString(formData, "licenseStatus"),
      commercialUseAllowed: formData.get("commercialUseAllowed") === "true",
      attributionRequired: formData.get("attributionRequired") === "true",
      sourceName: formString(formData, "sourceName"),
      sourceUrl: formString(formData, "sourceUrl"),
      creator: formString(formData, "creator"),
      vendor: formString(formData, "vendor"),
      proofUrl: formString(formData, "proofUrl"),
      attributionText: formString(formData, "attributionText"),
      licenseNotes: formString(formData, "licenseNotes"),
      licenseExpiresAt: formString(formData, "licenseExpiresAt"),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/content?error=save");
  }

  revalidatePath("/master/content");
  redirect("/master/content?saved=1");
}
