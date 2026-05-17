// components/ui/EmptyState.tsx
"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionButton?: React.ReactNode;
}

export default function EmptyState({ title, description, icon = "🔍", actionButton }: EmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm max-w-md mx-auto space-y-4">
      <div className="text-4xl select-none animate-bounce duration-1000">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-base font-black text-gray-900 tracking-tight">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">{description}</p>
      </div>
      {actionButton ? <div className="pt-2">{actionButton}</div> : null}
    </div>
  );
}