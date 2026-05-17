// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Review from "@/models/Review";
import Provider from "@/models/Provider";

// GET Endpoint: Retrieves all localized star ratings and feedback for a given provider
export async function GET(request: Request) {
  try {
    await  db ();

    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get("providerId");

    if (!providerId) {
      return NextResponse.json(
        { error: "Missing tracking criteria. Pass providerId parameter string." },
        { status: 400 }
      );
    }

    // Pull historical entries sorted by recent date submissions
    const reviews = await Review.find({ providerId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews, { status: 200 });

  } catch (error) {
    console.error("Failed querying platform verification feedback review loops:", error);
    return NextResponse.json(
      { error: "Internal Server Error extracting comments stream ledger parameters." },
      { status: 500 }
    );
  }
}

// POST Endpoint: Saves user evaluation score and refreshes merchant metrics dynamically
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { providerId, authorId, authorName, rating, comment } = body;

    // Strict numerical boundary data integrity validation checks
    if (!providerId || !authorId || !authorName || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing structural submission review parameters values." },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating entry must fall strictly between integers scaling across 1-5 stars." },
        { status: 400 }
      );
    }

    // 1. Persist the clean user review block entry down to the database
    const newReview = await Review.create({
      providerId,
      authorId,
      authorName,
      rating: numericRating,
      comment: comment.trim(),
    });

    // 2. Fetch all cumulative ratings metadata files to re-compute aggregate averages
    const allProviderReviews = await Review.find({ providerId });
    const totalReviewsCount = allProviderReviews.length;
    
    const sumOfRatings = allProviderReviews.reduce((sum, item) => sum + item.rating, 0);
    const complexAverageRating = parseFloat((sumOfRatings / totalReviewsCount).toFixed(1));

    // 3. Atomically update the parent structural Provider tracking record
    const updatedMerchantRecord = await Provider.findByIdAndUpdate(
      providerId,
      {
        $set: {
          rating: complexAverageRating,
          reviewCount: totalReviewsCount,
        },
      },
      { new: true }
    );

    if (!updatedMerchantRecord) {
      return NextResponse.json(
        { error: "Target provider account directory link target no longer active." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, reviewId: newReview._id, currentAggregateRating: complexAverageRating },
      { status: 201 }
    );

  } catch (error) {
    console.error("Critical execution breakdown within data review pipeline context:", error);
    return NextResponse.json(
      { error: "Internal Server Error occurred during transaction validation processing." },
      { status: 500 }
    );
  }
}