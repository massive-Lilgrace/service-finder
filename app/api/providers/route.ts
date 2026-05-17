// app/api/providers/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const query = searchParams.get("query");

    // FIXED: Maps your exact phpMyAdmin database columns to match frontend expectations
    let sqlQuery = `
      SELECT 
        id, 
        companyName AS storeName, 
        category, 
        bio AS description, 
        address AS city, 
        avatarUrl,
        1 AS verified,
        5.0 AS rating
      FROM provider 
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    // Filter by specific industry choice selection
    if (category && category !== "All Categories") {
      sqlQuery += " AND category = ?";
      queryParams.push(category);
    }

    // Filter by geographic area substring using your real address column
    if (location && location.trim() !== "") {
      sqlQuery += " AND address LIKE ?";
      queryParams.push(`%${location.trim()}%`);
    }

    // Filter by search bar query typing using your real column keys
    if (query && query.trim() !== "") {
      sqlQuery += " AND (companyName LIKE ? OR bio LIKE ?)";
      const wildCardQuery = `%${query.trim()}%`;
      queryParams.push(wildCardQuery, wildCardQuery);
    }

    // Sort to prioritize latest registered profiles
    sqlQuery += " ORDER BY id DESC";

    const [rows]: any = await db.execute(sqlQuery, queryParams);

    return NextResponse.json({ success: true, providers: rows }, { status: 200 });

  } catch (error: any) {
    console.error("Marketplace fetch error trace:", error);
    return NextResponse.json({ success: false, providers: [], error: error.message }, { status: 500 });
  }
}