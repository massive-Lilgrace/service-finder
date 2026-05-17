"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, X, MessageCircle } from "lucide-react";

export default function GuestChatPopup({ providerId, providerName, onClose }: any) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  
  const [messages, setMessages] = useState([]);
  const [typedReply, setTypedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check if this guest already has a saved thread with this specific provider
  useEffect(() => {
    const savedId = localStorage.getItem(`chat_with_${providerId}`);
    if (savedId) {
      setConversationId(savedId);
    }
  }, [providerId]);

  // Long-polling: Automatically check for shop owner replies every 3 seconds
  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/guest-feed?conversationId=${conversationId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages(); // Run instantly
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial Form Submission Handler
  const handleStartInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/messages/guest-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, guestName, guestPhone, initialMessage }),
      });

      const data = await res.json();
      if (data.success) {
        setConversationId(data.conversationId);
        localStorage.setItem(`chat_with_${providerId}`, data.conversationId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Follow-up Reply Handler inside the active popup view
  const handleGuestReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedReply.trim() || !conversationId) return;

    const textToSend = typedReply.trim();
    setTypedReply("");

    try {
      const res = await fetch("/api/messages/guest-feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text: textToSend }),
      });

      if (res.ok) {
        const result = await res.json();
        setMessages((prev) => [...prev, result.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs font-medium text-slate-800 flex flex-col max-h-[500px]">
      {/* Header Panel */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} />
          <span className="font-bold">Chat with {providerName}</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70"><X size={16} /></button>
      </div>

      {/* View Switching Logic */}
      {!conversationId ? (
        /* STEP 1: Form View (Your 2nd Image) */
        <form onSubmit={handleStartInquiry} className="p-4 space-y-3.5 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Your Full Name</label>
            <input type="text" required placeholder="e.g. John Doe" value={guestName} onChange={e=>setGuestName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600 bg-slate-50/50" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Contact Phone Line</label>
            <input type="text" required placeholder="e.g. +234..." value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600 bg-slate-50/50" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Describe Project / Inquiry</label>
            <textarea required rows={3} placeholder="Outline your issue description clearly..." value={initialMessage} onChange={e=>setInitialMessage(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600 bg-slate-50/50 resize-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Send Inquiry"}
          </button>
        </form>
      ) : (
        /* STEP 2: Live Chat Bubble View */
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 min-h-[250px]">
            {messages.map((msg: any) => {
              const isGuest = msg.senderType === "guest";
              return (
                <div key={msg.id} className={`flex w-full ${isGuest ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 border text-[11px] leading-relaxed shadow-sm ${
                    isGuest ? "bg-blue-600 text-white border-blue-600 rounded-br-none" : "bg-white text-slate-800 border-slate-200 rounded-bl-none"
                  }`}>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    <span className={`block text-[7px] text-right mt-0.5 ${isGuest ? "text-blue-200" : "text-slate-400"}`}>{msg.time}</span>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleGuestReplySubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input type="text" placeholder="Type follow-up reply..." value={typedReply} onChange={e=>setTypedReply(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-600 text-[11px]" />
            <button type="submit" disabled={!typedReply.trim()} className="bg-blue-600 text-white p-2 rounded-xl disabled:bg-slate-100 disabled:text-slate-400 transition"><Send size={12} /></button>
          </form>
        </>
      )}
    </div>
  );
}