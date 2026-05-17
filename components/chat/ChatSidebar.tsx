// components/chat/ChatSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface ThreadSummary {
  id: string;
  participantName: string;
  businessName?: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  unreadCount: number;
}

interface ChatSidebarProps {
  conversations: ThreadSummary[];
}

export default function ChatSidebar({ conversations = [] }: ChatSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 text-gray-900">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 font-medium">No open chat histories.</div>
        ) : (
          conversations.map((chat) => {
            const chatUrl = `/messages/${chat.id}`;
            const isActive = pathname === chatUrl;
            return (
              <Link
                key={chat.id}
                href={chatUrl}
                className={`block p-4 transition-colors relative hover:bg-slate-50 ${
                  isActive ? "bg-blue-50/60 border-l-4 border-blue-600 pl-3" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-none">{chat.participantName}</h4>
                    {chat.businessName ? (
                      <span className="text-[10px] font-medium text-blue-600 block mt-0.5">{chat.businessName}</span>
                    ) : null}
                  </div>
                  <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">{chat.lastMessageTimestamp}</span>
                </div>
                <p className="text-xs text-gray-500 truncate pr-4 leading-normal">{chat.lastMessageText}</p>
                {chat.unreadCount > 0 ? (
                  <span className="absolute bottom-4 right-4 bg-blue-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}