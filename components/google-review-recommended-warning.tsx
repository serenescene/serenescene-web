export function GoogleReviewRecommendedWarning({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-amber-400/50 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-950 ${className}`}
    >
      <p className="font-extrabold">Highly recommended</p>
      <p className="mt-1 font-bold text-amber-900/90">
        Adding your Google review link lets patients leave a review in one tap after their visit.
        Most practices see better reviews when this is connected — but it is optional.
      </p>
    </div>
  );
}
