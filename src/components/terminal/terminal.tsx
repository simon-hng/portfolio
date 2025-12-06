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
║   Welcome to Simon's Portfolio                           ║
║                                                                   ║
║   Type 'help' to see available commands                           ║
║   Press Ctrl+J for quick navigation                               ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`;

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
      className="terminal-container"
      onClick={focusInput}
      ref={terminalRef}
    >
      {/* Welcome message */}
      {showWelcome && (
        <pre className="terminal-output terminal-welcome">{WELCOME_MESSAGE}</pre>
      )}

      {/* History */}
      {history.map((entry, i) => (
        <div key={i} className="terminal-entry">
          <div className="terminal-prompt">
            <span className="terminal-user">guest</span>
            <span className="terminal-at">@</span>
            <span className="terminal-host">simonhng.dev</span>
            <span className="terminal-separator">:</span>
            <span className="terminal-path">~</span>
            <span className="terminal-dollar">$</span>
            <span className="terminal-command">{entry.command}</span>
          </div>
          <pre 
            className={`terminal-output ${entry.result.isError ? "terminal-error" : ""}`}
          >
            {entry.result.output}
          </pre>
        </div>
      ))}

      {/* Current input line */}
      <div className="terminal-input-line">
        <span className="terminal-user">guest</span>
        <span className="terminal-at">@</span>
        <span className="terminal-host">simonhng.dev</span>
        <span className="terminal-separator">:</span>
        <span className="terminal-path">~</span>
        <span className="terminal-dollar">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span className="terminal-cursor" />
      </div>
    </div>
  );
}
