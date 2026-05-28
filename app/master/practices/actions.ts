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

function formString(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function createPractice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/practices`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      name: formString(formData, "name"),
      email: formString(formData, "email"),
      password: formString(formData, "password"),
      subscriptionStatus: formString(formData, "subscriptionStatus") || "trial",
      googleReviewUrl: formString(formData, "googleReviewUrl") || null,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/practices?error=create");
  }

  revalidatePath("/master/practices");
  redirect("/master/practices?saved=1");
}

export async function updatePractice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) {
    redirect("/master/practices?error=missing-id");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/practices/${id}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({
      name: formString(formData, "name"),
      subscriptionStatus: formString(formData, "subscriptionStatus"),
      googleReviewUrl: formString(formData, "googleReviewUrl") || null,
      stripeCustomerId: formString(formData, "stripeCustomerId") || null,
      featureFlags: featureFlagsFromFormData(formData),
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/practices?error=save");
  }

  revalidatePath("/master/practices");
  redirect("/master/practices?saved=1");
}

export async function deactivatePractice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) {
    redirect("/master/practices?error=missing-id");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/practices/${id}/deactivate`, {
    method: "POST",
    headers: { "x-admin-api-key": adminKey },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/practices?error=deactivate");
  }

  revalidatePath("/master/practices");
  revalidatePath("/master/devices");
  revalidatePath("/master/feedback");
  redirect("/master/practices?deactivated=1");
}

export async function reactivatePractice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  if (!id) {
    redirect("/master/practices?error=missing-id");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/practices/${id}/reactivate`, {
    method: "POST",
    headers: { "x-admin-api-key": adminKey },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/practices?error=reactivate");
  }

  revalidatePath("/master/practices");
  redirect("/master/practices?reactivated=1");
}

export async function deletePractice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  const expectedName = formString(formData, "expectedName");
  const confirmName = formString(formData, "confirmName");
  if (!id) {
    redirect("/master/practices?error=missing-id");
  }
  if (!expectedName || expectedName !== confirmName) {
    redirect("/master/practices?error=delete-confirm");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/practices/${id}`, {
    method: "DELETE",
    headers: { "x-admin-api-key": adminKey },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (body.error?.includes("Deactivate")) {
      redirect("/master/practices?error=delete-active");
    }
    redirect("/master/practices?error=delete");
  }

  revalidatePath("/master/practices");
  revalidatePath("/master/devices");
  revalidatePath("/master/feedback");
  redirect("/master/practices?deleted=1");
}
