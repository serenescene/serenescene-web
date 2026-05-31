export function formatPracticeDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatStarRating(rating: number) {
  const clamped = Math.max(0, Math.min(5, rating));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)} (${clamped}/5)`;
}

export function formatDurationSec(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatSubscriptionStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function deviceOnlineLabel(lastSeenAt: string | null): {
  label: string;
  tone: "ok" | "warn" | "muted";
} {
  if (!lastSeenAt) {
    return { label: "Never connected", tone: "muted" };
  }
  const seen = new Date(lastSeenAt).getTime();
  const hoursAgo = (Date.now() - seen) / (1000 * 60 * 60);
  if (hoursAgo < 24) {
    return { label: `Online · ${formatPracticeDateTime(lastSeenAt)}`, tone: "ok" };
  }
  if (hoursAgo < 72) {
    return { label: `Seen ${formatPracticeDateTime(lastSeenAt)}`, tone: "warn" };
  }
  return { label: `Offline · last seen ${formatPracticeDateTime(lastSeenAt)}`, tone: "warn" };
}
