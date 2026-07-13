export type VideoEmbed =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string };

/** Turn a YouTube, Vimeo, or direct MP4/WebM URL into something we can embed. */
export function parseVideoEmbed(url: string): VideoEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (!id) return null;
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      };
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "");
      if (!id) return null;
      return {
        kind: "youtube",
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      };
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      return {
        kind: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`,
      };
    }

    if (/\.(mp4|webm|mov)(\?|$)/i.test(parsed.pathname)) {
      return { kind: "file", src: trimmed };
    }
  } catch {
    return null;
  }

  return null;
}

export function hasExplainerVideo(url: string) {
  return parseVideoEmbed(url) !== null;
}
