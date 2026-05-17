// components/dashboard/Topbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopbarProps {
  userName?: string;
  avatarLetter?: string;
}

export default function Topbar({ userName = "Merchant Specialist", avatarLetter = "M" }: TopbarProps) {
  const pathname = usePathname();

  // Client-side visual string helper to construct basic trace paths
  const formatBreadcrumb = (path: string) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 1) return "Dashboard Overview";
    return parts[parts.length - 1].replace(/-/g, " ");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm flex-shrink-0">
      {/* Current Dashboard Section Label Tracking Context */}
      <div>
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider capitalize">
          {formatBreadcrumb(pathname)}
        </h2>
      </div>

      {/* User Context Identification Segment */}
      <div className="flex items-center gap-4">
        <Link
          href="/providers"
          className="text-[11px] font-bold text-gray-500 hover:text-blue-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider"
        >
          View Marketplace
        </Link>

        {/* Separator block */}
        <div className="h-4 w-px bg-gray-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 text-blue-700 font-extrabold text-xs">
            {avatarLetter}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-gray-700 tracking-tight">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}