"use client";

import { useState } from "react";
import { FeatureFlagFields } from "@/components/feature-flag-fields";
import type { FeatureFlags } from "@/lib/feature-flags";
import { updateGlobalFeatureFlags } from "@/app/master/settings/actions";
import { CollapsibleRow } from "./collapsible";

type SettingsPanelProps = {
  effective: FeatureFlags;
};

export function SettingsPanel({ effective }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
      <CollapsibleRow
        isOpen={isOpen}
        onToggle={() => setIsOpen((open) => !open)}
        header={
          <>
            <h2 className="text-lg font-extrabold text-[#1B3A5B]">Global feature defaults</h2>
            <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
              Platform-wide toggles. Per-practice overrides live on the Practices page.
            </p>
          </>
        }
      >
        <form action={updateGlobalFeatureFlags}>
          <FeatureFlagFields
            effective={effective}
            legend="Global defaults (all practices unless overridden)"
          />
          <button
            type="submit"
            className="mt-6 rounded-full bg-[#2B8CB8] px-5 py-2 text-sm font-extrabold text-white"
          >
            Save global features
          </button>
        </form>
      </CollapsibleRow>
    </div>
  );
}
