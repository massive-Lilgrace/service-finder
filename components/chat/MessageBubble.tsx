// components/chat/MessageBubble.tsx
"use client";

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isMe: boolean;
  senderName: string;
}

export default function MessageBubble({ text, timestamp, isMe, senderName }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm transition-all ${
        isMe 
          ? "bg-blue-600 text-white rounded-br-none" 
          : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
      }`}>
        {!isMe ? (
          <p className="text-[9px] font-black tracking-wider text-blue-600 uppercase mb-0.5">{senderName}</p>
        ) : null}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{text}</p>
        <span className={`block text-[9px] mt-1 text-right font-medium select-none ${
          isMe ? "text-blue-200" : "text-gray-400"
        }`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}