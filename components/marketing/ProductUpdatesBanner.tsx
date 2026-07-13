"use client";

import { useEffect, useState } from "react";
import { subscribeProductUpdates } from "@/app/actions/subscribe-product-updates";

const STORAGE_KEY = "ss_updates_banner_dismissed";

export function ProductUpdatesBanner({ source = "banner" }: { source?: string }) {
  const [hidden, setHidden] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "1") {
        setHidden(false);
      }
    } catch {
      setHidden(false);
    }
  }, []);

  function dismiss() {
    setHidden(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(false);
    const result = await subscribeProductUpdates(formData);
    setPending(false);
    if (result.ok) {
      setDone(true);
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => setHidden(true), 2500);
      return;
    }
    setError(true);
  }

  if (hidden) return null;

  return (
    <div className="animate-ss-slide-down relative z-[60] overflow-hidden bg-[#07111C] text-[#F8FAFB]">
      <div className="pointer-events-none absolute inset-0 animate-ss-shimmer bg-[linear-gradient(110deg,transparent_35%,rgba(91,192,222,0.18)_50%,transparent_65%)] bg-[length:200%_100%]" />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-10 py-2 text-sm sm:px-12">
        {done ? (
          <p className="font-bold text-[#5BC0DE]">You&apos;re on the list — thanks!</p>
        ) : (
          <>
            <span className="flex items-center gap-2 font-semibold">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5BC0DE] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5BC0DE]" />
              </span>
              Get product updates — new comfort content &amp; features.
            </span>
            <form action={handleSubmit} className="flex items-center gap-2">
              <input type="hidden" name="source" value={source} />
              <label htmlFor="banner-updates-email" className="sr-only">
                Email for product updates
              </label>
              <input
                id="banner-updates-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                disabled={pending}
                className="w-44 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white placeholder:text-white/50 outline-none ring-[#5BC0DE] focus:ring-2 sm:w-52"
              />
              <button
                type="submit"
                disabled={pending}
                className="shrink-0 rounded-full bg-[#E85A9B] px-4 py-1 text-xs font-bold text-white hover:opacity-90 disabled:opacity-60"
              >
                {pending ? "…" : "Sign up"}
              </button>
            </form>
            {error ? (
              <span className="text-xs font-semibold text-[#E85A9B]">
                Try again or email hello@serenescene.app
              </span>
            ) : null}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss product updates banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
}
