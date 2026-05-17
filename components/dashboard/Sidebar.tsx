"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, MessageSquare, CalendarCheck, Wrench, 
  ShoppingBag, Star, User, Settings, LogOut, Sparkles 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const activeProviderId = "1"; // Maps directly to your registered user database id row profile node

  // Polls the database list endpoint to count total unreply rows dynamically
  useEffect(() => {
    const fetchLiveBadgeCount = async () => {
      try {
        const res = await fetch(`/api/messages/provider-list?providerId=${activeProviderId}`);
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(Number(data.totalUnreadBadge) || 0);
        }
      } catch (err) {
        console.error("Failed to fetch sidebar message notifications count:", err);
      }
    };

    fetchLiveBadgeCount();
    const notificationInterval = setInterval(fetchLiveBadgeCount, 5000); // Check updates live every 5 seconds
    return () => clearInterval(notificationInterval);
  }, []);

  const menuLinks = [
    { label: "Dashboard", path: "/dashboard/provider", icon: <LayoutDashboard size={16} /> },
    { label: "Messages", path: "/dashboard/provider/messages", icon: <MessageSquare size={16} />, dynamicBadge: unreadCount },
    { label: "Bookings", path: "/dashboard/provider/bookings", icon: <CalendarCheck size={16} /> },
    { label: "Profile", path: "/dashboard/provider/profile", icon: <User size={16} /> },
    { label: "Settings", path: "/dashboard/provider/settings", icon: <Settings size={16} /> },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-100 flex flex-col h-screen flex-shrink-0 text-slate-600 font-medium text-xs">
      {/* Platform Branding Header */}
      <div className="p-5 flex items-center gap-2 border-b border-slate-50">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
        <span className="font-black text-base tracking-tight text-slate-900">
          Servi<span className="text-blue-600">Find</span>
        </span>
      </div>

      {/* Dynamic Navigation Map Loop */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold ${
                isActive
                  ? "bg-blue-50/80 text-blue-600 shadow-sm"
                  : "hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-blue-600" : "text-slate-400"}>{link.icon}</span>
                <span>{link.label}</span>
              </div>
              
              {/* DYNAMIC NOTIFICATION COUNTER DISPLAY PIPELINE */}
              {link.dynamicBadge && link.dynamicBadge > 0 ? (
                <span className="bg-red-500 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-full shadow-sm animate-pulse min-w-[16px] text-center">
                  {link.dynamicBadge}
                </span>
              ) : link.labelBadge ? (
                <span className="bg-blue-100 text-blue-600 font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                  {link.labelBadge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Promotional Sidebar Block */}
      <div className="p-4 m-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 space-y-2.5 relative overflow-hidden flex-shrink-0">
        <div className="space-y-1 relative z-10">
          <h4 className="font-bold text-slate-900 text-[11px]">Get More Customers</h4>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">Boost your visibility and get more inquiries.</p>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-2 rounded-xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-1">
          <Sparkles size={11} /> Upgrade Now
        </button>
      </div>

      {/* Operational Exit Command Element */}
      <div className="p-4 border-t border-slate-50">
        <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 font-semibold transition-colors">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}