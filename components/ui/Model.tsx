// components/ui/Modal.tsx
"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg border border-gray-200 shadow-2xl p-6 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-base font-black text-gray-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 text-sm">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}