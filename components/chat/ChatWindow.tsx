// components/chat/ChatWindow.tsx
"use client";

import React, { useRef, useEffect } from "react";

interface ChatWindowProps {
  children: React.ReactNode;
  headerTitle: string;
  headerSub?: string;
  footerInput: React.ReactNode;
}

export default function ChatWindow({ children, headerTitle, headerSub, footerInput }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [children]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
        <h3 className="text-sm font-black text-gray-900 leading-none">{headerTitle}</h3>
        {headerSub ? (
          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mt-1">{headerSub}</p>
        ) : null}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {children}
      </div>
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">{footerInput}</div>
      </div>
    </div>
  );
}