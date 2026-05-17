// app/api/auth/setup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const queryHandler = typeof db.query === "function" ? db.query.bind(db) : (db as any).pool?.query.bind((db as any).pool);
    
    if (!queryHandler) {
      throw new Error("Database client pool not found.");
    }

    const runSQL = (sql: string) => {
      return new Promise((resolve, reject) => {
        queryHandler(sql, [], (err: any, res: any) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
    };

    // 1. Recreate the core operational system tables
    await runSQL(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        providerId INT,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        price VARCHAR(100),
        slug VARCHAR(255)
      )
    `);

    await runSQL(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client VARCHAR(255) NOT NULL,
        job VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        time VARCHAR(100),
        status VARCHAR(100) DEFAULT 'Pending',
        statusBg VARCHAR(100) DEFAULT 'bg-amber-50 text-amber-700'
      )
    `);

    // 2. Clear out old empty indicators and insert fresh sample data rows for your Dashboard metrics
    await runSQL("DELETE FROM services");
    await runSQL("DELETE FROM bookings");

    // Seed Marketplace Service Categories matching your Hero UI options
    await runSQL("INSERT INTO services (name, category, price, slug) VALUES ('Pipe Installation', 'Plumbing', '$150', 'plumbing')");
    await runSQL("INSERT INTO services (name, category, price, slug) VALUES ('Leak Repair', 'Plumbing', '$80', 'plumbing')");
    await runSQL("INSERT INTO services (name, category, price, slug) VALUES ('AC Maintenance', 'AC Repair', '$120', 'ac-repair')");
    await runSQL("INSERT INTO services (name, category, price, slug) VALUES ('Full Home Cleaning', 'Cleaning', '$200', 'cleaning')");

    // Seed Recent Bookings rows to populate your Dashboard feed table
    await runSQL("INSERT INTO bookings (client, job, date, time, status, statusBg) VALUES ('Mike Johnson', 'Pipe Installation', 'May 20, 2026', '10:00 AM', 'Confirmed', 'bg-emerald-50 text-emerald-700')");
    await runSQL("INSERT INTO bookings (client, job, date, time, status, statusBg) VALUES ('Sarah Williams', 'Leak Repair', 'May 22, 2026', '2:30 PM', 'Pending', 'bg-amber-50 text-amber-700')");
    await runSQL("INSERT INTO bookings (client, job, date, time, status, statusBg) VALUES ('David Brown', 'Bathroom Fitting', 'May 25, 2026', '11:00 AM', 'Completed', 'bg-slate-100 text-slate-700')");

    // 3. Ensure Christopher login profile exists in provider table
    const hashedPass = await bcrypt.hash("password123", 10);
    await runSQL("DELETE FROM provider WHERE email = 'christopheren142c@gmail.com'");
    await runSQL("INSERT INTO provider (email, password, businessName) VALUES ('christopheren142c@gmail.com', '" + hashedPass + "', 'ServiFind Plumbing & Tech')");

    return NextResponse.json({ 
      success: true, 
      message: "Database tables fully restored! Marketplace and Dashboard data grids are populated." 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}