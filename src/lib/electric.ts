// Type definitions for our collaborative database tables
// These types match the Supabase schema defined in supabase/migrations/001_realtime_tables.sql

export interface Visitor {
  id: string;
  session_id: string;
  username: string;
  created_at: string;
}

export interface Presence {
  session_id: string;
  username: string;
  last_command: string | null;
  last_seen: string;
  location: string | null;
}

export interface GuestbookEntry {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

export interface CanvasPixel {
  id: string; // format: "x,y"
  char: string;
  username: string | null;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

// Note: Electric SQL integration can be added later for real-time sync
// For now, we're using direct Supabase REST API with polling for updates
//
// To enable Electric SQL real-time sync:
// 1. Set up Electric Cloud or self-hosted Electric
// 2. Configure NEXT_PUBLIC_ELECTRIC_URL environment variable
// 3. Use ShapeStream to subscribe to table changes
//
// Example usage with Electric:
// import { ShapeStream, Shape } from "@electric-sql/client";
//
// const stream = new ShapeStream<Presence>({
//   url: `${ELECTRIC_URL}/v1/shape`,
//   params: { table: "presence" },
// });
//
// const shape = new Shape(stream);
// shape.subscribe((data) => {
//   // Handle real-time updates
// });
