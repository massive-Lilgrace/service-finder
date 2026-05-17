"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // ================= SAFE NETWORK INTERACTION VALIDATION =================
      const contentType = response.headers.get("content-type");
      
      if (!contentType || !contentType.includes("application/json")) {
        if (response.status === 404) {
          throw new Error("Next.js Error 404: The endpoint '/api/auth/login' does not exist. Double check that your folder path is 'app/api/auth/login/route.ts' and your file is named 'route.ts' completely in lowercase.");
        } else {
          throw new Error(`Server Crash Error ${response.status}: Your backend route file hit an unhandled execution error. Check your black VS Code terminal console logs for the true red stack trace.`);
        }
      }

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || data.message || "Invalid credentials");
      }
      // =======================================================================

      // Safe client-side caching wrapper
      if (data.user) {
        localStorage.setItem("user", JSON.stringify({
          name: data.user.businessName || "My Store",
          email: data.user.email,
          role: data.role
        }));
      }

      alert("Login successful!");
      
      if (data.role === "provider") {
        router.push("/dashboard/provider");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-slate-900 antialiased">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md space-y-6">

        {/* Top Identity Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-400 font-semibold">
            Log in to manage your bookings and chat with providers
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold whitespace-pre-line leading-relaxed">
            {error}
          </div>
        )}

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          
          {/* Email Channel */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-slate-400" size={16} />
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" 
                required
              />
            </div>
          </div>

          {/* Password Channel */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Password</label>
              <a href="#" className="text-[10px] font-bold text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={16} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" 
                required
              />
            </div>
          </div>

          {/* Trigger Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 group pt-3 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        {/* Bottom Vendor Store Registration Router */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Are you a service provider?{" "}
            <Link href="/provider-register" className="text-blue-600 font-bold hover:underline ml-1">
              Register your store
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}