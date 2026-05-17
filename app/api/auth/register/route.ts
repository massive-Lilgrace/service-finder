import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs"; // Install via 'npm install bcryptjs' if missing

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "service_finder",
    });

    // Check if user already exists
    const [existingUsers]: any = await connection.execute(
      "SELECT id FROM user WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const [result]: any = await connection.execute(
      "INSERT INTO user (email, password, role) VALUES (?, ?, ?)",
      [email, hashedPassword, "user"]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: "User registered successfully", 
      userId: result.insertId 
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query failed", error: error.message },
      { status: 500 }
    );
  }
}