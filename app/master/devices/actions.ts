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
      practiceId: formString(formData, "practiceId") || undefined,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/devices?error=save");
  }

  revalidatePath("/master/devices");
  redirect("/master/devices?saved=1");
}

export async function duplicatePlaylistSlot(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const practiceId = formString(formData, "practiceId");
  const slotId = formString(formData, "slotId");
  if (!practiceId || !slotId) {
    redirect("/master/devices?error=playlist");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(
    `${baseUrl}/admin/playlist/practices/${practiceId}/slots/${slotId}/duplicate`,
    {
      method: "POST",
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    redirect("/master/devices?error=playlist");
  }

  revalidatePath("/master/devices");
  redirect("/master/devices?saved=playlist");
}

export async function deletePlaylistSlot(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const practiceId = formString(formData, "practiceId");
  const slotId = formString(formData, "slotId");
  if (!practiceId || !slotId) {
    redirect("/master/devices?error=playlist");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(
    `${baseUrl}/admin/playlist/practices/${practiceId}/slots/${slotId}`,
    {
      method: "DELETE",
      headers: { "x-admin-api-key": adminKey },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    redirect("/master/devices?error=playlist");
  }

  revalidatePath("/master/devices");
  redirect("/master/devices?saved=playlist");
}

export async function deleteDevice(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const id = formString(formData, "id");
  const confirmSerial = formString(formData, "confirmSerial");
  if (!id) {
    redirect("/master/devices?error=missing-id");
  }
  if (!confirmSerial) {
    redirect("/master/devices?error=delete-confirm");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/devices/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({ confirmSerial }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (body.error?.toLowerCase().includes("serial did not match")) {
      redirect("/master/devices?error=delete-confirm");
    }
    redirect("/master/devices?error=delete");
  }

  const next =
    formString(formData, "redirectTo") === "practices"
      ? "/master/practices?deleted=device"
      : "/master/devices?deleted=1";

  revalidatePath("/master/devices");
  revalidatePath("/master/practices");
  redirect(next);
}

export async function deleteDevices(formData: FormData) {
  if (!(await isMasterDashboardAuthenticated())) {
    redirect("/master/login");
  }

  const ids = formData
    .getAll("ids")
    .map((value) => String(value).trim())
    .filter((id) => id.length > 0);
  const confirm = formString(formData, "confirm");

  if (ids.length === 0) {
    redirect("/master/devices?error=delete-none");
  }
  if (confirm.toUpperCase() !== "DELETE") {
    redirect("/master/devices?error=delete-confirm");
  }

  const baseUrl = requiredEnv("SERENE_SCENE_API_BASE_URL").replace(/\/$/, "");
  const adminKey = requiredEnv("SERENE_SCENE_ADMIN_API_KEY");

  const res = await fetch(`${baseUrl}/admin/devices/purge`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: JSON.stringify({ ids, confirm: "DELETE" }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/master/devices?error=delete");
  }

  revalidatePath("/master/devices");
  revalidatePath("/master/practices");
  redirect("/master/devices?deleted=bulk");
}
