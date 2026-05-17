// components/dashboard/StatsCard.tsx
"use client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
      <div className="space-y-2">
        <span className="block text-[10px] text-gray-400 font-black uppercase tracking-widest">
          {title}
        </span>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
          {value}
        </h3>

        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <span className={trend.isPositive ? "text-emerald-600" : "text-rose-600"}>
              {trend.isPositive ? "▲" : "▼"} {trend.value}
            </span>
            <span className="text-gray-400 font-normal">since past cycle</span>
          </div>
        )}
      </div>

      {/* Decorative Icon Container Node Layout */}
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-center text-xl shadow-inner">
        {icon}
      </div>
    </div>
  );
}