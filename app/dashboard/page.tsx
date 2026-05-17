// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function GeneralDashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Read the authenticated security token object out of browser memory storage
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!storedUser) {
      // If no account session exists, bounce them straight back to login panel
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      
      // 2. Evaluate registration role metrics path targets
      // Checks if user is signed up as a client or a service provider business profile
      if (parsedUser.role === "provider" || parsedUser.isProvider === true) {
        router.replace("/dashboard/provider");
      } else {
        router.replace("/dashboard/client");
      }
    } catch (error) {
      console.error("Failed executing entry routing redirects:", error);
      router.replace("/login");
    }
  }, [router]);

  // Display a clean, responsive fullscreen synchronization loading state during processing
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center text-slate-400 font-medium text-xs gap-3">
      <Loader2 className="animate-spin text-blue-600" size={24} />
      <p className="uppercase tracking-widest font-bold">Syncing Account Environment Session...</p>
    </div>
  );
}