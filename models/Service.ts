// models/Service.ts
import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);