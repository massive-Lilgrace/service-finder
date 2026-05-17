// components/provider/ProviderInfo.tsx
"use client";

import Image from "next/image";

interface ProviderInfoProps {
  provider: {
    id: string;
    businessName: string;
    category: string;
    rating: number;
    reviewCount: number;
    phone: string;
    address: string;
    city: string;
    state: string;
    biography: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  onInitiateChat: () => void;
}

export default function ProviderInfo({ provider, onInitiateChat }: ProviderInfoProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative rounded-full overflow-hidden bg-slate-100 border border-gray-200 flex-shrink-0">
            <Image 
              src={provider.avatarUrl || "/images/placeholder.jpg"} 
              alt={provider.businessName} 
              fill 
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{provider.businessName}</h1>
              {provider.isVerified && (
                <span className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-200">
                  ✓ Pro Verified
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">{provider.category} Expert</p>
          </div>
        </div>

        {/* Messaging Communication Trigger */}
        <button
          onClick={onInitiateChat}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-sm transition-colors text-center"
        >
          Message Provider
        </button>
      </div>

      {/* Meta Location Details Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-gray-100">
          <span className="text-base">📍</span>
          <div>
            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Workshop Hub</span>
            <span className="text-gray-800">{provider.address}, {provider.city}, {provider.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-gray-100">
          <span className="text-base">📞</span>
          <div>
            <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Business Phone</span>
            <span className="text-gray-800">{provider.phone}</span>
          </div>
        </div>
      </div>

      {/* About Biography Context */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Business Biography</h3>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
          {provider.biography || "This specialist has not specified a public operational biography statement yet."}
        </p>
      </div>
    </div>
  );
}