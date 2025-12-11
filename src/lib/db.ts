"use client";

import type { Presence, GuestbookEntry, CanvasPixel, Visitor } from "./electric";

// Supabase API configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Helper for Supabase REST API calls
async function supabaseRest<T>(
  table: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  options?: {
    body?: Record<string, unknown>;
    query?: string;
    upsert?: boolean;
  }
): Promise<T | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase not configured");
    return null;
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (options?.query) {
    url.search = options.query;
  }

  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };

  if (options?.upsert) {
    headers["Prefer"] = "resolution=merge-duplicates";
  }
  if (method === "POST" || method === "PATCH") {
    headers["Prefer"] = headers["Prefer"]
      ? `${headers["Prefer"]},return=representation`
      : "return=representation";
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase error: ${error}`);
  }

  if (method === "DELETE") return null;
  return response.json();
}

// API functions for mutations
export async function upsertPresence(presence: Omit<Presence, "last_seen">) {
  const data = {
    ...presence,
    last_seen: new Date().toISOString(),
  };

  await supabaseRest<Presence>("presence", "POST", {
    body: data,
    upsert: true,
  });
}

export async function removePresence(sessionId: string) {
  await supabaseRest<Presence>("presence", "DELETE", {
    query: `session_id=eq.${sessionId}`,
  });
}

export async function addGuestbookEntry(entry: Omit<GuestbookEntry, "id" | "created_at">) {
  const data = {
    ...entry,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  await supabaseRest<GuestbookEntry>("guestbook", "POST", {
    body: data,
  });

  return data;
}

export async function updateCanvasPixel(pixel: Omit<CanvasPixel, "updated_at">) {
  const data = {
    ...pixel,
    updated_at: new Date().toISOString(),
  };

  await supabaseRest<CanvasPixel>("canvas_pixels", "POST", {
    body: data,
    upsert: true,
  });
}

export async function clearCanvasPixels(username: string) {
  // Update all pixels by this user to empty
  await supabaseRest<CanvasPixel>("canvas_pixels", "PATCH", {
    query: `username=eq.${username}`,
    body: { char: " ", username: null, updated_at: new Date().toISOString() },
  });
}

export async function upsertVisitor(visitor: Omit<Visitor, "id" | "created_at">) {
  const data = {
    ...visitor,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };

  await supabaseRest<Visitor>("visitors", "POST", {
    body: data,
    upsert: true,
  });

  return data as Visitor;
}

// Fetch existing visitor by session ID
export async function fetchVisitorBySession(sessionId: string): Promise<Visitor | null> {
  const result = await supabaseRest<Visitor[]>("visitors", "GET", {
    query: `session_id=eq.${sessionId}`,
  });
  return result && Array.isArray(result) && result.length > 0 ? result[0] : null;
}

// Fetch all guestbook entries
export async function fetchGuestbookEntries(): Promise<GuestbookEntry[]> {
  const result = await supabaseRest<GuestbookEntry[]>("guestbook", "GET", {
    query: "order=created_at.desc&limit=50",
  });
  return result && Array.isArray(result) ? result : [];
}

// Fetch online presence (last 60 seconds)
export async function fetchOnlinePresence(): Promise<Presence[]> {
  const cutoff = new Date(Date.now() - 60000).toISOString();
  const result = await supabaseRest<Presence[]>("presence", "GET", {
    query: `last_seen=gte.${cutoff}&order=last_seen.desc`,
  });
  return result && Array.isArray(result) ? result : [];
}

// Fetch canvas pixels
export async function fetchCanvasPixels(): Promise<CanvasPixel[]> {
  const result = await supabaseRest<CanvasPixel[]>("canvas_pixels", "GET", {
    query: "order=updated_at.desc",
  });
  return result && Array.isArray(result) ? result : [];
}
