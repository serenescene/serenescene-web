import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "serene_scene_master_auth";
const TOKEN_PURPOSE = "serene-scene-master-dashboard";

function configuredPassword() {
  return process.env.ADMIN_DASHBOARD_PASSWORD?.trim() ?? "";
}

function authToken(password: string) {
  return createHmac("sha256", password).update(TOKEN_PURPOSE).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

export function hasMasterDashboardPassword() {
  return configuredPassword().length > 0;
}

export function verifyMasterDashboardPassword(input: string) {
  const password = configuredPassword();
  if (!password || !input) return false;
  return safeEqual(input, password);
}

export async function isMasterDashboardAuthenticated() {
  const password = configuredPassword();
  if (!password) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return safeEqual(token, authToken(password));
}

export async function setMasterDashboardAuthCookie() {
  const password = configuredPassword();
  if (!password) {
    throw new Error("ADMIN_DASHBOARD_PASSWORD is not configured");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, authToken(password), {
    httpOnly: true,
    maxAge: 60 * 60 * 12,
    path: "/master",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
