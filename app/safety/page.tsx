import Link from "next/link";
import { SafetyDocument } from "@/components/safety-document";
import { Nav } from "@/components/Nav";

export const metadata = {
  title: "Safety & use — Serene Scene",
  description:
    "Contraindications, stop-use symptoms, and practice responsibilities for Serene Scene in dental offices.",
};

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <Nav />
      <div className="px-8 py-12">
        <SafetyDocument />
        <p className="mx-auto mt-12 max-w-3xl text-center text-sm font-bold text-[#1B3A5B]/50">
          <Link href="/" className="text-[#2B8CB8] underline">
            Back to home
          </Link>
          {" · "}
          <Link href="/practice/login" className="text-[#2B8CB8] underline">
            Practice login
          </Link>
        </p>
      </div>
    </main>
  );
}
