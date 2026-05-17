import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(request: Request) {
  try {
    const { email, photoUrl } = await request.json();

    const connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "service_finder"
    });

    const [profiles]: any = await connection.execute(
      "SELECT p.id FROM provider p JOIN user u ON p.userId = u.id WHERE u.email = ?",
      [email]
    );

    await connection.execute(
      "INSERT INTO provider_photos (providerId, photoUrl) VALUES (?, ?)",
      [profiles[0].id, photoUrl]
    );

    await connection.end();
    return NextResponse.json({ success: true, message: "Photo added successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}