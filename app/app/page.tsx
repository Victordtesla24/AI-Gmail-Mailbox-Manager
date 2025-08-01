
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getAuthSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  redirect("/dashboard");
}
