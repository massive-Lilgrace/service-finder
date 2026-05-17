// hooks/useMessages.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export function useMessages(conversationId: string, activeUserId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bind reactive websocket data pipelines straight into hook logic
  const { socket, isConnected } = useSocket(conversationId);

  const loadChatLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (!response.ok) throw new Error("Conversation path context invalid or missing.");
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message || "Failed retrieving context threads.");
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadChatLogs();
  }, [loadChatLogs]);

  // Real-time network stream listener append sequence
  useEffect(() => {
    if (!socket) return;

    socket.on("message:received", (incomingMessage: ChatMessage) => {
      // Prevent echoing double records onto the client UI state arrays
      if (incomingMessage.senderId !== activeUserId) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    });

    return () => {
      socket.off("message:received");
    };
  }, [socket, activeUserId]);

  const sendMessagePayload = async (text: string) => {
    if (!text.trim()) return;

    const transientBubble: ChatMessage = {
      id: `msg_local_temp_${Date.now()}`,
      senderId: activeUserId,
      senderName: "Me",
      text: text.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Fast UI state optimization step
    setMessages((prev) => [...prev, transientBubble]);

    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) throw new Error("Message persistence rejected.");
      const verifiedSavedMessage = await response.json();

      // Emit live broadcast stream over the websocket pipeline network cluster
      if (socket && isConnected) {
        socket.emit("message:send", { roomId: conversationId, message: verifiedSavedMessage });
      }
    } catch (err) {
      console.error("Message sync dropped down edge channel boundary:", err);
    }
  };

  return { messages, isLoading, error, sendMessage: sendMessagePayload, isLive: isConnected };
}