"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Phone, Send, Loader2, Inbox, Trash2 } from "lucide-react";

export default function ProviderMessagesDashboard() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [unreadBadgeTotal, setUnreadBadgeTotal] = useState(0); // Tracks current global notification number indicator counts
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProviderId = "1"; 

  useEffect(() => {
    loadConversationThreads();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversationThreads = async () => {
    try {
      const res = await fetch(`/api/messages/provider-list?providerId=${activeProviderId}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.threads || []);
        setUnreadBadgeTotal(data.totalUnreadBadge || 0);

        // Dynamically append badge count numbers onto the global window browser navigation tab title
        document.title = data.totalUnreadBadge > 0 ? `(${data.totalUnreadBadge}) Messages | Dashboard` : "Messages | Dashboard";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  const loadIndividualConversationFeed = async (thread: any) => {
    setActiveChat(thread);
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/messages/feed?conversationId=${thread.id}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        
        // Refresh channels list to clear counts after opening a thread
        setTimeout(loadConversationThreads, 500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  // Handles deleting an old conversation row item safely
  const handleDeleteThreadChannelItem = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation(); // Stops thread from loading when clicking the delete button
    if (!confirm("Are you sure you want to delete this conversation thread permanently?")) return;

    try {
      const res = await fetch(`/api/messages/provider-list?conversationId=${conversationId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        if (activeChat?.id === conversationId) {
          setActiveChat(null);
          setMessages([]);
        }
        loadConversationThreads();
      }
    } catch (err) {
      console.error("Failed to delete thread execution context:", err);
    }
  };

  const handleProviderReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChat) return;

    const payloadText = typedMessage.trim();
    setTypedMessage("");

    try {
      const res = await fetch("/api/messages/provider-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeChat.id, text: payloadText })
      });

      if (res.ok) {
        const freshMessage = await res.json();
        setMessages((prev) => [...prev, freshMessage.data]);
        loadConversationThreads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden text-slate-900 font-medium">
      
      {/* Lateral Conversations Selection Panel */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col h-full flex-shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {/* CHANGED: Header Title swapped from "INBOUND CHANNELS" to "CHATS" */}
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">CHATS</h3>
          
          {/* DYNAMIC NOTIFICATION BADGE DESIGN */}
          {unreadBadgeTotal > 0 ? (
            <span className="text-[10px] bg-red-500 px-2 py-0.5 rounded-full font-bold text-white shadow-sm animate-bounce">
              {unreadBadgeTotal} New
            </span>
          ) : (
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">{conversations.length} items</span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loadingList ? (
            <div className="p-8 text-center"><Loader2 size={20} className="animate-spin text-blue-600 mx-auto" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2 mt-12">
              <Inbox size={28} className="mx-auto text-slate-300" />
              <p className="text-xs">No active inquiry channels established.</p>
            </div>
          ) : (
            conversations.map((chat: any) => (
              <div
                key={chat.id}
                onClick={() => loadIndividualConversationFeed(chat)}
                className={`w-full text-left p-4 transition flex flex-col gap-1 hover:bg-slate-50 relative group cursor-pointer ${
                  activeChat?.id === chat.id ? "bg-blue-50/60 border-l-4 border-blue-600 pl-3" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-none">{chat.guestName}</h4>
                  <span className="text-[9px] text-slate-400 font-semibold group-hover:hidden">{chat.time}</span>
                  
                  {/* INLINE DELETE ACTIONS BUTTON */}
                  <button 
                    onClick={(e) => handleDeleteThreadChannelItem(e, chat.id)}
                    className="text-slate-400 hover:text-red-600 transition hidden group-hover:block absolute right-4 top-3 p-1 rounded hover:bg-slate-100"
                    title="Delete Conversation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 truncate leading-normal pr-8">{chat.lastMessageText}</p>
                {chat.providerUnreadCount > 0 && (
                  <span className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-blue-600 shadow-sm" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Conversational Thread Layout Window Frame */}
      <div className="flex-1 flex flex-col bg-slate-50/40 h-full overflow-hidden">
        {activeChat ? (
          <>
            <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-sm flex-shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-none">{activeChat.guestName}</h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-1 flex items-center gap-1">
                  <Phone size={10} /> {activeChat.guestPhone}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {loadingChat ? (
                <div className="h-full flex items-center justify-center"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
              ) : (
                messages.map((msg: any) => {
                  const isProvider = msg.senderType === "provider";
                  return (
                    <div key={msg.id} className={`flex w-full ${isProvider ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm border text-xs leading-relaxed ${
                        isProvider ? "bg-blue-600 text-white border-blue-600 rounded-br-none" : "bg-white text-slate-800 border-slate-200/80 rounded-bl-none"
                      }`}>
                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        <span className={`block text-[8px] mt-1 text-right font-bold tracking-tight select-none ${
                          isProvider ? "text-blue-200" : "text-slate-400"
                        }`}>{msg.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0">
              <form onSubmit={handleProviderReplySubmit} className="max-w-4xl mx-auto flex gap-2.5 items-center">
                <input
                  type="text"
                  placeholder="Type your reply message..."
                  value={typedMessage}
                  onChange={e=>setTypedMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-600 focus:bg-white transition-all text-slate-900"
                />
                <button type="submit" disabled={!typedMessage.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 shadow-sm">
                  <span>Send</span>
                  <Send size={10} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <MessageSquare size={40} className="text-slate-300 stroke-[1.5]" />
            <div className="text-center">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Select a Thread</h4>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Choose a chat row to display communication content records here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}