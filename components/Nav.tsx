import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

export function Nav() {
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const hasLogo = fs.existsSync(logoPath);

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        {hasLogo ? (
          <Image
            src="/logo.png"
            alt="Serene Scene"
            width={220}
            height={56}
            className="h-10 w-auto"
            priority
          />
        ) : (
          <div
            className="h-10 w-44 rounded-md bg-[#1B3A5B]/10"
            aria-label="Serene Scene logo placeholder"
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        <a
          href="/practice/login"
          className="text-[#1B3A5B] font-semibold hover:text-[#2B8CB8]"
        >
          Practice login
        </a>
        <a
          href="/practice/signup"
          className="bg-[#2B8CB8] text-white px-5 py-2 rounded-full font-semibold hover:opacity-90"
        >
          Get started
        </a>
        <a
          href="#contact"
          className="bg-[#E85A9B] text-white px-5 py-2 rounded-full font-semibold hover:opacity-90"
        >
          Request Demo
        </a>
      </div>
    </nav>
  );
}
