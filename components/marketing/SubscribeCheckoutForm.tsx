"use client";

import { useMemo, useState, useTransition } from "react";
import { estimateTotals, formatUsd, PRICING } from "@/lib/marketing-content";
import { startCheckout } from "@/app/practice/subscribe/actions";

type SubscribeCheckoutFormProps = {
  checkoutEnabled: boolean;
  defaultOperatories?: number;
  canceled?: boolean;
};

export function SubscribeCheckoutForm({
  checkoutEnabled,
  defaultOperatories = 1,
  canceled = false,
}: SubscribeCheckoutFormProps) {
  const [operatories, setOperatories] = useState(defaultOperatories);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const totals = useMemo(() => estimateTotals(operatories), [operatories]);

  function handleCheckout(formData: FormData) {
    setCheckoutError(null);
    startTransition(async () => {
      const result = await startCheckout(formData);
      if (!result.ok) {
        setCheckoutError(result.error);
        return;
      }
      window.location.assign(result.url);
    });
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
      {canceled ? (
        <div className="mb-6 rounded-2xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
          Checkout was canceled. You can try again when ready.
        </div>
      ) : null}
      {checkoutError ? (
        <div className="mb-6 rounded-2xl border border-[#E85A9B]/40 bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold text-rose-900">
          {checkoutError}
        </div>
      ) : null}

      <label className="block text-sm font-extrabold text-[#1B3A5B]">
        Quantity of Hardware Bundles
        <select
          name="operatories"
          value={operatories}
          onChange={(e) => setOperatories(Number.parseInt(e.target.value, 10))}
          className="mt-2 w-full rounded-2xl border border-[#1B3A5B]/20 px-4 py-3 font-bold outline-none focus:border-[#5BC0DE]"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} Serene Scene{n === 1 ? "" : "s"}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-6 space-y-3 rounded-2xl bg-[#F8FAFB] p-4 text-sm">
        <div className="flex justify-between font-bold">
          <span>Setup ({totals.operatories}× {formatUsd(PRICING.setupPerOperatory)})</span>
          <span>{formatUsd(totals.setupTotal)} due today</span>
        </div>
        <div className="flex justify-between font-bold text-[#1B3A5B]/75">
          <span>Service ({totals.operatories}× {formatUsd(PRICING.monthlyPerOperatory)}/mo)</span>
          <span>{formatUsd(totals.monthlyTotal)}/month</span>
        </div>
        <p className="text-xs font-semibold text-[#1B3A5B]/55">
          {PRICING.termMonths}-month service term · Billed monthly after setup
        </p>
      </div>

      {checkoutEnabled ? (
        <form action={handleCheckout} className="mt-6">
          <input type="hidden" name="operatories" value={operatories} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[#1B3A5B] px-6 py-4 text-base font-extrabold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Opening secure checkout…" : "Continue to secure checkout"}
          </button>
          <p className="mt-3 text-center text-xs font-semibold text-[#1B3A5B]/50">
            Powered by Stripe · Setup + first subscription charge on one checkout
          </p>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB] p-4 text-sm font-bold text-[#1B3A5B]/75">
          Online checkout is being activated. Email{" "}
          <a href="mailto:hello@serenescene.app" className="text-[#2B8CB8] underline">
            hello@serenescene.app
          </a>{" "}
          with your operatory count and we&apos;ll send a Stripe invoice.
        </div>
      )}
    </div>
  );
}
