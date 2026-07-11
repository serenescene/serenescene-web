"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function formString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function updateDemoLead(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) redirect("/master/leads?error=missing-id");

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/leads/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      status: formString(formData, "status"),
      internalNotes: formString(formData, "internalNotes") || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/leads?error=save");
  }

  revalidatePath("/master/leads");
  redirect("/master/leads?saved=1");
}
