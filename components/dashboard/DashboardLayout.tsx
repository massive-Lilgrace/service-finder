// components/dashboard/DashboardLayout.tsx
"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "provider" | "admin";
  userName?: string;
  avatarLetter?: string;
}

export default function DashboardLayout({ children, role, userName, avatarLetter }: DashboardLayoutProps) {
  return (
    <div className="h-screen w-screen bg-slate-50 flex overflow-hidden antialiased">
      {/* Persistent App Drawer Grid Column */}
      <Sidebar role={role} />

      {/* Primary Variable Context Field View */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Horizontal System Action Bar */}
        <Topbar userName={userName} avatarLetter={avatarLetter} />

        {/* Dynamic Nested Content Loading Grid Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}