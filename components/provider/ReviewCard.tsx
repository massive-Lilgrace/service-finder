// components/provider/ReviewCard.tsx
"use client";

interface ReviewCardProps {
  review: {
    id: string;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-none">{review.authorName}</h4>
          <span className="text-[10px] text-gray-400 font-semibold block mt-1">{review.createdAt}</span>
        </div>
        
        {/* Visual Star Matrix Display */}
        <div className="flex text-amber-400 text-xs tracking-tighter">
          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}