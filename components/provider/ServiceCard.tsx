// components/provider/ServiceCard.tsx
"use client";

interface ServiceCardProps {
  price: number;
  category: string;
  onBookClick?: () => void;
}

export default function ServiceCard({ price, category, onBookClick }: ServiceCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 sticky top-24">
      <div>
        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
          {category} Callout Fee
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-gray-900">₦{price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 font-medium">/ base visit</span>
        </div>
      </div>

      {/* Disclaimers list matching operational tracking rules */}
      <ul className="space-y-2 text-[11px] text-gray-500 border-y border-gray-100 py-3.5 font-medium">
        <li className="flex items-start gap-2">
          <span className="text-blue-500">✓</span>
          <span>Covers diagnostics and round-trip transport logistics mapping.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500">✓</span>
          <span>Final replacement materials or part extensions invoiced independently.</span>
        </li>
      </ul>

      <button
        onClick={onBookClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-sm transition-colors text-center block"
      >
        Request Service Dispatch
      </button>
    </div>
  );
}