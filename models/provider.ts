import mongoose, { Schema, model, models } from 'mongoose';

const ProviderSchema = new Schema(
  {
    // This connects the Provider profile to their main User account
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    businessName: { 
      type: String, 
      required: [true, 'Business name is required'] 
    },
    category: { 
      type: String, 
      required: [true, 'Please select a category'] 
    },
    bio: { 
      type: String 
    },
    location: {
      address: String,
      city: String,
    },
    price: { 
      type: Number, 
      default: 0 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    rating: { 
      type: Number, 
      default: 0 
    },
    reviewCount: { 
      type: Number, 
      default: 0 
    },
    gallery: [{ type: String }], // Array of image URLs from Cloudinary
  },
  { timestamps: true }
);

const Provider = models.Provider || model('Provider', ProviderSchema);

export default Provider;