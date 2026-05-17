// components/chat/FileUpload.tsx
"use client";

import React, { useState } from "react";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  allowedTypes?: string;
}

export default function FileUpload({ onUploadComplete, allowedTypes = "image/*" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formPayload = new FormData();
    formPayload.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formPayload,
      });

      if (response.ok) {
        const data = await response.json();
        onUploadComplete(data.url);
      } else {
        alert("Upload asset streaming rejected. Check node configuration.");
      }
    } catch (err) {
      console.error("Binary media file pipe interrupted:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center flex-shrink-0 text-sm">
      <input
        type="file"
        accept={allowedTypes}
        onChange={handleUploadProcess}
        disabled={isUploading}
        className="hidden"
      />
      {isUploading ? (
        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span>📎</span>
      )}
    </label>
  );
}