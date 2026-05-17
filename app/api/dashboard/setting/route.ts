import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, companyName, category, bio, currentPassword, newPassword } = await request.json();
    
    const connection = await mysql.createConnection({
      host: "localhost", user: "root", password: "", database: "service_finder"
    });

    // 1. If trying to change password, verify old password first
    if (currentPassword && newPassword) {
      const [users]: any = await connection.execute("SELECT password FROM user WHERE email = ?", [email]);
      if (users.length === 0) {
        await connection.end();
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, users[0].password);
      if (!isMatch) {
        await connection.end();
        return NextResponse.json({ success: false, message: "Incorrect current password" }, { status: 400 });
      }
      
      const hashedNew = await bcrypt.hash(newPassword, 10);
      await connection.execute("UPDATE user SET password = ? WHERE email = ?", [hashedNew, email]);
    }

    // 2. Update general profile details
    await connection.execute(
      "UPDATE provider p JOIN user u ON p.userId = u.id SET p.companyName = ?, p.category = ?, p.bio = ? WHERE u.email = ?",
      [companyName, category, bio, email]
    );

    await connection.end();
    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}