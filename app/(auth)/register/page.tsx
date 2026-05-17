"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  // Track form input values in component state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Matches your local MySQL schema columns
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");
      router.push("/login"); // Directs user to your login page upon success
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-slate-900 antialiased">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-400 font-semibold">
            Join us today to find and book top service providers near you
          </p>
        </div>

        {/* Display Error Banner if Request Fails */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Interactive Input Area */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          
          {/* Full Name Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" 
                required
              />
            </div>
          </div>

          {/* Email Address Input */}
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={16} />
              <input 
                type="password" 
                placeholder="Minimum 6 characters" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" 
                required
              />
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input 
              type="checkbox" 
              id="terms" 
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
              required 
            />
            <label htmlFor="terms" className="text-[10px] text-slate-500 font-medium leading-tight cursor-pointer">
              I agree to the <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Registration Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 group pt-2 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Get Started"}
            {!loading && <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        {/* Bottom Switcher Route Link Panel */}
        <div className="text-center pt-4 border-t border-slate-100 space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Log in
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">
            Want to sell your services?{" "}
            <Link href="/provider-register" className="text-emerald-600 font-bold hover:underline">
              Open a provider store
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}