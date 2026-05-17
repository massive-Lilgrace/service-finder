import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    // Connect directly to local XAMPP MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "service_finder",
    });

    // Fetch all columns directly without strict constraints to get it working
    const [providers]: any = await connection.execute("SELECT * FROM provider");

    await connection.end();

    return NextResponse.json({ success: true, data: providers });
  } catch (error: any) {
    console.error("SQL Search Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query failed", error: error.message },
      { status: 500 }
    );
  }
}