import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SeeItInActionVideo } from "@/components/marketing/SeeItInActionVideo";
import { seeItInAction } from "@/lib/marketing-content";

function posterExists(src: string) {
  if (!src.startsWith("/")) return false;
  const relative = src.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}

export function SeeItInActionSection() {
  const hasPoster = posterExists(seeItInAction.posterImage);

  return (
    <section
      id={seeItInAction.id}
      className="scroll-mt-24 border-y border-[#1B3A5B]/10 bg-white py-16 md:py-20"
      aria-labelledby="see-it-in-action-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2B8CB8]">
            {seeItInAction.eyebrow}
          </p>
          <h2 id="see-it-in-action-heading" className="mt-3 text-3xl font-extrabold md:text-4xl">
            {seeItInAction.headline}
          </h2>
          <p className="mt-4 text-lg font-semibold text-[#1B3A5B]/70">{seeItInAction.subhead}</p>
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
          <div className="relative overflow-hidden rounded-3xl border border-[#1B3A5B]/10 bg-[#07111C] shadow-2xl">
            <div className="relative aspect-[4/3] w-full">
              {hasPoster ? (
                <Image
                  src={seeItInAction.posterImage}
                  alt="Serene Scene XR comfort system in a dental operatory"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              ) : (
                <ProductGlamourPlaceholder />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111C]/80 via-transparent to-[#2B8CB8]/10" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm">
                Turnkey operatory kit — glasses, tablet player, and calming content.
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#1B3A5B]/10 bg-[#F8FAFB] shadow-xl">
            <SeeItInActionVideo videoUrl={seeItInAction.videoUrl} />
          </div>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3">
          {seeItInAction.highlights.map((item) => (
            <li
              key={item}
              className="rounded-2xl bg-[#F8FAFB] px-4 py-3 text-center text-sm font-bold text-[#1B3A5B]/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProductGlamourPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07111C]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_#2B8CB8_0%,_transparent_50%)] opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,_#5BC0DE_0%,_transparent_45%)] opacity-40" />
      <div className="absolute left-[12%] top-[18%] h-[42%] w-[34%] rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-sm" />
      <div className="absolute bottom-[14%] right-[10%] h-[28%] w-[48%] rounded-3xl border border-white/20 bg-[#1B3A5B]/70 shadow-2xl" />
      <div className="absolute bottom-[22%] right-[14%] h-[12%] w-[18%] rounded-2xl border border-[#5BC0DE]/40 bg-[#2B8CB8]/30" />
      <div className="absolute left-[18%] top-[28%] text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        XR glasses
      </div>
      <div className="absolute bottom-[30%] right-[18%] text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        Chairside tablet
      </div>
    </div>
  );
}
