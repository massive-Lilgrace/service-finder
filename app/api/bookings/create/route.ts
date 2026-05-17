import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",     
  password: "",     
  database: "service_finder",
};

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const { 
      providerId, 
      fullName, 
      email, 
      phone, 
      bookingDate, 
      preferredTime, 
      address, 
      description 
    } = body;

    if (!providerId || !fullName || !email || !phone || !bookingDate || !preferredTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Bulletproof Query: Removes explicit 'status' column in case it's not created yet
    const sqlQuery = `
      INSERT INTO bookings (provider_id, full_name, email, phone, booking_date, preferred_time, address, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await connection.execute(sqlQuery, [
      providerId,
      fullName,
      email, 
      phone,
      bookingDate,
      preferredTime,
      address,
      description
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Booking requested logged into XAMPP successfully." 
    });

  } catch (error: any) {
    console.error("CRITICAL BACKEND CRASH:", error.message);
    // FORCE a JSON response even if the database fails completely
    return NextResponse.json(
      { success: false, message: `Server/Database error: ${error.message}` },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}