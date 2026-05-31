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
  hasBillingPortal?: boolean;
};

export type PracticeDevice = {
  id: string;
  serial: string;
  label: string | null;
  lastSeenAt: string | null;
  createdAt: string;
};

export type PracticeFeedbackEntry = {
  id: string;
  starRating: number;
  comment: string | null;
  deviceLabel: string | null;
  createdAt: string;
};

export type PracticePlaylistSlot = {
  slotId: string;
  contentItemId: string;
  enabled: boolean;
  sortOrder: number;
  title: string;
  type: string;
  durationSec: number;
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

async function practiceAuthFetch(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export async function fetchPracticeDevices(token: string) {
  const { res, data } = await practiceAuthFetch(token, "/devices");
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Failed to load devices" } as const;
  }
  return { devices: (data as { devices: PracticeDevice[] }).devices ?? [] } as const;
}

export async function fetchPracticeFeedback(token: string) {
  const { res, data } = await practiceAuthFetch(token, "/feedback");
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Failed to load feedback" } as const;
  }
  const payload = data as {
    feedback: PracticeFeedbackEntry[];
    summary: { count: number; ratedCount: number; averageRating: number | null };
  };
  return {
    feedback: payload.feedback ?? [],
    summary: payload.summary ?? { count: 0, ratedCount: 0, averageRating: null },
  } as const;
}

export async function fetchPracticePlaylist(token: string) {
  const { res, data } = await practiceAuthFetch(token, "/playlist");
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Failed to load playlist" } as const;
  }
  return { slots: (data as { slots: PracticePlaylistSlot[] }).slots ?? [] } as const;
}

export async function createPracticeBillingPortalSession(token: string) {
  const { res, data } = await practiceAuthFetch(token, "/practices/me/billing-portal", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  if (!res.ok) {
    return { error: (data as { error?: string }).error ?? "Billing portal unavailable" } as const;
  }
  const url = (data as { url?: string }).url;
  if (!url) {
    return { error: "Billing portal URL missing" } as const;
  }
  return { url } as const;
}
