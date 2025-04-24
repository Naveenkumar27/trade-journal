"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { DashboardContent } from "@/components/dashboard-content";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { session, loading } = useUser();
  const router = useRouter();

  // Redirect to login if the session is not available after loading
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [loading, session, router]);

  // Show loading spinner while waiting for user session or during the loading process
  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If session is not found, wait for the redirect to happen
  if (!session) {
    return null; 
  }

  return <DashboardContent />;
}
