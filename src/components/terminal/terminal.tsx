"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { executeCommand, type CommandResult } from "./command-handler";
import type { CurriculumVitae } from "@/data/resume-schema";

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
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    if (!input.trim()) return;

    const result = executeCommand(input, data);

    // Handle special actions
    if (result.action === "clear") {
      setHistory([]);
      setShowWelcome(false);
      setInput("");
      return;
    }

    if (result.action === "open-url" && result.url) {
      window.open(result.url, "_blank");
    }

    setHistory((prev) => [...prev, { command: input, result }]);
    setCommandHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    setInput("");
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
    <div 
      className="font-mono text-sm md:text-[15px] leading-relaxed p-6 md:px-12 md:py-8 min-h-screen max-h-screen overflow-y-auto relative z-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
      onClick={focusInput}
      ref={terminalRef}
    >
      {/* Welcome message */}
      {showWelcome && (
        <pre className="whitespace-pre-wrap wrap-break-word text-[hsl(142_71%_45%)] mb-6">{WELCOME_MESSAGE}</pre>
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
        />
        <span className="inline-block w-2 h-[1.2em] bg-[hsl(142_71%_45%)] animate-[blink_1s_step-end_infinite] align-text-bottom ml-0.5" />
      </div>
    </div>
  );
}
