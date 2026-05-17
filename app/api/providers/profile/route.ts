import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "";

    if (!email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "service_finder",
    });

    // Fetch the active provider business information tied to this user account email
    const [profiles]: any = await connection.execute(
      "SELECT p.*, u.email, u.role FROM provider p JOIN user u ON p.userId = u.id WHERE u.email = ?",
      [email]
    );

    if (profiles.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    const providerProfile = profiles[0];
    await connection.end();

    return NextResponse.json({
      success: true,
      profile: providerProfile,
      bookingsCount: 0, // Fallback counters until transactional rows are added
      totalEarnings: 0
    });

  } catch (error: any) {
    console.error("Dashboard API Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}