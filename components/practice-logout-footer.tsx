import { logoutPractice } from "@/app/practice/actions";

export function PracticeLogoutFooter() {
  return (
    <form action={logoutPractice}>
      <button type="submit" className="font-bold text-[#5BC0DE] underline">
        Sign out
      </button>
    </form>
  );
}
