import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[#1B3A5B]/10 bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[#1B3A5B]/60">
        <p className="font-semibold text-[#1B3A5B]">
          <Link href="/pricing" className="hover:text-[#2B8CB8]">
            Pricing
          </Link>
          {" · "}
          <Link href="/subscribe" className="hover:text-[#2B8CB8]">
            Subscribe
          </Link>
          {" · "}
          <Link href="/practice/login" className="hover:text-[#2B8CB8]">
            Practice login
          </Link>
          {" · "}
          <Link href="/safety" className="hover:text-[#2B8CB8]">
            Safety
          </Link>
          {" · "}
          <Link href="/privacy" className="hover:text-[#2B8CB8]">
            Privacy
          </Link>
        </p>
        <p className="mt-3">
          <a href="mailto:hello@serenescene.app" className="font-semibold text-[#2B8CB8] hover:underline">
            hello@serenescene.app
          </a>
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} Envision Yourself Empowered, LLC · Serene Scene
        </p>
      </div>
    </footer>
  );
}
