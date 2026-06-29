export const PRICING = {
  setupPerOperatory: 1000,
  monthlyPerOperatory: 249,
  termMonths: 24,
  currency: "USD",
} as const;

export const marketingNav = [
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
  { href: "/practice/login", label: "Practice login" },
] as const;

export const hero = {
  eyebrow: "Chairside comfort for modern dental practices",
  headline: "Calm patients in the chair.",
  headlineAccent: "Stronger reviews after the visit.",
  subhead:
    "Serene Scene is a turnkey XR comfort system for dental operatories — calming video on lightweight glasses, simple staff controls, and optional Google review prompts when patients are at ease.",
  primaryCta: { label: "View pricing & subscribe", href: "/pricing" },
  secondaryCta: { label: "Book a demo", href: "#demo-request" },
};

export const trustPoints = [
  "Not a medical device — wellness & distraction positioning",
  "No PHI collected from patients",
  "Hardware provisioned after setup payment",
  "Remote app & playlist updates over Wi‑Fi",
] as const;

export const howItWorks = [
  {
    step: "1",
    title: "We install your operatory kit",
    body: "After setup payment, we ship and configure the tablet player, XR glasses, and office Wi‑Fi checklist. Your team gets a short chairside guide.",
  },
  {
    step: "2",
    title: "Patients escape during treatment",
    body: "Staff place glasses before the procedure. Calming scenes and audio play on the glasses while your team controls volume and playlist from the tablet.",
  },
  {
    step: "3",
    title: "Your subscription keeps content fresh",
    body: "Monthly service funds our video library, production updates, and optional in-practice promotional placements — custom clips for your office when you subscribe.",
  },
] as const;

export const benefits = [
  {
    title: "Less chair anxiety",
    body: "Immersive nature and ambient audio help patients focus away from clinical sights and sounds — without sedation claims.",
  },
  {
    title: "Reviews at the right moment",
    body: "Optional star feedback and a one-tap Google review link after a relaxed visit. Patients are never required to review.",
  },
  {
    title: "Done-for-you operations",
    body: "We handle the player app, content pipeline, device monitoring, and over-the-air updates. Your staff taps play.",
  },
  {
    title: "Your practice, your promos",
    body: "Subscriber practices can receive custom in-chair video placements — office branding, services, or seasonal messages alongside the core library.",
  },
] as const;

export const pricingPlans = {
  setup: {
    title: "Operatory setup",
    price: PRICING.setupPerOperatory,
    period: "one-time per chair",
    description:
      "Covers XR glasses, tablet player, initial configuration, and our time to install and train your team. We order hardware after this payment clears.",
    includes: [
      "XR glasses + configured Android player",
      "On-site or guided remote setup",
      "Kiosk lock-down for clinic floor",
      "Staff quick-start guide",
    ],
  },
  subscription: {
    title: "Serene Scene service",
    price: PRICING.monthlyPerOperatory,
    period: "per operatory / month",
    description:
      "Funds ongoing video production, library updates, device support, practice portal access, and optional custom in-practice ad placements.",
    includes: [
      "Curated calming video library + updates",
      "Practice-specific promotional videos (subscriber)",
      "Playlist & device dashboard",
      "Patient feedback summaries",
      "App updates via Google Play",
      "Email support",
    ],
  },
} as const;

export const funnelSteps = [
  { n: 1, title: "Create practice account", href: "/practice/signup" },
  { n: 2, title: "Pay setup + start subscription", href: "/subscribe" },
  { n: 3, title: "We schedule install", body: "Hardware ships after setup payment." },
  { n: 4, title: "Go live chairside", href: "/practice/help" },
] as const;

export const faq = [
  {
    q: "Why is setup separate from the monthly fee?",
    a: "Setup covers physical hardware and our installation time — we don't purchase your kit until you've paid. The monthly subscription funds content production, licensing, custom practice placements, and ongoing support.",
  },
  {
    q: "Is this a medical or sedation device?",
    a: "No. Serene Scene is a patient comfort and distraction experience for dental offices. It does not diagnose, treat, or sedate. See our safety page for contraindications and staff responsibilities.",
  },
  {
    q: "Can I add a second operatory later?",
    a: "Yes. Each operatory needs its own setup fee and monthly subscription line. Contact us or add chairs through your account when you're ready.",
  },
  {
    q: "Do patients have to leave a Google review?",
    a: "Never. Review prompts are optional and only appear when you connect your Google review link.",
  },
  {
    q: "What if Wi‑Fi goes down?",
    a: "The player needs internet for playlist sync and updates. Staff can reconnect from Settings on the tablet; we include a Wi‑Fi setup guide in every kit.",
  },
] as const;

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function estimateTotals(operatories: number) {
  const n = Math.max(1, Math.min(20, operatories));
  return {
    operatories: n,
    setupTotal: n * PRICING.setupPerOperatory,
    monthlyTotal: n * PRICING.monthlyPerOperatory,
  };
}
