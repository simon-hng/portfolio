"use client";

import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "terminal_session_id";
const USERNAME_KEY = "terminal_username";

// Fun adjectives and nouns for generating random usernames
const ADJECTIVES = [
  "swift", "quiet", "brave", "clever", "cosmic", "cyber", "digital", "electric",
  "fast", "ghost", "hidden", "laser", "lunar", "neon", "phantom", "pixel",
  "quantum", "rapid", "shadow", "silent", "solar", "stealth", "turbo", "void",
  "zen", "binary", "chrome", "dark", "echo", "flux", "hyper", "jade",
];

const NOUNS = [
  "wolf", "hawk", "fox", "bear", "tiger", "eagle", "raven", "dragon",
  "phoenix", "serpent", "falcon", "panther", "cobra", "viper", "lynx", "owl",
  "shark", "storm", "blade", "star", "nova", "pulse", "wave", "spark",
  "byte", "core", "node", "port", "root", "shell", "stack", "kernel",
];

export function generateUsername(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 100);
  return `${adjective}_${noun}${number}`;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function setUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERNAME_KEY, username);
}

export function hasUsername(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(USERNAME_KEY);
}

// Validate username (alphanumeric, underscores, 3-20 chars)
export function isValidUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

export function getUsernameError(username: string): string | null {
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
  if (username.length > 20) {
    return "Username must be 20 characters or less";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return null;
}
