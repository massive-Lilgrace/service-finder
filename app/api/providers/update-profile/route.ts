// app/api/providers/update-profile/route.ts
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "service_finder", 
};

export async function POST(request: Request) {
  let connection;
  try {
    const formData = await request.formData();
    
    // Capture values matching your registered business profile inputs
    const providerId = formData.get("providerId") || "1"; 
    const businessName = formData.get("businessName") as string;
    const hotlinePhone = formData.get("hotlinePhone") as string;
    const address = formData.get("address") as string;
    const biography = formData.get("biography") as string;
    const file = formData.get("logoFile") as File | null;

    connection = await mysql.createConnection(dbConfig);
    let logoUrl = null;

    // Handle physical logo asset saves to your machine hard-drive storage disk
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = path.extname(file.name) || ".png";
      const fileName = `provider-${providerId}-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      logoUrl = `/uploads/logos/${fileName}`;
    }

    // UPDATE EXECUTIONS: Changes row parameters inside your XAMPP 'provider' table directly
    if (logoUrl) {
      await connection.execute(
        `UPDATE provider 
         SET companyName = ?, hotline_phone = ?, address = ?, biography = ?, logo_url = ? 
         WHERE id = ?`,
        [businessName, hotlinePhone, address, biography, logoUrl, providerId]
      );
    } else {
      await connection.execute(
        `UPDATE provider 
         SET companyName = ?, hotline_phone = ?, address = ?, biography = ? 
         WHERE id = ?`,
        [businessName, hotlinePhone, address, biography, providerId]
      );
    }

    return NextResponse.json({ success: true, message: "Registered shop profile updated successfully." });

  } catch (error: any) {
    console.error("XAMPP Registered Shop Core Failure:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}