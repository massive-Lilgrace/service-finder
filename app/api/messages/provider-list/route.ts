import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Fetch conversations and compute total unread message badges
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ success: false, message: "Missing parameter" }, { status: 400 });
    }

    // 1. Fetch conversations matching active store id mapping
    const [threads]: any = await db.execute(
      "SELECT * FROM conversation WHERE providerId = ? ORDER BY updatedAt DESC",
      [providerId]
    );

    // 2. Query sum total of all unread items across this provider's rows
    const [unreadSummary]: any = await db.execute(
      "SELECT SUM(providerUnreadCount) as totalUnread FROM conversation WHERE providerId = ?",
      [providerId]
    );
    const globalUnreadCount = unreadSummary[0]?.totalUnread || 0;

    const formattedThreads = threads.map((thread: any) => ({
      id: thread.id,
      guestName: thread.guestName || "Guest User",
      guestPhone: thread.guestPhone || "",
      lastMessageText: thread.lastMessageText || "No context sent.",
      providerUnreadCount: thread.providerUnreadCount || 0,
      time: thread.updatedAt 
        ? new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "",
    }));

    return NextResponse.json({ 
      success: true, 
      threads: formattedThreads,
      totalUnreadBadge: globalUnreadCount 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Permanently remove an old message thread row item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ success: false, message: "Missing thread target reference id" }, { status: 400 });
    }

    // Delete message history block logs first to clear structural relations
    await db.execute("DELETE FROM message WHERE conversationId = ?", [conversationId]);
    
    // Delete the conversation tracking header summary entry row
    await db.execute("DELETE FROM conversation WHERE id = ?", [conversationId]);

    return NextResponse.json({ success: true, message: "Channel item removed successfully." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}