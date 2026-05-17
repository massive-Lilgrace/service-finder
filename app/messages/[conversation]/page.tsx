// app/messages/[conversationId]/page.tsx
"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface ConversationActive {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "provider" | "customer";
  businessName?: string;
}

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ChatConversationPage({ params }: PageProps) {
  // Safe extraction of async parameter wrapper
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;

  // Mock global user state simulation (Replace with your useAuth hook data)
  const currentUserId = "user_customer_99"; 

  // Functional Interface Layout States
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatMeta, setChatMeta] = useState<ConversationActive | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll down mechanism on text array shift adjustments
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Data Fetch Simulating socket connection pipeline / API route
  useEffect(() => {
    const loadChatContext = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/messages/${conversationId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
          setChatMeta(data.meta);
        } else {
          generateMockChatLogs();
        }
      } catch (error) {
        console.error("Chat data layer network failure:", error);
        generateMockChatLogs();
      } finally {
        setIsLoading(false);
      }
    };

    loadChatContext();
  }, [conversationId]);

  const generateMockChatLogs = () => {
    // Populate header details matching provider context wireframe layout modules
    setChatMeta({
      id: conversationId,
      participantName: "Chidi Obi",
      participantAvatar: "unsplash.com",
      participantRole: "provider",
      businessName: "QuickFix Plumbing Services",
    });

    // Populate default text message bubbles
    setMessages([
      {
        id: "m1",
        senderId: "user_provider_01",
        senderName: "Chidi Obi",
        text: "Hello! Thank you for reaching out to QuickFix Plumbing. How can I help you today?",
        createdAt: "10:30 AM",
      },
      {
        id: "m2",
        senderId: "user_customer_99",
        senderName: "Client Profile",
        text: "Hi, I have a leaking pipe under my kitchen sink. Are you available for a service call this afternoon?",
        createdAt: "10:32 AM",
      },
      {
        id: "m3",
        senderId: "user_provider_01",
        senderName: "Chidi Obi",
        text: "Yes, I can dispatch an expert to your location by 2:00 PM. Our base service call out fee is ₦5,000.",
        createdAt: "10:35 AM",
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const temporaryPayload: Message = {
      id: `msg_temp_${Date.now()}`,
      senderId: currentUserId,
      senderName: "Client Profile",
      text: newMessage.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic UI state text array update
    setMessages((prev) => [...prev, temporaryPayload]);
    setNewMessage("");

    try {
      // POST network action pipeline back into app/api/messages/[conversationId]/route.ts
      await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: temporaryPayload.text }),
      });
    } catch (err) {
      console.error("Failed to sync structural node sequence tracking payload:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">Opening conversation secure link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100 flex flex-col">
      {/* Top Contact Context Header Wrapper */}
      {chatMeta && (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3.5">
            <Link href="/dashboard/provider/messages" className="text-gray-400 hover:text-gray-600 lg:hidden p-1">
              ⬅️
            </Link>
            <div className="w-10 h-10 rounded-full bg-blue-100 relative overflow-hidden border border-gray-100">
              <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-700 text-sm">
                {chatMeta.participantName.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 leading-tight">{chatMeta.participantName}</h2>
              {chatMeta.businessName ? (
                <Link href={`/providers`} className="text-xs text-blue-600 hover:underline font-medium block mt-0.5">
                  {chatMeta.businessName}
                </Link>
              ) : (
                <span className="text-xs text-gray-400 capitalize">{chatMeta.participantRole}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/providers" 
              className="text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Exit Studio
            </Link>
          </div>
        </div>
      )}

      {/* Main Continuous Chat Viewport Frame */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                isMe 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}>
                {!isMe && (
                  <p className="text-[10px] font-bold tracking-wide text-blue-600 uppercase mb-0.5">
                    {msg.senderName}
                  </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                <span className={`block text-[9px] mt-1.5 text-right font-medium ${
                  isMe ? "text-blue-200" : "text-gray-400"
                }`}>
                  {msg.createdAt}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Submission Bar */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-3 items-center">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-lg"
            title="Attach visual project file documentation"
          >
            📎
          </button>
          <input
            type="text"
            placeholder="Type a message or describe your project service inquiry..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm flex-shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}