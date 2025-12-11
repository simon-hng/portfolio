"use client";

import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import type { CanvasPixel } from "@/lib/electric";

const CANVAS_WIDTH = 64;
const CANVAS_HEIGHT = 32;

interface CanvasOverlayProps {
  pixels: Map<string, CanvasPixel>;
  username: string | null;
  onPixelChange: (x: number, y: number, char: string) => void;
  onClose: () => void;
}

export function CanvasOverlay({
  pixels,
  username,
  onPixelChange,
  onClose,
}: CanvasOverlayProps) {
  const [cursorX, setCursorX] = useState(Math.floor(CANVAS_WIDTH / 2));
  const [cursorY, setCursorY] = useState(Math.floor(CANVAS_HEIGHT / 2));
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Get character at position
  const getChar = useCallback(
    (x: number, y: number): string => {
      const key = `${x},${y}`;
      const pixel = pixels.get(key);
      return pixel?.char || " ";
    },
    [pixels]
  );

  // Get pixel owner at position (for displaying who placed it)
  const getPixelOwner = useCallback(
    (x: number, y: number): string | null => {
      const key = `${x},${y}`;
      const pixel = pixels.get(key);
      return pixel?.username || null;
    },
    [pixels]
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      // Navigation
      if (e.key === "ArrowUp") {
        setCursorY((y) => Math.max(0, y - 1));
        return;
      }
      if (e.key === "ArrowDown") {
        setCursorY((y) => Math.min(CANVAS_HEIGHT - 1, y + 1));
        return;
      }
      if (e.key === "ArrowLeft") {
        setCursorX((x) => Math.max(0, x - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        setCursorX((x) => Math.min(CANVAS_WIDTH - 1, x + 1));
        return;
      }

      // Close
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Delete/Backspace - erase character
      if (e.key === "Backspace" || e.key === "Delete") {
        if (username) {
          onPixelChange(cursorX, cursorY, " ");
        }
        return;
      }

      // Type a character
      if (e.key.length === 1 && username) {
        onPixelChange(cursorX, cursorY, e.key);
        // Move cursor right after typing
        setCursorX((x) => Math.min(CANVAS_WIDTH - 1, x + 1));
        return;
      }
    },
    [cursorX, cursorY, username, onPixelChange, onClose]
  );

  // Render the canvas grid
  const renderCanvas = () => {
    const rows: React.ReactNode[] = [];

    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      const chars: React.ReactNode[] = [];

      for (let x = 0; x < CANVAS_WIDTH; x++) {
        const char = getChar(x, y);
        const isCursor = x === cursorX && y === cursorY;
        const owner = getPixelOwner(x, y);
        const isOwnPixel = owner === username;

        chars.push(
          <span
            key={`${x},${y}`}
            className={`
              inline-block w-[1ch]
              ${isCursor ? "bg-[hsl(142_71%_45%)] text-background" : ""}
              ${!isCursor && isOwnPixel ? "text-[hsl(142_71%_65%)]" : ""}
              ${!isCursor && owner && !isOwnPixel ? "text-[hsl(217_91%_60%)]" : ""}
            `}
            title={owner ? `Placed by ${owner}` : undefined}
          >
            {char}
          </span>
        );
      }

      rows.push(
        <div key={y} className="leading-none">
          {chars}
        </div>
      );
    }

    return rows;
  };

  const pixelOwner = getPixelOwner(cursorX, cursorY);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="max-w-full overflow-auto p-4">
        {/* Header */}
        <div className="font-mono text-sm mb-4 text-muted-foreground">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[hsl(142_71%_45%)]">
              ═══ Collaborative ASCII Canvas ({CANVAS_WIDTH}x{CANVAS_HEIGHT}) ═══
            </span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              [ESC to close]
            </button>
          </div>
          <div className="text-xs">
            {username ? (
              <span>
                Drawing as <span className="text-[hsl(142_71%_65%)]">{username}</span>
                {" • "}
                <span className="text-[hsl(142_71%_65%)]">■</span> your pixels
                {" • "}
                <span className="text-[hsl(217_91%_60%)]">■</span> others
              </span>
            ) : (
              <span className="text-[hsl(0_84%_60%)]">
                Set a username to draw (type &apos;name &lt;username&gt;&apos; in terminal)
              </span>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="font-mono text-sm bg-background border border-[hsl(142_71%_45%)/30] p-2 outline-none focus:border-[hsl(142_71%_45%)/60]"
          style={{ lineHeight: 1.2 }}
        >
          {/* Top border */}
          <div className="text-[hsl(142_71%_45%)/50]">
            ┌{"─".repeat(CANVAS_WIDTH)}┐
          </div>

          {/* Canvas content */}
          <div className="relative">
            {renderCanvas().map((row, i) => (
              <div key={i} className="flex">
                <span className="text-[hsl(142_71%_45%)/50]">│</span>
                {row}
                <span className="text-[hsl(142_71%_45%)/50]">│</span>
              </div>
            ))}
          </div>

          {/* Bottom border */}
          <div className="text-[hsl(142_71%_45%)/50]">
            └{"─".repeat(CANVAS_WIDTH)}┘
          </div>
        </div>

        {/* Footer / Status */}
        <div className="font-mono text-xs mt-4 text-muted-foreground">
          <div className="flex justify-between">
            <span>
              Cursor: ({cursorX}, {cursorY})
              {pixelOwner && (
                <span className="ml-4">
                  Pixel by: <span className="text-[hsl(217_91%_60%)]">{pixelOwner}</span>
                </span>
              )}
            </span>
            <span>
              ←↑↓→ move • type to draw • backspace to erase
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to export canvas as ASCII string
export function exportCanvasToAscii(pixels: Map<string, CanvasPixel>): string {
  const lines: string[] = [];

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    let line = "";
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      const key = `${x},${y}`;
      const pixel = pixels.get(key);
      line += pixel?.char || " ";
    }
    lines.push(line);
  }

  // Trim trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  return lines.join("\n");
}
