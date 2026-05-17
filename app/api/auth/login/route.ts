// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db"; 

const JWT_SECRET = process.env.JWT_SECRET || "fallback_system_node_secret_key_threshold_99";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill out both email and password fields." },
        { status: 400 }
      );
    }

    let rows: any = null;

    // Execute query safely matching your specific MySQL engine type
    try {
      const result = await (db as any).query("SELECT * FROM provider WHERE LOWER(email) = ?", [email.toLowerCase().trim()]);
      // If your pool returns [rows, fields] structure
      rows = Array.isArray(result[0]) ? result[0] : result;
    } catch (queryErr) {
      // Fallback for callback-based structures
      rows = await new Promise((resolve, reject) => {
        (db as any).query("SELECT * FROM provider WHERE LOWER(email) = ?", [email.toLowerCase().trim()], (err: any, results: any) => {
          if (err) return reject(err);
          resolve(Array.isArray(results) ? results : []);
        });
      });
    }
    
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No registered store account found matching that email address." },
        { status: 401 }
      );
    }

    // Select first record match
    const providerAccount = rows[0];

    // Match password credentials securely using bcryptjs
    const dbPasswordHash = providerAccount.password || providerAccount.pass || providerAccount.storePassword || "";
    const isPasswordValid = await bcrypt.compare(password, dbPasswordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect password credentials entered. Please try again." },
        { status: 401 }
      );
    }

    // Capture your business/store name field string dynamically from your column data
    const storeIdentity = 
      providerAccount.businessName || 
      providerAccount.storeName || 
      providerAccount.name || 
      providerAccount.fullName || 
      "My Provider Store";

    // Sign JWT access token structure
    const sessionToken = jwt.sign(
      { id: providerAccount.id, email: email, role: "provider" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Output clean verified session JSON state payload
    const response = NextResponse.json({
      success: true,
      role: "provider", 
      user: { 
        id: providerAccount.id, 
        businessName: storeIdentity, 
        email: email 
      },
    });

    // Inject secure cookie header context inside client web browser
    response.cookies.set({
      name: "auth_session_token",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Database error details:", error);
    return NextResponse.json(
      { success: false, error: `Database Transaction Error: ${error.message || "Failed to complete transaction."}` },
      { status: 500 }
    );
  }
}