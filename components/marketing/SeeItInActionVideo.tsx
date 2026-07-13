"use client";

import { useMemo, useState } from "react";
import { parseVideoEmbed } from "@/lib/explainer-video";

type SeeItInActionVideoProps = {
  videoUrl: string;
};

export function SeeItInActionVideo({ videoUrl }: SeeItInActionVideoProps) {
  const [playing, setPlaying] = useState(false);
  const embed = useMemo(() => parseVideoEmbed(videoUrl), [videoUrl]);
  const hasVideo = embed !== null;

  if (playing && embed) {
    return (
      <div className="relative aspect-video w-full bg-black">
        {embed.kind === "file" ? (
          <video
            className="h-full w-full"
            src={embed.src}
            controls
            autoPlay
            playsInline
            title="Serene Scene explainer video"
          />
        ) : (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embed.embedUrl}
            title="Serene Scene explainer video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => hasVideo && setPlaying(true)}
      disabled={!hasVideo}
      className="group relative flex aspect-video w-full flex-col items-center justify-center bg-[#07111C] text-center disabled:cursor-default"
      aria-label={hasVideo ? "Play Serene Scene explainer video" : undefined}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#2B8CB8_0%,_transparent_65%)] opacity-40" />
      {hasVideo ? (
        <>
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#E85A9B] shadow-lg transition group-hover:scale-105 group-hover:opacity-95">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 h-9 w-9 text-white">
              <path d="M8 5.14v14.72a1 1 0 001.5.86l11.33-7.36a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" />
            </svg>
          </span>
          <p className="relative mt-5 px-6 text-lg font-extrabold text-white">Watch the explainer</p>
          <p className="relative mt-2 px-6 text-sm font-semibold text-white/70">
            Under a minute — how Serene Scene works chairside.
          </p>
        </>
      ) : (
        <div className="relative px-6">
          <p className="text-lg font-extrabold text-white">Explainer video coming soon</p>
          <p className="mt-2 text-sm font-semibold text-white/70">
            Questions now?{" "}
            <a
              href="mailto:hello@serenescene.app"
              className="text-[#5BC0DE] underline"
              onClick={(e) => e.stopPropagation()}
            >
              hello@serenescene.app
            </a>
          </p>
        </div>
      )}
    </button>
  );
}
