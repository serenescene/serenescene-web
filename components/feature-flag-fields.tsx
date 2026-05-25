import { FEATURE_KEYS, FEATURE_LABELS, type FeatureFlags } from "@/lib/feature-flags";

type FeatureFlagFieldsProps = {
  effective: FeatureFlags;
  legend?: string;
  /** Shown on practice portal for Legacy (demo) tier */
  variant?: "master" | "legacy-demo";
};

export function FeatureFlagFields({
  effective,
  legend,
  variant = "master",
}: FeatureFlagFieldsProps) {
  return (
    <fieldset className="mt-4 rounded-2xl border border-[#1B3A5B]/15 bg-[#F8FAFB] p-4">
      {legend ? (
        <legend className="px-1 text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/60">
          {legend}
        </legend>
      ) : null}
      <ul className="mt-2 space-y-2">
        {FEATURE_KEYS.map((key) => (
          <li key={key}>
            <label className="flex cursor-pointer items-start gap-3 text-sm font-bold">
              <input
                type="checkbox"
                name={`feature_${key}`}
                defaultChecked={effective[key]}
                className="mt-1"
              />
              <span>
                {FEATURE_LABELS[key]}
                <span className="mt-0.5 block text-xs font-bold text-[#1B3A5B]/50">
                  {key}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs font-bold text-[#1B3A5B]/50">
        {variant === "legacy-demo"
          ? "Legacy demo tier: all features start enabled. Uncheck to try the app with features off. Tablets apply changes when the app is reopened."
          : "Uncheck to disable for this practice. Tablets pick up changes on next app resume."}
      </p>
    </fieldset>
  );
}
