// components/forms/MessageForm.tsx
"use client";

import { useState } from "react";

interface MessageFormProps {
  onMessageSent: (text: string) => void;
}

export default function MessageForm({ onMessageSent }: MessageFormProps) {
  const [textInput, setTextInput] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // Pipe string directly to tracking layout handlers inside messages folder view
    onMessageSent(textInput.trim());
    setTextInput("");
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex gap-2.5 items-center text-gray-900 bg-white">
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Inquire about assignment timelines, parts procurement estimates..."
        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
      />
      <button
        type="submit"
        disabled={!textInput.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-black text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-sm flex-shrink-0"
      >
        Send
      </button>
    </form>
  );
}