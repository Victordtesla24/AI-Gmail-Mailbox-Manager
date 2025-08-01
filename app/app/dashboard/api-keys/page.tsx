
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ApiKeyManagement } from "@/components/api-key-management";

export default async function ApiKeysPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <ApiKeyManagement />
    </DashboardLayout>
  );
}
