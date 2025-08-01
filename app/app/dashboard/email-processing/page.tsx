
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EmailProcessingOverview } from "@/components/email-processing-overview";

export default async function EmailProcessingPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <EmailProcessingOverview />
    </DashboardLayout>
  );
}
