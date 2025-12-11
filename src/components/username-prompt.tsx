"use client";

import { useState, KeyboardEvent } from "react";
import {
  generateUsername,
  setUsername,
  getUsernameError,
} from "@/lib/session";

interface UsernamePromptProps {
  onComplete: (username: string) => void;
}

export function UsernamePrompt({ onComplete }: UsernamePromptProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"welcome" | "input">("welcome");

  const handleGenerateRandom = () => {
    const randomName = generateUsername();
    setUsername(randomName);
    onComplete(randomName);
  };

  const handleSubmit = () => {
    const trimmed = input.trim().toLowerCase();
    const validationError = getUsernameError(trimmed);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUsername(trimmed);
    onComplete(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="font-mono text-sm md:text-base max-w-lg w-full mx-4 p-6 border border-[hsl(142_71%_45%)/30] bg-background rounded">
        {step === "welcome" ? (
          <>
            <pre className="text-[hsl(142_71%_45%)] whitespace-pre-wrap mb-6">
{`╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   USERNAME REQUIRED                                       ║
║                                                           ║
║   To use collaborative features like the guestbook        ║
║   and drawing canvas, you need a username.                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝`}
            </pre>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep("input")}
                className="w-full py-2 px-4 bg-[hsl(142_71%_45%)/10] border border-[hsl(142_71%_45%)/50] text-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_45%)/20] transition-colors rounded"
              >
                [ Choose my own username ]
              </button>
              <button
                onClick={handleGenerateRandom}
                className="w-full py-2 px-4 bg-transparent border border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors rounded"
              >
                [ Generate random username ]
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <span className="text-muted-foreground">Enter username:</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[hsl(142_71%_45%)]">{">"}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="your_username"
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            {error && (
              <div className="text-[hsl(0_84%_60%)] mb-4 text-sm">{error}</div>
            )}
            <div className="text-muted-foreground text-xs mb-4">
              3-20 characters, letters, numbers, and underscores only
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 px-4 bg-[hsl(142_71%_45%)/10] border border-[hsl(142_71%_45%)/50] text-[hsl(142_71%_45%)] hover:bg-[hsl(142_71%_45%)/20] transition-colors rounded"
              >
                [ Confirm ]
              </button>
              <button
                onClick={() => setStep("welcome")}
                className="py-2 px-4 bg-transparent border border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 transition-colors rounded"
              >
                [ Back ]
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
