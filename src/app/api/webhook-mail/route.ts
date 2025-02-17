import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Verify the request is coming from your Cloudflare Worker
    // You might want to add authentication here

    const message = await request.json();

    // Add timestamp
    const emailData = {
      ...message,
      timestamp: Date.now(),
    };

    // Store in Redis
    // Using the timestamp as a unique identifier in the key
    const key = `email:${emailData.timestamp}`;
    await kv.set(key, emailData);

    return NextResponse.json(
      { message: "Email stored successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
