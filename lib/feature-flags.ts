export const FEATURE_KEYS = [
  "reviewCapture",
  "kioskAutoplay",
  "deviceTelemetry",
  "kioskLockTask",
] as const;

export type FeatureKey = (typeof FEATURE_KEYS)[number];

export type FeatureFlags = Record<FeatureKey, boolean>;

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  reviewCapture: true,
  kioskAutoplay: true,
  deviceTelemetry: true,
  kioskLockTask: true,
};

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  reviewCapture: "Post-visit Google review flow",
  kioskAutoplay: "Autoplay when AR glasses connect",
  deviceTelemetry: "Device register & heartbeat",
  kioskLockTask: "Kiosk / screen-pin mode",
};

export function featureFlagsFromFormData(formData: FormData): Partial<FeatureFlags> {
  const out: Partial<FeatureFlags> = {};
  for (const key of FEATURE_KEYS) {
    out[key] = formData.get(`feature_${key}`) === "on";
  }
  return out;
}
