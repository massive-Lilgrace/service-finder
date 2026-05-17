// types/provider.ts

export type TradeCategory = 

  | "Plumbing" 
  | "Electrical" 
  | "Cleaning" 

  | "AC Repair" 
  | "Carpentry" 
  | "Painting";

export interface Provider {
  id: string;
  userId: string; // References the underlying base User.ts object entry
  businessName: string;
  category: TradeCategory;
  phone: string;
  address: string;
  city: string;
  state: string;
  biography: string;
  avatarUrl: string;
  serviceCallPrice: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  specialties: string[];
  galleryImages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCatalogItem {
  id: string;
  businessName: string;
  category: TradeCategory;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string; // Client-side context dynamic geo-distance string calculation 
  serviceCallPrice: number;
  isVerified: boolean;
  avatarUrl: string;
  specialties: string[];
}