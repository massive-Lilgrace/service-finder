// models/Conversation.ts
import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    providerUserId: { type: String, required: true },
    lastMessageText: { type: String, default: "" },
    customerUnreadCount: { type: Number, default: 0 },
    providerUnreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Form compound index to accelerate historical tracking queries
ConversationSchema.index({ customerId: 1, providerUserId: 1 }, { unique: true });

export default mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);