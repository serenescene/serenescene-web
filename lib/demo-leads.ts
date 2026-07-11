export const DEMO_LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
export type DemoLeadStatus = (typeof DEMO_LEAD_STATUSES)[number];

export const DEMO_LEAD_STATUS_LABELS: Record<DemoLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

export type DemoLead = {
  id: string;
  practiceName: string;
  contactName: string;
  email: string;
  operatories: string | null;
  message: string | null;
  source: string;
  status: string;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
};
