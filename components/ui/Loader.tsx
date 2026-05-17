// components/ui/Loader.tsx
"use client";

export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className="flex items-center justify-center p-6 w-full h-full">
      <div className={`${sizeMap[size]} border-blue-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}