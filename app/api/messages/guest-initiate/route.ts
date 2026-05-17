// app/api/messages/guest-initiate/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerId, guestName, guestPhone, initialMessage } = body;

    if (!providerId || !guestName || !guestPhone || !initialMessage.trim()) {
      return NextResponse.json({ success: false, message: "Missing tracking input data fields." }, { status: 400 });
    }

    // 1. Check if an active thread channel link already exists for this guest phone number
    const [existing]: any = await db.execute(
      "SELECT id FROM conversation WHERE providerId = ? AND guestPhone = ? LIMIT 1",
      [providerId, guestPhone.trim()]
    );

    let conversationId = "";

    if (existing.length > 0) {
      conversationId = existing[0].id;
      // Update thread timestamp and message preview parameters
      await db.execute(
        "UPDATE conversation SET lastMessageText = ?, providerUnreadCount = providerUnreadCount + 1 WHERE id = ?",
        [initialMessage.trim(), conversationId]
      );
    } else {
      // Create a brand new workspace channel link ID string parameters
      conversationId = uuidv4();
      await db.execute(
        "INSERT INTO conversation (id, providerId, guestName, guestPhone, lastMessageText, providerUnreadCount) VALUES (?, ?, ?, ?, ?, 1)",
        [conversationId, providerId, guestName.trim(), guestPhone.trim(), initialMessage.trim()]
      );
    }

    // 2. Append message row payload straight down into messages table dataset
    const messageId = uuidv4();
    await db.execute(
      "INSERT INTO message (id, conversationId, senderType, text) VALUES (?, ?, 'guest', ?)",
      [messageId, conversationId, initialMessage.trim()]
    );

    return NextResponse.json({ success: true, conversationId }, { status: 201 });

  } catch (error: any) {
    console.error("Guest communication flow routing critical exception trace:", error);
    return NextResponse.json({ success: false, message: "Database insertion processing error loop." }, { status: 500 });
  }
}