// components/navbar/MobileMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  userRole?: "customer" | "provider" | "admin";
}

export default function MobileMenu({ isOpen, onClose, isAuthenticated = false, userRole }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navigationLinks = [
    { label: "Home Marketplace", path: "/providers" },
    { label: "About Platform", path: "/about" },
    { label: "Contact Operations", path: "/contact" },
  ];

  // Structural sub-links rendering depending on active authentication flags
  const getDashboardPath = () => {
    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "provider") return "/dashboard/provider";
    return "/dashboard/customer";
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Darkened Backdrop blur mask */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Slide-out Menu Panel container */}
      <nav className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col p-6 text-gray-900 border-l border-gray-100 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between mb-8">
          <span className="font-black text-lg tracking-tight text-blue-600">ServiFind Menu</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Core Link Array Blocks */}
        <div className="flex flex-col gap-4 flex-1">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`text-sm font-bold tracking-tight py-2.5 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated && (
            <Link
              href={getDashboardPath()}
              onClick={onClose}
              className="text-sm font-bold tracking-tight py-2.5 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-t border-gray-100 mt-2 pt-4"
            >
              ⚙️ Go To Dashboard
            </Link>
          )}
        </div>

        {/* Dedicated Account CTA Action Buttons Footer line */}
        <div className="border-t border-gray-100 pt-6 flex flex-col gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => { /* Handle Logout */ onClose(); }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider py-3 rounded-lg transition-colors text-center"
            >
              Sign Out Account
            </button>
          ) : (
            <>
              <Link
                href="/(auth)/login"
                onClick={onClose}
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider py-3 rounded-lg transition-colors text-center"
              >
                Sign In
              </Link>
              <Link
                href="/(auth)/provider-register"
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg transition-colors text-center shadow-sm"
              >
                Join As Provider
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}