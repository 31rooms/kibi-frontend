"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

/**
 * Daily Session Page
 * Redirects to the dashboard with the daily-session section selected
 *
 * This ensures users always see the daily session within the full dashboard layout
 * with top menu, sidebar, and navigation capabilities.
 *
 * The actual content is rendered by DailySessionSection in the dashboard.
 */
export default function DailySessionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home (dashboard) with daily-session section
    // The dashboard will automatically select this section
    router.push("/home?section=daily-session");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-grey-50 dark:bg-[#0A0F1E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    </ProtectedRoute>
  );
}
