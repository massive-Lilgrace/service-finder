import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = params.id;

    // Connect directly to local XAMPP MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "service_finder",
    });

    // Fetch the specific provider profile record matching the ID
    const [providers]: any = await connection.execute(
      "SELECT * FROM provider WHERE id = ?",
      [providerId]
    );

    if (providers.length === 0) {
      await connection.end();
      return NextResponse.json({ success: false, message: "Provider not found" }, { status: 404 });
    }

    const provider = providers[0];

    // Fetch all connected services offered by this specific provider profile
    const [services] = await connection.execute(
      "SELECT * FROM service WHERE providerId = ?",
      [providerId]
    );

    provider.services = services;

    await connection.end();

    return NextResponse.json({ success: true, provider });

  } catch (error: any) {
    console.error("Provider Profile Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Database query failed", error: error.message },
      { status: 500 }
    );
  }
}