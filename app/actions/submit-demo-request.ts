"use server";

import { redirect } from "next/navigation";

function apiBaseUrl() {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

export async function submitDemoRequest(formData: FormData) {
  const practiceName = String(formData.get("practiceName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const operatories = String(formData.get("operatories") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!practiceName || !contactName || !email) {
    redirect("/?demoError=missing");
  }

  const baseUrl = apiBaseUrl();
  if (!baseUrl) {
    redirect("/?demoError=send");
  }

  const res = await fetch(`${baseUrl}/leads/demo`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      practiceName,
      contactName,
      email,
      operatories: operatories || null,
      message: message || null,
      source: "homepage_demo",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/?demoError=send");
  }

  redirect("/?demoSent=1");
}
