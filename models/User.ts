import mongoose, { Schema, model, models } from 'mongoose';

// This defines the structure of a User in your database
const UserSchema = new Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'] 
    },
    email: { 
      type: String, 
      unique: true, 
      required: [true, 'Email is required'] 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
    image: { 
      type: String, 
      default: '' 
    },
    role: { 
      type: String, 
      enum: ['customer', 'provider', 'admin'], 
      default: 'customer' 
    },
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' automatically
);

// This line checks if the 'User' model already exists (to prevent errors in Next.js)
const User = models.User || model('User', UserSchema);

export default User;