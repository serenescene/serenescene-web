import Link from "next/link";

export type PracticeNavActive = "dashboard" | "onboarding" | "login" | "signup";

type PracticeNavProps = {
  variant: "authenticated" | "public";
  active?: PracticeNavActive;
};

const authenticatedLinks: { href: string; label: string; key: PracticeNavActive | "home" | "safety" | "contact" }[] = [
  { href: "/practice/dashboard", label: "Practice hub", key: "dashboard" },
  { href: "/", label: "Home", key: "home" },
  { href: "/safety", label: "Safety", key: "safety" },
  { href: "/#contact", label: "Contact", key: "contact" },
];

const publicLinks: { href: string; label: string; key: PracticeNavActive | "home" | "safety" }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/practice/login", label: "Sign in", key: "login" },
  { href: "/practice/signup", label: "Sign up", key: "signup" },
  { href: "/safety", label: "Safety", key: "safety" },
];

function isActive(linkKey: string, active: PracticeNavActive | undefined): boolean {
  if (!active) return false;
  return linkKey === active;
}

export function PracticeNav({ variant, active }: PracticeNavProps) {
  const links = variant === "authenticated" ? authenticatedLinks : publicLinks;

  return (
    <nav
      className="mt-5 flex flex-wrap gap-2"
      aria-label="Practice site navigation"
    >
      {links.map((link) => {
        const activeLink = isActive(link.key, active);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeLink
                ? "bg-[#5BC0DE] text-[#07111C]"
                : "bg-white/10 text-[#F8FAFB] hover:bg-white/20"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function PracticeFooterLinks() {
  return (
    <p className="text-[#F8FAFB]/70">
      <Link href="/" className="font-bold text-[#5BC0DE] underline">
        Home
      </Link>
      {" · "}
      <Link href="/safety" className="font-bold text-[#5BC0DE] underline">
        Safety
      </Link>
      {" · "}
      <Link href="/#contact" className="font-bold text-[#5BC0DE] underline">
        Contact
      </Link>
      {" · "}
      <a
        href="mailto:hello@serenescene.app"
        className="font-bold text-[#5BC0DE] underline"
      >
        Support
      </a>
    </p>
  );
}
