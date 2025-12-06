"use client";

import type { CurriculumVitae } from "@/data/resume-schema";
import { Zap, Wrench, MessageCircle } from "lucide-react";

interface StatsPanelProps {
  skills: CurriculumVitae["skills"];
  languages: CurriculumVitae["languages"];
}

// Assign "experience levels" to skills for visual effect
const skillLevels: Record<string, number> = {
  TypeScript: 95,
  JavaScript: 92,
  Rust: 85,
  Python: 80,
  Swift: 75,
  "C++20": 70,
  "C#": 68,
  SQL: 85,
  Java: 72,
  C: 65,
  R: 55,
  Lua: 60,
  "Next.js": 95,
  React: 93,
  "Svelte and Sveltekit": 80,
  Postgres: 85,
  Redis: 78,
  ".NET": 65,
  "Spring Boot": 60,
  Nvim: 90,
  Linear: 88,
  Figma: 75,
};

const languageLevels: Record<string, number> = {
  "Native": 100,
  "Native speaker": 100,
  "C1: Advanced": 85,
  "B2: Upper Intermediate": 70,
};

const barColors = [
  "bg-game-cyan",
  "bg-game-green",
  "bg-game-yellow",
  "bg-game-magenta",
  "bg-game-blue",
  "bg-game-orange",
];

export function StatsPanel({ skills, languages }: StatsPanelProps) {
  const programmingSkills = skills.find(s => s.category === "Programming")?.skills || [];
  const toolsSkills = skills.find(s => s.category === "Tools, Frameworks and Libraries")?.skills || [];

  return (
    <div className="space-y-4">
      {/* Programming Skills */}
      <div className="game-panel pixel-border">
        <h2 className="game-section-title text-game-cyan">
          <Zap className="w-3 h-3" />
          <span>Abilities</span>
        </h2>
        
        <div className="space-y-2">
          {programmingSkills.slice(0, 6).map((skill, index) => (
            <div key={skill}>
              <div className="flex justify-between items-center mb-1">
                <span className="game-text-xs text-gray-300">{skill}</span>
                <span className="game-text-xs text-game-yellow">
                  {skillLevels[skill] || 70}
                </span>
              </div>
              <div className="stat-bar">
                <div
                  className={`stat-bar-fill ${barColors[index % barColors.length]}`}
                  style={{ width: `${skillLevels[skill] || 70}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Frameworks */}
      <div className="game-panel pixel-border">
        <h2 className="game-section-title text-game-magenta">
          <Wrench className="w-3 h-3" />
          <span>Equipment</span>
        </h2>
        
        <div className="flex flex-wrap gap-1">
          {toolsSkills.map((skill, index) => (
            <span
              key={skill}
              className={`skill-tag ${index < 3 ? "border-game-yellow text-game-yellow" : ""}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="game-panel pixel-border">
        <h2 className="game-section-title text-game-green">
          <MessageCircle className="w-3 h-3" />
          <span>Languages</span>
        </h2>
        
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.language}>
              <div className="flex justify-between items-center mb-1">
                <span className="game-text-xs text-gray-300">{lang.language}</span>
                <span className="game-text-xs text-game-cyan">{lang.fluency}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill bg-game-green"
                  style={{ width: `${languageLevels[lang.fluency] || 70}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

