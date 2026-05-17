// app/providers/category/[slug]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Provider {
  id: string;
  businessName: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  serviceCallPrice: number;
  isVerified: boolean;
  avatarUrl: string;
  specialties: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryArchivePage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Unwrap the dynamic URL parameter promise safely
  const resolvedParams = use(params);
  const currentSlug = resolvedParams.slug;

  // Formatting helper to match display categories (e.g., "ac-repair" to "AC Repair")
  const formatCategoryName = (slug: string) => {
    if (slug.toLowerCase() === "ac-repair") return "AC Repair";
    return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  };

  const industryTitle = formatCategoryName(currentSlug);

  // Layout Filter States
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [selectedRating, setSelectedRating] = useState<number | null>(
    searchParams.get("rating") ? Number(searchParams.get("rating")) : null
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "nearest");

  // Functional Data States
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProviders = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("category", industryTitle);
        if (locationQuery) queryParams.append("location", locationQuery);
        if (selectedRating) queryParams.append("rating", String(selectedRating));
        queryParams.append("sortBy", sortBy);

        const response = await fetch(`/api/providers?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProviders(data);
        } else {
          generateCategoryMockData();
        }
      } catch (error) {
        console.error("Failed fetching specialized industry loop:", error);
        generateCategoryMockData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProviders();
  }, [industryTitle, locationQuery, selectedRating, sortBy]);

  const generateCategoryMockData = () => {
    // Isolated Mock profiles matching selected industry context criteria
    const fullMockSet = [
      {
        id: "1",
        businessName: "QuickFix Plumbing Services",
        category: "Plumbing",
        rating: 4.9,
        reviewCount: 122,
        location: "Ikeja, Lagos",
        distance: "1.2 km away",
        serviceCallPrice: 5000,
        isVerified: true,
        avatarUrl: "unsplash.com",
        specialties: ["Pipe Repair", "Installation", "Water Heater", "Drain Cleaning"],
      },
      {
        id: "2",
        businessName: "Lagos Plumbing Experts",
        category: "Plumbing",
        rating: 4.7,
        reviewCount: 98,
        location: "Yaba, Lagos",
        distance: "3.1 km away",
        serviceCallPrice: 4500,
        isVerified: true,
        avatarUrl: "unsplash.com",
        specialties: ["Pipe Repair", "Bathroom Fittings", "Drain Cleaning"],
      },
      {
        id: "4",
        businessName: "VoltMaster Electrical Hub",
        category: "Electrical",
        rating: 4.8,
        reviewCount: 74,
        location: "Lekki, Lagos",
        distance: "2.5 km away",
        serviceCallPrice: 7000,
        isVerified: true,
        avatarUrl: "unsplash.com",
        specialties: ["Wiring", "Inverter Setup", "Fault Findings", "Breaker Panel"],
      }
    ];

    // Simple filter simulation to demonstrate page flexibility
    const filtered = fullMockSet.filter(
      p => p.category.toLowerCase() === industryTitle.toLowerCase()
    );
    
    setProviders(filtered.length > 0 ? filtered : [fullMockSet[0]]);
  };

  const handleInlineLocationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationQuery) params.append("location", locationQuery);
    if (selectedRating) params.append("rating", String(selectedRating));
    params.append("sortBy", sortBy);
    
    router.push(`/providers/category/${currentSlug}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Category Inline Search Utility */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <form onSubmit={handleInlineLocationSearch} className="max-w-7xl mx-auto flex gap-3 items-center">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">📍</span>
            <input
              type="text"
              placeholder={`Search ${industryTitle} near you (City, state or area)...`}
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors"
          >
            Update Location
          </button>
        </form>
      </div>

      {/* Primary Workspace Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Secondary Refinement Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white p-6 rounded-xl border border-gray-200 h-fit shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-sm uppercase tracking-wider text-gray-400">Industry</h2>
            <Link href="/providers" className="text-xs text-blue-600 hover:underline font-medium">
              View All Industries
            </Link>
          </div>

          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-3.5 flex items-center gap-2.5">
            <span className="text-xl">🛠️</span>
            <div>
              <p className="text-xs text-gray-500 font-medium">Filtering Only</p>
              <h4 className="font-bold text-blue-900 text-sm">{industryTitle}</h4>
            </div>
          </div>

          {/* Localized Star Rating Checkboxes */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setSelectedRating(stars === selectedRating ? null : stars)}
                  className={`w-full text-left flex items-center justify-between text-sm py-1.5 px-2 rounded transition-colors ${
                    selectedRating === stars ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center text-amber-500">
                    {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                    <span className="ml-2 text-gray-500 text-xs font-normal">& up</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Feed Container Layout */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <nav className="text-xs text-gray-400 font-medium mb-1 flex items-center gap-1.5">
                <Link href="/providers" className="hover:text-gray-600">Marketplace</Link>
                <span>/</span>
                <span className="text-gray-600">{industryTitle}</span>
              </nav>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                {industryTitle} Professionals
              </h1>
            </div>

            {/* Layout Order Pipeline Dropdown */}
            <div className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
              <span className="text-gray-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="nearest">Nearest Pro</option>
                <option value="rating">Top Performance</option>
                <option value="price_low">Budget-Friendly</option>
              </select>
            </div>
          </div>

          {/* Output Content Logic Conditionals */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="bg-white border border-gray-100 rounded-xl p-5 h-36 animate-pulse" />
              ))}
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-sm">No localized specialists active matching selected filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row gap-5 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="w-full sm:w-28 h-28 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={provider.avatarUrl}
                      alt={provider.businessName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900">{provider.businessName}</h3>
                        {provider.isVerified && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ VERIFIED
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="text-amber-500 font-bold">★ {provider.rating}</span>
                        <span>({provider.reviewCount} reviews)</span>
                        <span>•</span>
                        <span>📍 {provider.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {provider.specialties.map((spec) => (
                          <span key={spec} className="bg-gray-50 text-gray-600 px-2 py-0.5 border border-gray-100 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-36 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 sm:border-l sm:border-gray-100 sm:pl-4">
                    <div className="text-left sm:text-right">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Base Callout</span>
                      <span className="text-lg font-black text-gray-900">₦{provider.serviceCallPrice}</span>
                    </div>
                    <Link
                      href={`/providers/${provider.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg text-center transition-colors w-full"
                    >
                      View Studio
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}