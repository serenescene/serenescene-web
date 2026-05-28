"use client";

import { useState } from "react";

type PracticeOption = {
  id: string;
  name: string;
  email: string;
};

type ContentPracticeAssignProps = {
  practices: PracticeOption[];
  assignedPracticeIds: string[];
  initialVisibility: string;
};

export function ContentPracticeAssign({
  practices,
  assignedPracticeIds,
  initialVisibility,
}: ContentPracticeAssignProps) {
  const [visibility, setVisibility] = useState(initialVisibility);
  const showPractices = visibility === "client_specific";

  return (
    <>
      <label className="text-xs font-extrabold uppercase text-[#1B3A5B]/60">
        Visibility
        <select
          name="visibility"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="mt-1 w-full rounded-xl border border-[#1B3A5B]/15 px-3 py-2 normal-case text-[#1B3A5B]"
        >
          <option value="global">Global</option>
          <option value="client_specific">Client specific</option>
          <option value="internal">Internal</option>
        </select>
      </label>

      {showPractices ? (
        <div className="col-span-12 rounded-2xl border border-[#5BC0DE]/30 bg-[#5BC0DE]/10 p-4">
          <div className="text-xs font-extrabold uppercase text-[#1B3A5B]/70">
            Assigned practices
          </div>
          <p className="mt-1 text-xs text-[#1B3A5B]/60">
            Only selected practices will receive this video on their tablets.
          </p>
          {practices.length === 0 ? (
            <p className="mt-3 text-sm font-bold text-[#1B3A5B]/70">
              No practices yet. Create one under Master → Practices first.
            </p>
          ) : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {practices.map((practice) => (
                <li key={practice.id}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      name="practiceIds"
                      value={practice.id}
                      defaultChecked={assignedPracticeIds.includes(practice.id)}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-extrabold">{practice.name}</span>
                      <span className="mt-0.5 block text-xs text-[#1B3A5B]/55">
                        {practice.email}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </>
  );
}
