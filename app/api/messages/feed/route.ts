import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, message: "Missing conversationId parameter." }, { status: 400 });
    }

    // Pull historical message entries ordered from oldest to newest
    const [messages]: any = await db.execute(
      "SELECT * FROM message WHERE conversationId = ? ORDER BY createdAt ASC",
      [conversationId]
    );

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      senderType: msg.senderType === "guent" ? "guest" : msg.senderType, // Handles 'guent' typo protection safely
      text: msg.text,
      time: msg.createdAt 
        ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
    }));

    return NextResponse.json({ success: true, messages: formattedMessages }, { status: 200 });

  } catch (error: any) {
    console.error("Text bubble load trace error:", error);
    return NextResponse.json({ success: false, message: "Failed extracting logs.", error: error.message }, { status: 500 });
  }
}