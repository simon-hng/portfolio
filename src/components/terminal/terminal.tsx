"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import {
  executeCommand,
  executeAsyncCommand,
  isAsyncCommand,
  type CommandResult,
  type CommandContext,
} from "./command-handler";
import type { CurriculumVitae } from "@/data/resume-schema";
import { CanvasOverlay, exportCanvasToAscii } from "./canvas-overlay";
import { UsernamePrompt } from "@/components/username-prompt";
import {
  getUsername,
  setUsername as saveUsername,
} from "@/lib/session";
import { startPresence, stopPresence, trackCommand } from "@/lib/presence";
import {
  fetchOnlinePresence,
  fetchGuestbookEntries,
  addGuestbookEntry,
  fetchCanvasPixels,
  updateCanvasPixel,
} from "@/lib/db";
import type { CanvasPixel } from "@/lib/electric";

interface HistoryEntry {
  command: string;
  result: CommandResult;
}

interface TerminalProps {
  data: CurriculumVitae;
}

const WELCOME_MESSAGE = `
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   Welcome to Simon's Portfolio                                    ║
║                                                                   ║
║   Type 'help' to see available commands                           ║
║   Press Ctrl+J for quick navigation                               ║
║                                                                   ║
║   NEW: Try 'who', 'guestbook', or 'draw' for collaborative fun!   ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;

function TerminalPrompt({ command }: { command?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-0">
      <span className="text-[hsl(142_71%_45%)] font-semibold">guest</span>
      <span className="text-muted-foreground">@</span>
      <span className="text-[hsl(142_71%_65%)]">simonhng.dev</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-[hsl(217_91%_60%)] font-semibold">~</span>
      <span className="text-muted-foreground ml-1 mr-2">$</span>
      {command && <span className="text-foreground">{command}</span>}
    </div>
  );
}

export function Terminal({ data }: TerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Collaborative state - start null to avoid hydration mismatch, load from localStorage after mount
  const [username, setUsernameState] = useState<string | null>(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasPixels, setCanvasPixels] = useState<Map<string, CanvasPixel>>(
    new Map()
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Load username from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUsernameState(storedUsername);
    }
  }, []);

  // Initialize presence when username is set
  useEffect(() => {
    if (username) {
      startPresence(username);
      return () => {
        stopPresence();
      };
    }
  }, [username]);

  // Load canvas pixels on mount and periodically
  useEffect(() => {
    let mounted = true;

    const loadPixels = async () => {
      try {
        const pixels = await fetchCanvasPixels();
        if (mounted) {
          const pixelMap = new Map<string, CanvasPixel>();
          pixels.forEach((p) => pixelMap.set(p.id, p));
          setCanvasPixels(pixelMap);
        }
      } catch (error) {
        console.error("Failed to load canvas:", error);
      }
    };

    // Initial load
    loadPixels();

    // Periodic refresh
    const interval = setInterval(loadPixels, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle username completion
  const handleUsernameComplete = useCallback((newUsername: string) => {
    setUsernameState(newUsername);
    setShowUsernamePrompt(false);
  }, []);

  // Focus input on click anywhere in terminal
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus on mount
  useEffect(() => {
    focusInput();
  }, []);

  // Create command context for async commands
  const createCommandContext = useCallback((): CommandContext => {
    return {
      data,
      username,
      getOnlineUsers: fetchOnlinePresence,
      getGuestbookEntries: fetchGuestbookEntries,
      addGuestbookEntry: async (message: string) => {
        if (!username) throw new Error("No username");
        await addGuestbookEntry({ username, message });
      },
      getCanvasAscii: () => exportCanvasToAscii(canvasPixels),
    };
  }, [data, username, canvasPixels]);

  // Handle canvas pixel change
  const handlePixelChange = useCallback(
    async (x: number, y: number, char: string) => {
      if (!username) return;

      const pixelId = `${x},${y}`;
      const newPixel: CanvasPixel = {
        id: pixelId,
        char,
        username: char === " " ? null : username,
        updated_at: new Date().toISOString(),
      };

      // Optimistic update
      setCanvasPixels((prev) => {
        const next = new Map(prev);
        next.set(pixelId, newPixel);
        return next;
      });

      // Sync to backend
      try {
        await updateCanvasPixel({
          id: pixelId,
          char,
          username: char === " " ? null : username,
        });
      } catch (error) {
        console.error("Failed to update pixel:", error);
      }
    },
    [username]
  );

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    const [commandName] = trimmedInput.toLowerCase().split(/\s+/);

    // Track command for presence
    trackCommand(commandName);

    setIsLoading(true);

    try {
      // Check if it's an async command
      if (isAsyncCommand(commandName)) {
        const ctx = createCommandContext();
        const result = await executeAsyncCommand(trimmedInput, ctx);

        if (result) {
          // Handle special actions
          if (result.action === "toggle-canvas") {
            setShowCanvas((prev) => !prev);
          }
          if (result.action === "set-username" && result.username) {
            saveUsername(result.username);
            setUsernameState(result.username);
          }
          if (result.action === "prompt-username") {
            setShowUsernamePrompt(true);
          }

          setHistory((prev) => [...prev, { command: input, result }]);
        }
      } else {
        // Sync command
        const result = executeCommand(input, data);

        // Handle special actions
        if (result.action === "clear") {
          setHistory([]);
          setShowWelcome(false);
          setInput("");
          setIsLoading(false);
          return;
        }

        if (result.action === "open-url" && result.url) {
          window.open(result.url, "_blank");
        }

        setHistory((prev) => [...prev, { command: input, result }]);
      }
    } catch (error) {
      console.error("Command error:", error);
      setHistory((prev) => [
        ...prev,
        {
          command: input,
          result: {
            output: "An error occurred. Please try again.",
            isError: true,
          },
        },
      ]);
    }

    setCommandHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    setInput("");
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
      setShowWelcome(false);
    }
  };

  return (
    <>
      {/* Username prompt - shown when collaborative features require it */}
      {showUsernamePrompt && !username && (
        <UsernamePrompt onComplete={handleUsernameComplete} />
      )}

      {/* Canvas overlay */}
      {showCanvas && (
        <CanvasOverlay
          pixels={canvasPixels}
          username={username}
          onPixelChange={handlePixelChange}
          onClose={() => setShowCanvas(false)}
        />
      )}

      {/* Terminal */}
      <div
        className="font-mono text-sm md:text-[15px] leading-relaxed p-6 md:px-12 md:py-8 min-h-screen max-h-screen overflow-y-auto relative z-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
        onClick={focusInput}
        ref={terminalRef}
      >
        {/* Username badge */}
        {username && (
          <div className="fixed top-4 right-4 font-mono text-xs bg-background/80 border border-[hsl(142_71%_45%)/30] rounded px-2 py-1 text-muted-foreground z-10">
            <span className="text-[hsl(142_71%_45%)]">●</span> {username}
          </div>
        )}

        {/* Welcome message */}
        {showWelcome && (
          <pre className="whitespace-pre-wrap wrap-break-word text-[hsl(142_71%_45%)] mb-6">
            {WELCOME_MESSAGE}
          </pre>
        )}

        {/* History */}
        {history.map((entry, i) => (
          <div key={i} className="mb-4">
            <TerminalPrompt command={entry.command} />
            <pre
              className={`whitespace-pre-wrap wrap-break-word mt-2 ${entry.result.isError ? "text-[hsl(0_84%_60%)]" : "text-foreground"}`}
            >
              {entry.result.output}
            </pre>
          </div>
        ))}

        {/* Current input line */}
        <div className="flex flex-wrap items-center gap-0 mt-2">
          <span className="text-[hsl(142_71%_45%)] font-semibold">guest</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-[hsl(142_71%_65%)]">simonhng.dev</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-[hsl(217_91%_60%)] font-semibold">~</span>
          <span className="text-muted-foreground ml-1 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-foreground font-inherit caret-[hsl(142_71%_45%)] placeholder:text-muted-foreground"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            disabled={isLoading}
            placeholder={isLoading ? "Loading..." : ""}
          />
          {!isLoading && (
            <span className="inline-block w-2 h-[1.2em] bg-[hsl(142_71%_45%)] animate-[blink_1s_step-end_infinite] align-text-bottom ml-0.5" />
          )}
          {isLoading && (
            <span className="inline-block w-2 h-[1.2em] bg-[hsl(142_71%_45%)] animate-pulse align-text-bottom ml-0.5" />
          )}
        </div>
      </div>
    </>
  );
}
