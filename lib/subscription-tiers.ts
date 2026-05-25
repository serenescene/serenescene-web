export const SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "past_due",
  "canceled",
  "inactive",
  "legacy",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trial: "Trial",
  active: "Active",
  past_due: "Past due",
  canceled: "Canceled",
  inactive: "Inactive",
  legacy: "Legacy (demo — all features, toggles)",
};
