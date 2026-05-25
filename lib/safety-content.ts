export const SAFETY_CONTENT_REVISION = 1;

export const safetyContraindications = [
  "Vertigo, dizziness, or inner-ear / balance disorders (including BPPV)",
  "History of seizures, epilepsy, or blackouts with flashing lights",
  "Migraines or severe headaches triggered by screens or visual stress",
  "Serious heart disease or fainting when changing position (e.g. standing from the chair)",
  "Severe anxiety, panic, claustrophobia, or PTSD if immersive wear may cause distress",
  "Pregnancy (higher risk of nausea — use only with dentist approval)",
  "Under age 13 unless parent/guardian and dentist approve",
  "Currently nauseated, intoxicated, or unable to signal discomfort",
  "Cannot tolerate reclining or rapid dental-chair movement",
  "Contagious eye or facial skin infection, or open wounds where glasses rest",
];

export const safetyStopSymptoms = [
  "Severe dizziness, spinning, or nausea",
  "Vision changes, eye pain, or flashing lights",
  "Headache, confusion, or feeling faint",
  "Seizure-like symptoms or loss of awareness",
  "Anxiety, panic, or need to remove the glasses immediately",
];

export const safetySections = [
  {
    title: "Purpose",
    body: "Serene Scene provides calming audiovisual content and optional AR glasses during dental visits. It is intended for patient comfort and distraction, not for diagnosis or treatment.",
  },
  {
    title: "Not medical treatment",
    body: "Serene Scene does not diagnose, treat, or cure any medical or dental condition. It is not a substitute for professional dental or medical care. Individual responses vary; no specific clinical outcome is guaranteed.",
  },
  {
    title: "Ask the dentist first — consider avoiding use if the patient has",
    bullets: safetyContraindications,
  },
  {
    title: "Stop use immediately if the patient reports",
    bullets: safetyStopSymptoms,
    note: "Remove glasses, pause video, raise the dental chair slowly, and follow your office emergency protocols.",
  },
  {
    title: "Dental practice responsibilities",
    bullets: [
      "Screen patients before each use when clinically appropriate",
      "Obtain informed consent per your office policies",
      "Follow AR glasses manufacturer safety, age, and hygiene guidance",
      "Sanitize shared surfaces between patients; do not use on contagious eye/skin conditions",
      "Use content without strobing or rapid flashing lights",
      "Supervise patients who may have difficulty removing the device",
    ],
  },
  {
    title: "Hardware & environment",
    bullets: [
      "Follow XREAL (or your glasses vendor) health and safety documentation",
      "Manage cables to avoid trip hazards",
      "Set volume at a safe, comfortable level",
      "Patients with pacemakers or implanted devices should follow their physician and device manufacturer guidance regarding consumer electronics",
    ],
  },
  {
    title: "Privacy",
    body: "Optional review features may open an external browser (e.g. Google). Serene Scene does not require patients to leave a rating or review.",
  },
];

export const safetyDisclaimer =
  "This page summarizes product safety information for dental practices. It is not legal advice. Consult your healthcare and legal advisors for practice-specific consent and policies. Content revision " +
  SAFETY_CONTENT_REVISION +
  ".";
