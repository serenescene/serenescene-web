import Link from "next/link";
import type { ReactNode } from "react";

type PracticeShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function PracticeShell({ title, subtitle, children, footer }: PracticeShellProps) {
  return (
    <main className="min-h-screen bg-[#07111C] px-6 py-10 text-[#F8FAFB]">
      <div className="mx-auto max-w-lg">
        <Link href="/" className="text-sm font-bold uppercase tracking-[0.24em] text-[#5BC0DE]">
          Serene Scene
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold">{title}</h1>
        {subtitle ? (
          <p className="mt-3 text-sm leading-relaxed text-[#F8FAFB]/70">{subtitle}</p>
        ) : null}
        <section className="mt-8 rounded-3xl bg-white p-6 text-[#1B3A5B] shadow-2xl">
          {children}
        </section>
        {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
      </div>
    </main>
  );
}
