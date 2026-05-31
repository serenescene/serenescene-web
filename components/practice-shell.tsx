import Link from "next/link";
import type { ReactNode } from "react";
import { PracticeFooterLinks, PracticeNav } from "./practice-nav";
import type { PracticeNavActive } from "./practice-nav";

type PracticeShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Show pill navigation under the header */
  navVariant?: "authenticated" | "public";
  navActive?: PracticeNavActive;
};

export function PracticeShell({
  title,
  subtitle,
  children,
  footer,
  navVariant,
  navActive,
}: PracticeShellProps) {
  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-10 text-[#F8FAFB]">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE] hover:text-[#7DD3EF]"
        >
          ← Serene Scene home
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{title}</h1>
        {subtitle ? (
          <p className="mt-3 text-sm leading-relaxed text-[#F8FAFB]/70">{subtitle}</p>
        ) : null}
        {navVariant ? (
          <PracticeNav variant={navVariant} active={navActive} />
        ) : null}
        <section className="mt-8 rounded-3xl bg-white p-6 text-[#1B3A5B] shadow-2xl">
          {children}
        </section>
        <div className="mt-6 space-y-4 text-center text-sm">
          <PracticeFooterLinks />
          {footer ? <div>{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}
