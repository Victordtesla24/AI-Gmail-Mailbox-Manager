
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { SystemConfiguration } from "@/components/system-configuration";

export default async function SystemConfigPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <SystemConfiguration />
    </DashboardLayout>
  );
}
