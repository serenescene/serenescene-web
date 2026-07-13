"use client";

import { useState } from "react";
import { subscribeProductUpdates } from "@/app/actions/subscribe-product-updates";

type ProductUpdatesSignupProps = {
  source?: string;
  variant?: "footer" | "inline";
};

export function ProductUpdatesSignup({
  source = "homepage_footer",
  variant = "footer",
}: ProductUpdatesSignupProps) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(false);

    const result = await subscribeProductUpdates(formData);

    setPending(false);
    if (result.ok) {
      setDone(true);
      return;
    }
    setError(true);
  }

  if (done) {
    return (
      <p
        className={
          variant === "footer"
            ? "text-sm font-semibold text-[#2B8CB8]"
            : "rounded-2xl bg-[#5BC0DE]/15 px-4 py-3 font-bold text-[#1B3A5B]"
        }
      >
        You&apos;re on the list — thanks!
      </p>
    );
  }

  const isFooter = variant === "footer";

  return (
    <div className={isFooter ? "mt-6" : ""}>
      <p
        className={
          isFooter
            ? "text-sm font-semibold text-[#1B3A5B]"
            : "text-lg text-[#1B3A5B]/70"
        }
      >
        {isFooter ? "Product updates" : "Sign up for product updates"}
      </p>
      {!isFooter ? (
        <p className="mt-2 text-sm text-[#1B3A5B]/60">
          Occasional news on features and content — one field, no spam.
        </p>
      ) : null}
      <form
        action={handleSubmit}
        className={
          isFooter
            ? "mx-auto mt-3 flex max-w-md flex-col gap-2 sm:flex-row"
            : "mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"
        }
      >
        <input type="hidden" name="source" value={source} />
        <label htmlFor={`updates-email-${source}`} className="sr-only">
          Email for product updates
        </label>
        <input
          id={`updates-email-${source}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          disabled={pending}
          className={
            isFooter
              ? "min-w-0 flex-1 rounded-full border border-[#1B3A5B]/15 bg-[#F8FAFB] px-4 py-2.5 text-sm text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
              : "min-w-0 flex-1 rounded-full border border-[#1B3A5B]/20 bg-white px-5 py-3 text-[#1B3A5B] outline-none ring-[#5BC0DE] focus:ring-2"
          }
        />
        <button
          type="submit"
          disabled={pending}
          className={
            isFooter
              ? "shrink-0 rounded-full bg-[#2B8CB8] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              : "shrink-0 rounded-full bg-[#E85A9B] px-6 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          }
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-sm font-semibold text-[#E85A9B]">
          Something went wrong. Try again or email{" "}
          <a href="mailto:hello@serenescene.app" className="underline">
            hello@serenescene.app
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
