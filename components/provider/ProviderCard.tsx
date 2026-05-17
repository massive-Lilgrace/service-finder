// components/provider/ProviderCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface ProviderCardProps {
  provider: {
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
  };
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <div className="bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-5 flex flex-col sm:flex-row gap-5 transition-all shadow-sm hover:shadow-md group">
      {/* Aspect Ratio Bounded Thumbnail */}
      <div className="w-full sm:w-32 h-32 relative rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
        <Image
          src={provider.avatarUrl || "/images/placeholder.jpg"}
          alt={provider.businessName}
          fill
          className="object-cover group-hover:scale-102 transition-transform duration-200"
          sizes="(max-w-768px) 100vw, 128px"
        />
      </div>

      {/* Primary Details Stack */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
              {provider.businessName}
            </h3>
            {provider.isVerified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                ✓ Verified
              </span>
            )}
          </div>

          {/* Verification Meta Indicators */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500 mb-3 font-medium">
            <span className="flex items-center text-amber-500 font-bold">
              ★ <span className="ml-0.5 text-gray-900">{provider.rating.toFixed(1)}</span>
            </span>
            <span className="text-gray-300">•</span>
            <span>({provider.reviewCount} reviews)</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-700 font-semibold">{provider.category}</span>
            <span className="text-gray-300">•</span>
            <span>📍 {provider.location} ({provider.distance})</span>
          </div>

          {/* Technical Specialties Subtags */}
          <div className="flex flex-wrap gap-1">
            {provider.specialties.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Bound Action Pipeline */}
      <div className="sm:w-40 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-3 sm:border-l sm:border-gray-100 sm:pl-5 flex-shrink-0">
        <div className="text-left sm:text-right">
          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Base Callout</span>
          <span className="text-lg font-black text-gray-900">
            ₦{provider.serviceCallPrice.toLocaleString()}
          </span>
        </div>
        <Link
          href={`/providers/${provider.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg text-center transition-colors shadow-sm w-full max-w-[140px] sm:max-w-none"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}