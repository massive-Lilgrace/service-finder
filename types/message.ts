// types/message.ts

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "customer" | "provider";
  businessName?: string; // Optional metadata link populated for vendor targets
  lastMessageText?: string;
  lastMessageTimestamp?: string;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatChannelMetadata {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "customer" | "provider";
  businessName?: string;
}

export interface SocketMessagePayload {
  roomId: string;
  message: Message;
}