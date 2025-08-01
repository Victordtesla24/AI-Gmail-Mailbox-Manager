
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard-overview";

export default async function DashboardPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
