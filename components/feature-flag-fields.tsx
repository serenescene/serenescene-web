import { FEATURE_KEYS, FEATURE_LABELS, type FeatureFlags } from "@/lib/feature-flags";

type FeatureFlagFieldsProps = {
  effective: FeatureFlags;
  legend?: string;
};

export function FeatureFlagFields({ effective, legend }: FeatureFlagFieldsProps) {
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
        Uncheck to disable for this scope. Tablets pick up changes on next app resume.
      </p>
    </fieldset>
  );
}
