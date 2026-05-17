import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// GET: Let guests fetch their active thread chat bubbles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, message: "Missing conversationId" }, { status: 400 });
    }

    const [messages]: any = await db.execute(
      "SELECT * FROM message WHERE conversationId = ? ORDER BY createdAt ASC",
      [conversationId]
    );

    const formatted = messages.map((msg: any) => ({
      id: msg.id,
      senderType: msg.senderType === "guent" ? "guest" : msg.senderType,
      text: msg.text,
      time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    }));

    return NextResponse.json({ success: true, messages: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Let guests send additional replies inside their open pop-up window
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, text } = body;

    if (!conversationId || !text.trim()) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newMessageId = uuidv4();
    await db.execute(
      "INSERT INTO message (id, conversationId, senderType, text) VALUES (?, ?, 'guest', ?)",
      [newMessageId, conversationId, text.trim()]
    );

    await db.execute(
      "UPDATE conversation SET lastMessageText = ?, providerUnreadCount = providerUnreadCount + 1, updatedAt = NOW() WHERE id = ?",
      [text.trim(), conversationId]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: newMessageId,
        senderType: "guest",
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}