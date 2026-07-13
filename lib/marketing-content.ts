export const PRICING = {
  setupPerOperatory: 999,
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
  headline: "Calm Patient.",
  headlineAccent: "Better Reviews.",
  headlineBrand: "Serene Scene.",
  subhead:
    "Serene Scene is a turnkey XR comfort system for dental operatories — calming video on lightweight glasses, simple staff controls, and optional Google review prompts when patients are at ease.",
  primaryCta: { label: "View pricing & subscribe", href: "/pricing" },
  secondaryCta: { label: "See it in action", href: "#see-it-in-action" },
};

/** Explainer video + poster — set NEXT_PUBLIC_EXPLAINER_VIDEO_URL in Vercel (YouTube, Vimeo, or MP4). */
export const seeItInAction = {
  id: "see-it-in-action",
  eyebrow: "See it in action",
  headline: "Calm patients. Confident staff.",
  subhead:
    "Serene Scene in the operatory — lightweight XR glasses, a chairside tablet, and calming content patients actually enjoy.",
  /** Drop a glamour shot at public/see-it-in-action-poster.jpg (or .webp). */
  posterImage: "/see-it-in-action-poster.jpg",
  videoUrl: process.env.NEXT_PUBLIC_EXPLAINER_VIDEO_URL?.trim() ?? "",
  highlights: [
    "XR glasses stay comfortable through the visit",
    "Staff control volume and playlist from the tablet",
    "Optional review prompt when patients are at ease",
  ],
} as const;

export const trustPoints = [
  "Not a medical device — wellness & distraction positioning",
  "No PHI collected from patients",
  "Turnkey operatory kits included",
  "Remote app & playlist updates over Wi‑Fi",
] as const;

export const howItWorks = [
  {
    step: "1",
    title: "We configure it",
    body: "We configure your Serene Scene hardware, software, in-house ads and videos. Staff training is quick and easy.",
  },
  {
    step: "2",
    title: "Your patient uses it",
    body: "Patients are distracted during treatment. Calming scenes and audio play on the glasses while your team controls volume and playlist from the tablet.",
  },
  {
    step: "3",
    title: "We update the content",
    body: "Updates push new audiovisual content directly to your device regularly.",
  },
  {
    step: "4",
    title: "You get the reviews",
    body: "Following treatment, patients are presented with an option to rate your practice while they're still in the chair — right on the player device.",
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
    period: "per chair",
    description:
      "Includes XR glasses, Android video player, and your in-house ad configuration.",
    includes: [
      "XR glasses",
      "Android video player",
      "Your in-house ad configuration",
      "Simple video-guided set-up",
    ],
  },
  subscription: {
    title: "Serene Scene Video Subscription",
    price: PRICING.monthlyPerOperatory,
    period: "per chair / month",
    description:
      "Includes video library updates, hardware support, and practice portal access.",
    includes: [
      "Curated library of videos selected for maximum patient comfort",
      "Patient rating dashboard",
      "Automatic app updates via Google Play",
    ],
  },
} as const;

export const funnelSteps = [
  { n: 1, title: "Create practice account", href: "/practice/signup" },
  { n: 2, title: "Pay setup + start subscription", href: "/practice/subscribe" },
  { n: 3, title: "Hardware arrives within 2 weeks, configured and ready to go — right out of the box!" },
  { n: 4, title: "Go live chairside", href: "/practice/help" },
] as const;

export const faq = [
  {
    q: "Why is setup separate from the monthly fee?",
    a: "Setup covers physical hardware and our installation time. The monthly subscription funds content production, licensing, custom practice placements, and ongoing support.",
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
