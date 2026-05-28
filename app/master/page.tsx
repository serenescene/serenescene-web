import { redirect } from "next/navigation";
import { isMasterDashboardAuthenticated } from "@/lib/master-auth";

export const dynamic = "force-dynamic";

export default async function MasterIndexPage() {
  if (await isMasterDashboardAuthenticated()) {
    redirect("/master/content");
  }
  redirect("/master/login");
}
