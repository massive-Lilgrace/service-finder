import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, companyName, category, address, bio, price, avatarurl } = await request.json();

    // 1. Validate mandatory fields
    if (!email || !password || !companyName || !category) {
      return NextResponse.json({ success: false, message: "Missing required onboarding fields" }, { status: 400 });
    }

    // 2. Open single connection pool profile
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "service_finder",
    });

    // 3. Verify unique email inside the provider table directly
    const [existingProviders]: any = await connection.execute(
      "SELECT id FROM provider WHERE email = ?",
      [email]
    );

    if (existingProviders.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: "Email address already registered" }, { status: 400 });
    }

    // 4. Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save all parameters directly into the single 'provider' table structure
    await connection.execute(
      "INSERT INTO provider (email, password, companyName, category, address, bio, price, avatarurl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email, 
        hashedPassword, 
        companyName, 
        category, 
        address || "Lagos, Nigeria", 
        bio || "", 
        price || "0", 
        avatarurl || ""
      ]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: "Merchant profile registered successfully!" 
    });

  } catch (error: any) {
    console.error("Provider Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query execution failed", error: error.message },
      { status: 500 }
    );
  }
}