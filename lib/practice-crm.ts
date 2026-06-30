export const CRM_STAGES = ["lead", "qualified", "active", "paused", "churned"] as const;
export type CrmStage = (typeof CRM_STAGES)[number];

export const CRM_STAGE_LABELS: Record<CrmStage, string> = {
  lead: "Lead",
  qualified: "Qualified",
  active: "Active customer",
  paused: "Paused",
  churned: "Churned",
};

export function namesMatchForDelete(expected: string, typed: string): boolean {
  const a = expected.trim().toLowerCase();
  const b = typed.trim().toLowerCase();
  return a.length > 0 && a === b;
}
