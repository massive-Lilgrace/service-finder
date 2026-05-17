"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search, Bell, MessageSquare, ChevronDown, User, Mail, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StandardProviderDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Dynamic user data state hooks
  const [userData, setUserData] = useState({
    name: "User",
    email: "loading...",
    initials: "U"
  });

  // Load and clean auth data from browser storage when user logs in
  useEffect(() => {
    // Check local storage properties
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const fullName = parsed.name || "Service Provider";
        
        // Extract initials from first and last name strings
        const initials = fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        setUserData({
          name: fullName,
          email: parsed.email || "",
          initials: initials || "SP"
        });
      } catch (e) {
        console.error("Error reading auth state tokens", e);
      }
    }
  }, []);

  // Close dropdown if user clicks away on screen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Log user out safely
  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="h-screen w-screen bg-slate-50/50 flex overflow-hidden antialiased font-medium text-slate-700">
      
      {/* Left Drawer Container Navigation Anchor */}
      <Sidebar />

      {/* Main Content Workspace Panel Context */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Operational Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shadow-sm flex-shrink-0">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight leading-none">Dashboard</h2>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 block">Welcome back, {userData.name}!</span>
          </div>

          {/* Core Action Tools Wrapper Panel */}
          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden md:flex items-center">
              <Search className="absolute left-3.5 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full text-xs border border-slate-100 bg-slate-50/50 px-4 py-2 pl-9 rounded-xl outline-none focus:bg-white focus:border-blue-500 transition" 
              />
            </div>

            <div className="flex items-center gap-3.5 border-l border-slate-100 pl-6">
              <button className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-xl hover:bg-slate-50 relative">
                <MessageSquare size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition p-1.5 rounded-xl hover:bg-slate-50 relative">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
            </div>

            {/* INTERACTIVE PROFILE AVATAR DROPDOWN WIDGET */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 pl-2 cursor-pointer group select-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-700 text-white font-black text-xs flex items-center justify-center shadow-md overflow-hidden relative uppercase">
                  {userData.initials}
                </div>
                <div className="text-left hidden sm:block">
                  <h4 className="text-xs font-bold text-slate-900 leading-none group-hover:text-blue-600 transition">{userData.name}</h4>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Service Provider</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>

              {/* FLOATING ACTION POPOVER CARD */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200/80 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Signed in as</p>
                    <p className="text-xs font-black text-slate-900 truncate mt-0.5">{userData.name}</p>
                    <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                      <Mail size={12} className="text-slate-400" />
                      <span className="text-[11px] font-medium truncate max-w-full block text-slate-400">{userData.email}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setDropdownOpen(false); router.push("/dashboard/provider/profile"); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition text-left"
                  >
                    <User size={14} />
                    My Profile Settings
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition text-left border-t border-slate-100 mt-1"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dynamic Main Page Content Frame Loading Pipeline Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/40">
          <div className="max-w-[1400px] mx-auto w-full animate-in fade-in duration-200">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}