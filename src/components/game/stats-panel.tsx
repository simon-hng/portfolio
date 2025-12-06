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

// Section title component with decorative lines
function SectionTitle({ children, icon: Icon, color }: { children: React.ReactNode; icon: React.ComponentType<{ className?: string }>; color?: string }) {
  return (
    <h2 className={`text-[0.5rem] tracking-wide uppercase mb-3 flex items-center gap-2 opacity-70 ${color || "text-[hsl(142_71%_45%)]"}`}>
      <span className="flex-1 h-px bg-[hsl(220_10%_20%)]" />
      <Icon className="w-3 h-3" />
      <span>{children}</span>
      <span className="flex-1 h-px bg-[hsl(220_10%_20%)]" />
    </h2>
  );
}

// Stat bar component
function StatBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-[hsl(220_15%_10%)] border border-[hsl(220_10%_20%)] relative overflow-hidden">
      <div
        className="h-full bg-[hsl(142_71%_45%)] opacity-70 transition-[width] duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function StatsPanel({ skills, languages }: StatsPanelProps) {
  const programmingSkills = skills.find(s => s.category === "Programming")?.skills || [];
  const toolsSkills = skills.find(s => s.category === "Tools, Frameworks and Libraries")?.skills || [];

  return (
    <div className="space-y-4">
      {/* Programming Skills */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
        <SectionTitle icon={Zap} color="text-[hsl(142_71%_45%)]">Abilities</SectionTitle>
        
        <div className="space-y-2">
          {programmingSkills.slice(0, 6).map((skill) => (
            <div key={skill}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[0.4rem] leading-relaxed text-gray-300">{skill}</span>
                <span className="text-[0.4rem] leading-relaxed text-[hsl(142_60%_50%)]">
                  {skillLevels[skill] || 70}
                </span>
              </div>
              <StatBar value={skillLevels[skill] || 70} />
            </div>
          ))}
        </div>
      </div>

      {/* Tools & Frameworks */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
        <SectionTitle icon={Wrench} color="text-[hsl(142_50%_35%)]">Equipment</SectionTitle>
        
        <div className="flex flex-wrap gap-1">
          {toolsSkills.map((skill, index) => (
            <span
              key={skill}
              className={`inline-block px-2 py-1 text-[0.4rem] bg-transparent border border-[hsl(220_10%_20%)] m-0.5 ${
                index < 3 
                  ? "border-[hsl(142_60%_50%)] text-[hsl(142_60%_50%)]" 
                  : "text-[hsl(0_0%_60%)]"
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
        <SectionTitle icon={MessageCircle} color="text-[hsl(142_71%_45%)]">Languages</SectionTitle>
        
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.language}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[0.4rem] leading-relaxed text-gray-300">{lang.language}</span>
                <span className="text-[0.4rem] leading-relaxed text-[hsl(142_71%_45%)]">{lang.fluency}</span>
              </div>
              <StatBar value={languageLevels[lang.fluency] || 70} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
