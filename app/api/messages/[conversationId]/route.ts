import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ conversationId: string }>;
}

// GET Endpoint: Retrieves all chronological text bubbles for an active chat room
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { conversationId } = resolvedParams;

    // 1. Verify parent channel presence inside your singular MySQL conversation table
    const [threads]: any = await db.execute(
      "SELECT * FROM conversation WHERE id = ? LIMIT 1",
      [conversationId]
    );

    if (threads.length === 0) {
      return NextResponse.json(
        { error: "Target conversation thread does not exist inside database ledger." },
        { status: 404 }
      );
    }
    const activeThread = threads[0];

    // 2. Pull historical messages ordered chronologically from your MySQL 'message' table
    const [messages]: any = await db.execute(
      "SELECT * FROM message WHERE conversationId = ? ORDER BY createdAt ASC",
      [conversationId]
    );

    // 3. Map database columns cleanly to match frontend Message interface specifications
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id, // Maps to your string UUID primary key column
      senderId: msg.senderId || (msg.senderType === "guest" ? "guest" : activeThread.providerId),
      senderName: msg.senderType === "guest" ? activeThread.guestName : "Provider",
      text: msg.text,
      createdAt: msg.createdAt 
        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
    }));

    return NextResponse.json(
      {
        success: true,
        messages: formattedMessages,
        meta: {
          id: conversationId,
          guestName: activeThread.guestName,
          providerId: activeThread.providerId,
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Failed to extract dynamic conversation log stream arrays:", error);
    return NextResponse.json(
      { error: "Internal Server Error loading message collection streams.", details: error.message },
      { status: 500 }
    );
  }
}

// POST Endpoint: Transmits a message payload and increments counter fields inside MySQL
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { conversationId } = resolvedParams;

    const body = await request.json();
    const { senderType, text } = body; // senderType should be 'guest' or 'provider'

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Missing required text block or identity data transmission attributes." },
        { status: 400 }
      );
    }

    // 1. Verify existence of target communication room pipeline
    const [threads]: any = await db.execute(
      "SELECT * FROM conversation WHERE id = ? LIMIT 1",
      [conversationId]
    );

    if (threads.length === 0) {
      return NextResponse.json(
        { error: "Target conversation mapping reference channel no longer active." },
        { status: 404 }
      );
    }
    const thread = threads[0];

    // 2. Persist message node record into your MySQL 'message' table using uuid
    const crypto = require("crypto");
    const newMessageId = crypto.randomUUID();

    await db.execute(
      "INSERT INTO message (id, conversationId, senderType, text, createdAt) VALUES (?, ?, ?, ?, NOW())",
      [newMessageId, conversationId, senderType || "provider", text.trim()]
    );

    // 3. Update unread tracking indicators and preview string inside conversation row
    let updateQuery = "UPDATE conversation SET lastMessageText = ?, updatedAt = NOW() WHERE id = ?";
    if (senderType === "guest") {
      updateQuery = "UPDATE conversation SET lastMessageText = ?, providerUnreadCount = providerUnreadCount + 1, updatedAt = NOW() WHERE id = ?";
    }

    await db.execute(updateQuery, [text.trim(), conversationId]);

    // 4. Return formatted data payload ready for instantaneous UI updates
    return NextResponse.json(
      {
        id: newMessageId,
        senderType: senderType || "provider",
        text: text.trim(),
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Critical interrupt processing text bubble database insertion:", error);
    return NextResponse.json(
      { error: "Internal Server Error processing background text serialization.", details: error.message },
      { status: 500 }
    );
  }
}