// components/forms/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const sessionData = await response.json();
        // Dynamic path routing dependent on token payload role parameters
        if (sessionData.role === "admin") router.push("/dashboard/admin");
        else if (sessionData.role === "provider") router.push("/dashboard/provider");
        else router.push("/providers");
      } else {
        const errorPayload = await response.json();
        setErrorMessage(errorPayload.error || "Invalid authentication credentials parsed.");
      }
    } catch (err) {
      console.error("Login validation routing crash:", err);
      setErrorMessage("Network channel communication error. Retry later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 w-full text-gray-900">
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-semibold text-xs rounded-xl">
          ⚠️ {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="name@example.com"
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
        <input
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-sm"
      >
        {isSubmitting ? "Authenticating Session..." : "Secure Log In"}
      </button>

      <p className="text-center text-xs text-gray-500 font-medium pt-2">
        New to our marketplace?{" "}
        <Link href="/(auth)/register" className="text-blue-600 hover:underline">
          Create Account
        </Link>
      </p>
    </form>
  );
}