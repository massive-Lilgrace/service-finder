// types/review.ts

export interface Review {
  id: string;
  providerId: string; // Points directly to target Provider schema instance nodes
  authorId: string;   // Refers to customer account data node making insertion
  authorName: string;
  rating: number;     // Constrained system standard integers scaling across 1-5 stars
  comment: string;
  createdAt: string;
}

export interface ReviewSummaryMetrics {
  averageRating: number;
  totalReviewsCount: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
}