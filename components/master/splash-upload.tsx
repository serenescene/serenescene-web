"use client";

import { useState } from "react";
import { clearSplashImage, uploadSplashImage } from "@/app/master/settings/actions";
import { CollapsibleRow } from "./collapsible";

type SplashUploadProps = {
  apiBaseUrl: string;
  hasCustom: boolean;
  updatedAt: string | null;
};

export function SplashUpload({ apiBaseUrl, hasCustom, updatedAt }: SplashUploadProps) {
  const [isOpen, setIsOpen] = useState(true);
  const previewUrl = hasCustom
    ? `${apiBaseUrl.replace(/\/$/, "")}/branding/splash?t=${encodeURIComponent(updatedAt ?? "")}`
    : null;

  return (
    <div className="overflow-hidden rounded-3xl bg-white text-[#1B3A5B] shadow-2xl">
      <CollapsibleRow
        isOpen={isOpen}
        onToggle={() => setIsOpen((open) => !open)}
        header={
          <>
            <h2 className="text-lg font-extrabold text-[#1B3A5B]">Player splash image</h2>
            <p className="mt-1 text-xs font-semibold text-[#1B3A5B]/55">
              Shown full-size on Player Device launch and on the glasses idle screen.
            </p>
          </>
        }
      >
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#1B3A5B]/10 bg-[#F8FAFB]">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Current splash"
                className="mx-auto max-h-64 w-full object-contain p-4"
              />
            ) : (
              <p className="px-4 py-10 text-center text-sm font-semibold text-[#1B3A5B]/55">
                Using the default Serene Scene logo. Upload a JPEG, PNG, or WebP to replace it.
              </p>
            )}
          </div>

          <form action={uploadSplashImage} className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-bold">
              Image file
              <input
                type="file"
                name="splash"
                accept="image/jpeg,image/png,image/webp"
                required
                className="mt-1 block w-full text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-[#2B8CB8] px-5 py-2 text-sm font-extrabold text-white"
            >
              Upload splash
            </button>
          </form>

          {hasCustom ? (
            <form action={clearSplashImage}>
              <button
                type="submit"
                className="rounded-full bg-rose-100 px-4 py-2 text-sm font-extrabold text-rose-800"
              >
                Restore default logo
              </button>
            </form>
          ) : null}
          <p className="text-xs font-semibold text-[#1B3A5B]/55">
            Max 2 MB. Player Devices pick this up on the next app launch.
          </p>
        </div>
      </CollapsibleRow>
    </div>
  );
}
