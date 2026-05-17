// components/provider/ProviderGallery.tsx
"use client";

import Image from "next/image";

interface ProviderGalleryProps {
  images: string[];
}

export default function ProviderGallery({ images = [] }: ProviderGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center text-xs text-gray-400 font-medium">
        No portfolio workspace project media uploaded to this profile yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Project Portfolio</h3>
      
      {/* Horizontal Scroll Grid Layout */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 snap-x">
        {images.map((url, i) => (
          <div 
            key={i} 
            className="w-48 h-36 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm snap-start flex-shrink-0 group cursor-zoom-in"
          >
            <Image
              src={url}
              alt={`Portfolio evidence visualization clip ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="192px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}