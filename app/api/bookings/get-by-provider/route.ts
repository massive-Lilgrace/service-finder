// app/api/bookings/get-by-provider/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "service_finder", // Replace with your exact XAMPP DB folder name
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ success: false, message: "Missing providerId" }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Select entries belonging to this provider, newest first
    const [rows] = await connection.execute(
      "SELECT * FROM bookings WHERE provider_id = ? ORDER BY id DESC",
      [providerId]
    );

    await connection.end();

    return NextResponse.json({ success: true, bookings: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}