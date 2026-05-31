import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchPracticeMe, type PracticeSession } from "@/lib/practice-api";

const COOKIE_NAME = "serene_scene_practice_token";

export async function getPracticeToken() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setPracticeAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/practice",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearPracticeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getPracticeSession(): Promise<PracticeSession | null> {
  const token = await getPracticeToken();
  if (!token) return null;
  return fetchPracticeMe(token);
}

export async function requirePracticeSession(): Promise<{
  token: string;
  practice: PracticeSession;
}> {
  const token = await getPracticeToken();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  const practice = await fetchPracticeMe(token);
  if (!practice) {
    throw new Error("UNAUTHORIZED");
  }
  return { token, practice };
}

/** Redirects to login/onboarding when needed; use on authenticated practice pages. */
export async function requirePracticePage(): Promise<{
  token: string;
  practice: PracticeSession;
}> {
  const token = await getPracticeToken();
  if (!token) {
    redirect("/practice/login");
  }
  const practice = await fetchPracticeMe(token);
  if (!practice) {
    redirect("/practice/login");
  }
  if (practice.needsOnboarding) {
    redirect("/practice/onboarding");
  }
  return { token, practice };
}
