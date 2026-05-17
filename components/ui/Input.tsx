// components/ui/Input.tsx
"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full space-y-1.5 text-gray-900">
      <label htmlFor={inputId} className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 bg-white border ${
          error ? "border-rose-400 focus:ring-rose-500" : "border-gray-300 focus:ring-blue-600"
        } rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[11px] font-semibold text-rose-600 mt-1">⚠️ {error}</p>
      ) : null}
    </div>
  );
}