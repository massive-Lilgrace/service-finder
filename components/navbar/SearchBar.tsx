// components/navbar/SearchBar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchBarProps {
  variant?: "hero" | "header";
}

export default function SearchBar({ variant = "header" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Populate data defaults transparently from active layout context nodes
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const handleSearchExecution = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query.trim()) params.append("query", query.trim());
    if (location.trim()) params.append("location", location.trim());

    // Pipe operational criteria directly to marketplace main routing engine
    router.push(`/providers?${params.toString()}`);
  };

  const isHeroMode = variant === "hero";

  return (
    <form 
      onSubmit={handleSearchExecution} 
      className={`w-full flex flex-col md:flex-row items-center gap-2 bg-white ${
        isHeroMode 
          ? "p-3 rounded-2xl shadow-xl border border-gray-100 max-w-3xl mx-auto" 
          : "p-1.5 rounded-xl border border-gray-300 max-w-2xl"
      }`}
    >
      {/* Service Type Text Input Segment */}
      <div className="relative flex-1 w-full flex items-center">
        <span className="pl-3 text-gray-400 absolute left-0 text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Plumber, AC technician, electrician..."
          className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Split separator border styling line */}
      <div className="hidden md:block h-6 w-px bg-gray-200 self-center" />

      {/* Geographic Location Parameter Input Segment */}
      <div className="relative flex-1 w-full flex items-center">
        <span className="pl-3 text-gray-400 absolute left-0 text-sm pointer-events-none">📍</span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Area or city (e.g. Ikeja, Lekki)..."
          className="w-full bg-transparent pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Submit Action Block Button variant switches */}
      <button
        type="submit"
        className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm ${
          isHeroMode ? "px-8 py-3.5 rounded-xl" : "px-6 py-2.5 rounded-lg"
        }`}
      >
        Search
      </button>
    </form>
  );
}