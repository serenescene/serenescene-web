import { redirect } from "next/navigation";
import { getPracticeSession } from "@/lib/practice-auth";

export default async function PracticeIndexPage() {
  const session = await getPracticeSession();
  if (!session) {
    redirect("/practice/login");
  }
  redirect(session.needsOnboarding ? "/practice/onboarding" : "/practice/dashboard");
}
