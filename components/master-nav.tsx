import Link from "next/link";

const links = [
  { href: "/master/content", label: "Content" },
  { href: "/master/practices", label: "Practices" },
  { href: "/master/devices", label: "Devices" },
  { href: "/master/settings", label: "Features" },
];

export function MasterNav({
  active,
}: {
  active: "content" | "practices" | "devices" | "settings";
}) {
  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const isActive =
          (active === "content" && link.href.endsWith("/content")) ||
          (active === "practices" && link.href.endsWith("/practices")) ||
          (active === "devices" && link.href.endsWith("/devices")) ||
          (active === "settings" && link.href.endsWith("/settings"));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              isActive
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
