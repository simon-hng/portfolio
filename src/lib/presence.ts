"use client";

import { upsertPresence, removePresence, fetchOnlinePresence } from "./db";
import { getSessionId, getUsername } from "./session";
import type { Presence } from "./electric";

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const PRESENCE_TIMEOUT = 60000; // 60 seconds - users are considered offline after this

let heartbeatTimer: NodeJS.Timeout | null = null;
let lastCommand: string | null = null;

// Start presence heartbeat
export function startPresence(username: string) {
  const sessionId = getSessionId();
  if (!sessionId || !username) return;

  // Initial presence update
  updatePresence(username);

  // Set up heartbeat
  heartbeatTimer = setInterval(() => {
    updatePresence(username);
  }, HEARTBEAT_INTERVAL);

  // Handle page unload
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("visibilitychange", handleVisibilityChange);
  }
}

// Stop presence heartbeat
export function stopPresence() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  if (typeof window !== "undefined") {
    window.removeEventListener("beforeunload", handleUnload);
    window.removeEventListener("visibilitychange", handleVisibilityChange);
  }

  // Remove presence from database
  const sessionId = getSessionId();
  if (sessionId) {
    removePresence(sessionId).catch(console.error);
  }
}

// Update presence with current state
async function updatePresence(username: string) {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    await upsertPresence({
      session_id: sessionId,
      username,
      last_command: lastCommand,
      location: null, // Could be populated via IP geolocation API
    });
  } catch (error) {
    console.error("Failed to update presence:", error);
  }
}

// Track the last command executed
export function trackCommand(command: string) {
  lastCommand = command;
  const username = getUsername();
  if (username) {
    updatePresence(username);
  }
}

// Handle page unload
function handleUnload() {
  const sessionId = getSessionId();
  if (sessionId) {
    // Use sendBeacon for reliable delivery on unload
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      navigator.sendBeacon(
        `${SUPABASE_URL}/rest/v1/presence?session_id=eq.${sessionId}`,
        JSON.stringify({})
      );
    }
  }
}

// Handle visibility change (tab hidden/shown)
function handleVisibilityChange() {
  const username = getUsername();
  if (!username) return;

  if (document.visibilityState === "visible") {
    // Resume heartbeat when tab becomes visible
    updatePresence(username);
  }
}

// Get online users (filtered by timeout)
export async function getOnlineUsers(): Promise<Presence[]> {
  try {
    const presence = await fetchOnlinePresence();
    const now = Date.now();
    
    // Filter to users active within the timeout window
    return presence.filter((p) => {
      const lastSeen = new Date(p.last_seen).getTime();
      return now - lastSeen < PRESENCE_TIMEOUT;
    });
  } catch (error) {
    console.error("Failed to fetch online users:", error);
    return [];
  }
}

// Format time since last seen
export function formatIdleTime(lastSeen: string): string {
  const now = Date.now();
  const seen = new Date(lastSeen).getTime();
  const diff = Math.floor((now - seen) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}
