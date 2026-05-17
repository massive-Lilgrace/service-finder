import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

async function getDbConnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "service_finder",
  });
}

// GET Endpoint: Retrieves chat list matching your active database columns
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // This is your providerid (e.g., '1')

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication parameter missing. Pass active userId." },
        { status: 400 }
      );
    }

    const connection = await getDbConnection();

    // Querying your exact singular table name 'conversation'
    const [threads]: any = await connection.execute(
      "SELECT * FROM conversation WHERE providerid = ? ORDER BY updatedAt DESC",
      [userId]
    );

    const threadSummaries = threads.map((thread: any) => {
      return {
        id: thread.id, // Maps to your string UUID 'id' column
        participantName: thread.guestName || "Guest Client", // Maps to guestName
        businessName: "Inbound Inquiry",
        lastMessageText: thread.lastMessageText || "No text transmitted yet.",
        lastMessageTimestamp: thread.updatedAt 
          ? new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        unreadCount: thread.providerUnreadCount || 0, // Maps to providerUnreadCount
      };
    });

    await connection.end();
    return NextResponse.json(threadSummaries, { status: 200 });

  } catch (error: any) {
    console.error("Failed to fetch historical chat summaries:", error);
    return NextResponse.json(
      { error: "Internal Server Error extracting communication records.", details: error.message },
      { status: 500 }
    );
  }
}

// POST Endpoint: Creates a new chat row matching your exact schema layout
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { providerid, guestName, guestPhone, lastMessageText } = body;

    if (!providerid || !guestName) {
      return NextResponse.json(
        { error: "Missing required initialization fields payload attributes." },
        { status: 400 }
      );
    }

    const crypto = require("crypto");
    const newUuid = crypto.randomUUID(); // Generates the string UUID style ID your table uses

    const connection = await getDbConnection();

    // Insert using your exact singular 'conversation' table and column keys
    await connection.execute(
      "INSERT INTO conversation (id, providerid, guestName, guestPhone, lastMessageText, providerUnreadCount, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())",
      [newUuid, providerid, guestName, guestPhone || "", lastMessageText || ""]
    );

    await connection.end();

    return NextResponse.json({ success: true, conversationId: newUuid, isNew: true }, { status: 201 });

  } catch (error: any) {
    console.error("Failed creating new channel entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error processing initialization sequence request.", details: error.message },
      { status: 500 }
    );
  }
}