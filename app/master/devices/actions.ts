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
  return String(formData.get(name) ?? "").trim();
}

export async function createDevice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/devices`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      practiceId: formString(formData, "practiceId"),
      serial: formString(formData, "serial"),
      label: formString(formData, "label") || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/devices?error=create");
  }

  revalidatePath("/master/devices");
  redirect("/master/devices?saved=1");
}

export async function updateDevice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) {
    redirect("/master/devices?error=missing-id");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/devices/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      label: formString(formData, "label") || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/devices?error=save");
  }

  revalidatePath("/master/devices");
  redirect("/master/devices?saved=1");
}
