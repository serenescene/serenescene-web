import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { marketingNav } from "@/lib/marketing-content";

export function MarketingNav() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const hasLogo = fs.existsSync(logoPath);

  return (
    <header className="border-b border-[#1B3A5B]/8 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          {hasLogo ? (
            <Image
              src="/logo.png"
              alt="Serene Scene"
              width={220}
              height={56}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <span className="text-lg font-extrabold text-[#1B3A5B]">Serene Scene</span>
          )}
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {marketingNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#1B3A5B]/80 hover:text-[#2B8CB8]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/pricing"
            className="hidden rounded-full border border-[#2B8CB8]/40 px-4 py-2 text-sm font-bold text-[#2B8CB8] hover:bg-[#2B8CB8]/5 sm:inline-block"
          >
            Pricing
          </Link>
          <Link
            href="/practice/subscribe"
            className="rounded-full bg-[#2B8CB8] px-4 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Subscribe
          </Link>
        </div>
      </nav>
    </header>
  );
}
