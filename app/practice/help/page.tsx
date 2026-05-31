import { PracticeHelpContent } from "@/components/practice-help-content";
import { PracticeLogoutFooter } from "@/components/practice-logout-footer";
import { PracticeShell } from "@/components/practice-shell";
import { requirePracticePage } from "@/lib/practice-auth";

export const dynamic = "force-dynamic";

export default async function PracticeHelpPage() {
  await requirePracticePage();

  return (
    <PracticeShell
      title="Staff guide"
      subtitle="Chairside steps for your team — safety, glasses, Wi-Fi, and optional reviews."
      navVariant="authenticated"
      navActive="help"
      footer={<PracticeLogoutFooter />}
    >
      <PracticeHelpContent />
    </PracticeShell>
  );
}
