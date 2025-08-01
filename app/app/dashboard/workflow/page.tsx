
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { WorkflowControl } from "@/components/workflow-control";

export default async function WorkflowPage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <WorkflowControl />
    </DashboardLayout>
  );
}
