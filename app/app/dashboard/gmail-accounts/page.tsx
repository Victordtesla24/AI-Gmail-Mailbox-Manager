
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { GmailAccountManagement } from "@/components/gmail-account-management";

export default async function GmailAccountsPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <GmailAccountManagement />
    </DashboardLayout>
  );
}
