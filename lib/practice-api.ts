import type { FeatureFlags } from "@/lib/feature-flags";

export type PracticeSession = {
  id: string;
  name: string;
  email: string;
  googleReviewUrl: string | null;
  experienceTitle: string | null;
  onboardingCompletedAt: string | null;
  needsOnboarding: boolean;
  hasGoogleReviewUrl?: boolean;
  isGoLiveReady?: boolean;
  subscriptionStatus: string;
  featureFlags?: FeatureFlags;
  canEditFeatureFlags?: boolean;
  isLegacyTier?: boolean;
};

function apiBaseUrl() {
  const base = process.env.SERENE_SCENE_API_BASE_URL?.trim();
  if (!base) {
    throw new Error("SERENE_SCENE_API_BASE_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

export async function fetchPracticeMe(token: string): Promise<PracticeSession | null> {
  try {
    const res = await fetch(`${apiBaseUrl()}/practices/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { practice: PracticeSession };
    return data.practice;
  } catch {
    return null;
  }
}

export async function patchPracticeMe(
  token: string,
  body: Record<string, unknown>
): Promise<{ practice: PracticeSession } | { error: string }> {
  const res = await fetch(`${apiBaseUrl()}/practices/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? `Request failed (${res.status})` };
  }
  return data as { practice: PracticeSession };
}

export async function loginPractice(email: string, password: string) {
  const res = await fetch(`${apiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Login failed" } as const;
  }
  return data as { token: string; practice: PracticeSession };
}

export async function registerPractice(input: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${apiBaseUrl()}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Registration failed" } as const;
  }
  return data as { token: string; practice: PracticeSession };
}
