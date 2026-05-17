import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Fetch chat logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const convId = searchParams.get("conversationId");

    const connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "service_finder"
    });

    const [messages] = await connection.execute(
      "SELECT m.*, u.email FROM message m JOIN user u ON m.senderId = u.id WHERE m.conversationId = ? ORDER BY m.createdAt ASC",
      [convId]
    );

    await connection.end();
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Post a new chat bubble message 
export async function POST(request: Request) {
  try {
    const { conversationId, senderEmail, text } = await request.json();

    const connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "service_finder"
    });

    const [users]: any = await connection.execute("SELECT id FROM user WHERE email = ?", [senderEmail]);
    const senderId = users[0].id;

    await connection.execute(
      "INSERT INTO message (conversationId, senderId, text) VALUES (?, ?, ?)",
      [conversationId, senderId, text]
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}