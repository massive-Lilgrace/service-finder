import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "service_finder", 
};

export async function GET(request: Request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "1";

    connection = await mysql.createConnection(dbConfig);
    
    // Select all five required profile fields from XAMPP MySQL
    const [rows]: any = await connection.execute(
      "SELECT companyName, hotline_phone, address, biography, logo_url FROM provider WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows && rows.length > 0) {
      const businessAccount = rows[0]; 
      return NextResponse.json({ 
        success: true, 
        businessName: businessAccount.companyName || "",
        hotlinePhone: businessAccount.hotline_phone || "",
        address: businessAccount.address || "",
        biography: businessAccount.biography || "",
        logoUrl: businessAccount.logo_url || ""
      });
    } else {
      return NextResponse.json({ success: false, message: "Store entry not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Storefront lookup failure details:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}