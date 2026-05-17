// app/api/reviews/provider-list/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json({ success: false, message: "Missing providerId parameter token." }, { status: 400 });
    }

    // 1. Fetch individual review items sorted by most recent date submissions
    const [reviews]: any = await db.execute(
      "SELECT * FROM review WHERE providerId = ? ORDER BY createdAt DESC",
      [providerId]
    );

    // 2. Initialize rating scale metric buckets
    let fiveStars = 0, fourStars = 0, threeStars = 0, twoStars = 0, oneStars = 0;

    reviews.forEach((rev: any) => {
      if (rev.rating === 5) fiveStars++;
      else if (rev.rating === 4) fourStars++;
      else if (rev.rating === 3) threeStars++;
      else if (rev.rating === 2) twoStars++;
      else if (rev.rating === 1) oneStars++;
    });

    const formattedReviews = reviews.map((rev: any) => ({
      id: rev.id,
      authorName: rev.authorName,
      rating: rev.rating,
      comment: rev.comment,
      time: rev.createdAt 
        ? new Date(rev.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })
        : ""
    }));

    return NextResponse.json({
      success: true,
      reviews: formattedReviews,
      breakdown: { fiveStars, fourStars, threeStars, twoStars, oneStars }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Failed executing provider reviews list lookup:", error);
    return NextResponse.json({ success: false, message: "Internal server error reading evaluation logs." }, { status: 500 });
  }
}