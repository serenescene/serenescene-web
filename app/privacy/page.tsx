import Link from "next/link";
import { Nav } from "@/components/Nav";
import { PrivacyDocument } from "@/components/privacy-document";

export const metadata = {
  title: "Privacy policy — Serene Scene",
  description: "Privacy policy for Serene Scene Player and the practice web portal.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFB] text-[#1B3A5B]">
      <Nav />
      <div className="px-8 py-12">
        <PrivacyDocument />
        <p className="mx-auto mt-12 max-w-3xl text-center text-sm font-bold text-[#1B3A5B]/50">
          <Link href="/" className="text-[#2B8CB8] underline">
            Back to home
          </Link>
          {" · "}
          <Link href="/safety" className="text-[#2B8CB8] underline">
            Safety &amp; use
          </Link>
        </p>
      </div>
    </main>
  );
}
