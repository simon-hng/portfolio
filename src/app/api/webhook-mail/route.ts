import { createClient } from "redis";
import { NextResponse } from "next/server";

// Create Redis client
const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.error("Redis Client Error", err));

  if (!client.isOpen) {
    await client.connect();
  }

  return client;
};

export async function POST(request: Request) {
  let redis;
  try {
    redis = await getRedisClient();

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
    const key = `email:${emailData.timestamp}`;

    // Store the email data as a JSON string
    await redis.set(key, JSON.stringify(emailData));

    // Add to a sorted set for easy retrieval by timestamp
    await redis.zAdd("emails", {
      score: emailData.timestamp,
      value: key,
    });

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
  } finally {
    // Clean up Redis connection
    if (redis) {
      await redis.quit();
    }
  }
}
