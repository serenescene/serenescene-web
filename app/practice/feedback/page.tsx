import Link from "next/link";
import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { formatPracticeDateTime, formatStarRating } from "@/lib/practice-format";
import { fetchPracticeFeedback } from "@/lib/practice-api";
import { requirePracticePage } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

export default async function PracticeFeedbackPage() {
  const { token, practice } = await requirePracticePage();
  const result = await fetchPracticeFeedback(token);
  const hasReviewLink = !!(practice.hasGoogleReviewUrl ?? practice.googleReviewUrl);

  return (
    <PracticeShell
      title="Patient feedback"
      subtitle="Optional star ratings and comments from the tablet Share feedback flow."
      navVariant="authenticated"
      navActive="feedback"
      footer={<PracticeLogoutFooter />}
    >
      {"error" in result ? (
        <div className="rounded-2xl bg-[#E85A9B]/15 px-4 py-3 text-sm font-bold">{result.error}</div>
      ) : (
        <>
          <div className="mb-6 grid gap-3 rounded-2xl bg-[#F8FAFB] p-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
                Submissions
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#1B3A5B]">{result.summary.count}</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
                With stars
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#1B3A5B]">
                {result.summary.ratedCount}
              </p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#1B3A5B]/50">
                Average rating
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#E85A9B]">
                {result.summary.averageRating != null
                  ? `${result.summary.averageRating} / 5`
                  : "—"}
              </p>
            </div>
          </div>

          {!hasReviewLink ? (
            <div className="mb-6 rounded-2xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">
              Add your Google review link in{" "}
              <Link href="/practice/dashboard" className="underline">
                Practice hub
              </Link>{" "}
              so patients can optionally leave a Google review after rating.
            </div>
          ) : null}

          {result.feedback.length === 0 ? (
            <div className="rounded-2xl bg-[#F8FAFB] p-6 text-center text-sm font-bold text-[#1B3A5B]/70">
              No feedback yet. Patients can tap Share feedback on a paired tablet after their visit.
            </div>
          ) : (
            <ul className="divide-y divide-[#1B3A5B]/10 rounded-2xl border border-[#1B3A5B]/10">
              {result.feedback.map((entry) => (
                <li key={entry.id} className="px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-lg font-extrabold text-[#E85A9B]">
                      {formatStarRating(entry.starRating)}
                    </p>
                    <p className="text-xs font-bold text-[#1B3A5B]/55">
                      {formatPracticeDateTime(entry.createdAt)}
                      {entry.deviceLabel ? ` · ${entry.deviceLabel}` : ""}
                    </p>
                  </div>
                  {entry.comment ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed font-bold text-[#1B3A5B]/85">
                      {entry.comment}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-bold text-[#1B3A5B]/45">No comment</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </PracticeShell>
  );
}
