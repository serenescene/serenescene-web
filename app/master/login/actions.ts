"use server";

import { redirect } from "next/navigation";
import {
  hasMasterDashboardPassword,
  setMasterDashboardAuthCookie,
  verifyMasterDashboardPassword,
} from "@/lib/master-auth";

export async function loginMasterDashboard(formData: FormData) {
  if (!hasMasterDashboardPassword()) {
    redirect("/master/login?error=config");
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyMasterDashboardPassword(password)) {
    redirect("/master/login?error=invalid");
  }

  await setMasterDashboardAuthCookie();
  redirect("/master/content");
}
