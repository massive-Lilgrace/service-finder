// app/dashboard/provider/reviews/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Loader2, Inbox } from "lucide-react";

export default function ProviderReviewsDashboard() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState({ fiveStars: 0, fourStars: 0, threeStars: 0, twoStars: 0, oneStars: 0 });
  const [loading, setLoading] = useState(true);

  const activeProviderId = "mock_provider_id_101"; // Consistent placeholder ID

  useEffect(() => {
    loadReviewsData();
  }, []);

  const loadReviewsData = async () => {
    try {
      const res = await fetch(`/api/reviews/provider-list?providerId=${activeProviderId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setBreakdown(data.breakdown || { fiveStars: 0, fourStars: 0, threeStars: 0, twoStars: 0, oneStars: 0 });
      } else {
        generateMockReviewsFallback();
      }
    } catch (err) {
      console.error("Failed loading review metrics:", err);
      generateMockReviewsFallback();
    } finally {
      setLoading(false);
    }
  };

  const generateMockReviewsFallback = () => {
    setBreakdown({ fiveStars: 12, fourStars: 4, threeStars: 1, twoStars: 1, oneStars: 0 });
    setReviews([
      { id: "r1", authorName: "Amara Nwosu", rating: 5, comment: "Exceptional speed responding to my chat inquiry window! Highly recommend this online workspace node.", time: "May 10, 2026" },
      { id: "r2", authorName: "Tunde Bakare", rating: 4, comment: "Very polite communication over the phone. Job completed cleanly.", time: "May 08, 2026" },
      { id: "r3", authorName: "Funmi Adebayo", rating: 5, comment: "Verified license background documentation check checks out perfectly.", time: "May 04, 2026" }
    ]);
  };

  const totalReviews = reviews.length;

  const calculatePercentage = (count: number) => {
    if (totalReviews === 0) return "0%";
    return `${Math.round((count / totalReviews) * 100)}%`;
  };

  return (
    <div className="space-y-6 text-slate-900 text-xs font-semibold antialiased max-w-5xl">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900">Client Reviews</h1>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
          Monitor your customer feedback, star summaries, and service metrics
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <Loader2 size={24} className="animate-spin text-blue-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Panel: Aggregate Rating Performance Tracker Breakdown Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-1">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Rating Summary</h3>
              <p className="text-[10px] text-slate-400 font-medium">Platform score profile matrix balance</p>
            </div>

            {/* Performance Star Breakdown Tracks Loop */}
            <div className="space-y-2 pt-1">
              {[
                { label: "5 Stars", count: breakdown.fiveStars },
                { label: "4 Stars", count: breakdown.fourStars },
                { label: "3 Stars", count: breakdown.threeStars },
                { label: "2 Stars", count: breakdown.twoStars },
                { label: "1 Star", count: breakdown.oneStars },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                  <span className="w-12 text-slate-400 whitespace-nowrap">{row.label}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                      style={{ width: calculatePercentage(row.count) }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-800 font-extrabold">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Scrollable Comments Audit Stream List */}
          <div className="space-y-3 lg:col-span-2 w-full">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Client Comment Logs ({totalReviews})</h3>
            
            {reviews.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                <Inbox size={28} className="mx-auto text-slate-300" />
                <p className="text-xs">No customer review entries logged under your storefront catalog yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-none">{rev.authorName}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">{rev.time}</span>
                      </div>
                      
                      {/* Visual Star Scale Row */}
                      <div className="flex text-amber-500 text-xs gap-0.5">
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}