
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalyticsReporting } from "@/components/analytics-reporting";

export default async function AnalyticsPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <AnalyticsReporting />
    </DashboardLayout>
  );
}
