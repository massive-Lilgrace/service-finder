"use client";

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Star } from "lucide-react";
import ProviderCard from "@/components/provider/ProviderCard";

const MOCK_PROVIDERS = [
  {
    id: "1",
    name: "QuickFix Plumbing Services",
    category: "Plumbing",
    rating: 4.9,
    reviewsCount: 122,
    location: "Ikeja, Lagos",
    distance: "1.2 km away",
    price: 5000,
    tags: ["Pipe Repair", "Installation", "Drain Cleaning"],
    verified: true,
  },
  {
    id: "2",
    name: "Lagos Plumbing Experts",
    category: "Plumbing",
    rating: 4.6,
    reviewsCount: 84,
    location: "Yaba, Lagos",
    distance: "3.1 km away",
    price: 4500,
    tags: ["Water Heater", "Bathroom Fittings"],
    verified: true,
  },
];

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState("Plumbing");
  const categories = ["All Categories", "Plumbing", "Electrical", "Cleaning", "AC Repair", "Carpentry"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-slate-900 bg-slate-50 min-h-screen">
      
      {/* Search Input Bar Panel */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-3 mb-6">
        <div className="w-full flex items-center px-2 gap-2 md:border-r border-slate-200 py-1">
          <Search className="text-blue-600 shrink-0" size={18} />
          <input type="text" placeholder="What service do you need?" className="w-full bg-transparent focus:outline-none text-sm" />
        </div>
        <div className="w-full flex items-center px-2 gap-2 py-1">
          <MapPin className="text-blue-600 shrink-0" size={18} />
          <input type="text" placeholder="Lagos, Nigeria" className="w-full bg-transparent focus:outline-none text-sm" />
        </div>
        <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition shrink-0">
          Search
        </button>
      </div>

      {/* Main Structural Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filter Panel */}
        <aside className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="font-bold text-sm flex items-center gap-2 text-slate-800"><SlidersHorizontal size={16}/> Filters</h2>
            <button className="text-xs text-blue-600 font-medium">Clear All</button>
          </div>

          {/* Categories Filter list */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs px-3 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Search Results Display Area */}
        <main className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">
              Found <span className="text-slate-900 font-bold">245 Plumbers</span> in Lagos
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {MOCK_PROVIDERS.map((provider) => (
              <ProviderCard key={provider.id} {...provider} />
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}