
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { MaintenanceLogs } from "@/components/maintenance-logs";

export default async function MaintenancePage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <MaintenanceLogs />
    </DashboardLayout>
  );
}
