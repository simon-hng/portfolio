import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log(
      "Incoming request headers:",
      Object.fromEntries(request.headers),
    );
    const clonedRequest = request.clone();
    const rawBody = await clonedRequest.text();
    console.log("Raw request body:", rawBody);
    // Verify the request is coming from your Cloudflare Worker
    // You might want to add authentication here

    let message;
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      message = await request.json();
    } else {
      const text = await request.text();
      try {
        message = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse message:", text);
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 },
        );
      }
    }

    // Validate the message structure
    if (!message || typeof message !== "object") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

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
