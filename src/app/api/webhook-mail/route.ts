import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

interface EmailMessage {
  to: string;
  from: string;
  headers: {
    subject: string;
    [key: string]: string;
  };
  text?: string;
  html?: string;
  timestamp?: number;
}

export async function POST(request: Request) {
  try {
    // Verify the request is coming from your Cloudflare Worker
    // You might want to add authentication here

    const message: EmailMessage = await request.json();

    // Validate the message
    if (!message.to || !message.from || !message.headers) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 },
      );
    }

    // Add timestamp
    const emailData: EmailMessage = {
      ...message,
      timestamp: Date.now(),
    };

    // Store in Redis
    // Using the timestamp as a unique identifier in the key
    const key = `email:${emailData.timestamp}`;
    await kv.set(key, emailData);

    // Also maintain an index of emails
    await kv.lpush("emails:index", key);

    // Optional: Trim the index to keep only recent N emails
    await kv.ltrim("emails:index", 0, 999); // Keep last 1000 emails

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
