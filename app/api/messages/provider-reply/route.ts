import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, text } = body;

    if (!conversationId || !text.trim()) {
      return NextResponse.json({ success: false, message: "Missing required payload parameters." }, { status: 400 });
    }

    // 1. Persist the reply message node row log
    const newMessageId = uuidv4();
    await db.execute(
      "INSERT INTO message (id, conversationId, senderType, text) VALUES (?, ?, 'provider', ?)",
      [newMessageId, conversationId, text.trim()]
    );

    // 2. Synchronize conversation tracking summary block indicators
    await db.execute(
      "UPDATE conversation SET lastMessageText = ?, providerUnreadCount = 0, updatedAt = NOW() WHERE id = ?",
      [text.trim(), conversationId]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: newMessageId,
        senderType: "provider",
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Reply transaction insertion loop exception:", error);
    return NextResponse.json({ success: false, message: "Database execution failed.", error: error.message }, { status: 500 });
  }
}