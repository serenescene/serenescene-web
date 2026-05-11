"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function submitDemoRequest(formData: FormData) {
  const practiceName = String(formData.get("practiceName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const operatories = String(formData.get("operatories") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!practiceName || !contactName || !email) {
    redirect("/?demoError=missing");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;

  const res = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      practiceName,
      contactName,
      email,
      operatories,
      message,
    }),
  });

  if (!res.ok) {
    redirect("/?demoError=send");
  }

  redirect("/?demoSent=1");
}
