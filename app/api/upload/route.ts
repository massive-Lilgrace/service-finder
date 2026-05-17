// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // FIXED: Now checks all 3 critical credentials, including the API secret
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing critical Cloudinary environment variables in .env.local");
      return NextResponse.json(
        { success: false, error: "Storage server is missing configuration keys (Cloud Name, API Key, or API Secret)." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image payload binary located inside request form body data." },
        { status: 400 }
      );
    }

    // Convert file data stream into an array buffer web API structure safely
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Stream transformation pipeline to pass bytes toward third-party Cloudinary instance nodes
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "servifind_assets",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary provider connection failure:", error);
            return reject(error);
          }
          resolve(result);
        }
      ).end(buffer);
    });

    // Return the cloud hosted URL back to your frontend image picker state
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

  } catch (error: any) {
    console.error("Fatal asset pipeline routing failure exception trace:", error);
    
    // FIXED: Instead of hiding the error behind a generic string, surface the real message 
    // so you can see exactly why Cloudinary rejected the image request.
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error occurred during asset pipeline routing." },
      { status: 500 }
    );
  }
}