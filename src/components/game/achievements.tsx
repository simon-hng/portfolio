"use client";

import type { CurriculumVitae } from "@/data/resume-schema";
import { format } from "date-fns";
import { Trophy, GraduationCap, ExternalLink } from "lucide-react";

interface AchievementsProps {
  awards: CurriculumVitae["awards"];
  education: CurriculumVitae["education"];
}

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
        className="h-full bg-[hsl(142_71%_45%)] opacity-70 transition-[width] duration-500 ease-out animate-pulse"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Achievements({ awards, education }: AchievementsProps) {
  return (
    <div className="space-y-4">
      {/* Trophies (Awards) */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(142_60%_50%/0.5)]">
        <SectionTitle icon={Trophy} color="text-[hsl(142_60%_50%)]">Trophies</SectionTitle>
        
        <div className="space-y-2">
          {awards.map((award, index) => (
            <div 
              key={`${award.title}-${index}`} 
              className="flex items-center gap-3 p-3 bg-transparent border border-[hsl(220_10%_20%)] border-l-2 border-l-[hsl(142_71%_45%/0.7)] mb-2"
            >
              <div className="text-2xl shrink-0">🏆</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-[0.5rem] text-[hsl(142_60%_50%)] mb-1 truncate flex-1">{award.title}</h3>
                  {award.url && (
                    <a
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[hsl(142_60%_50%)] hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <p className="text-[0.4rem] text-[hsl(0_0%_70%)] leading-relaxed">
                  {award.issuer} • {format(new Date(award.date), "MMM yyyy")}
                </p>
                {award.highlights.length > 0 && (
                  <p className="text-[0.4rem] text-[hsl(142_71%_45%)] leading-relaxed mt-1">
                    {award.highlights[0]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training (Education) */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(142_71%_45%/0.5)]">
        <SectionTitle icon={GraduationCap} color="text-[hsl(142_71%_45%)]">Training</SectionTitle>
        
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={`${edu.institution}-${index}`} className="relative">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.5rem] leading-snug text-white">{edu.studyType}</h3>
                  <p className="text-[0.4rem] leading-relaxed text-[hsl(142_71%_45%)]">{edu.area}</p>
                  <p className="text-[0.4rem] leading-relaxed text-gray-400 mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-[0.4rem] leading-relaxed text-gray-500">
                    {edu.location} • {format(new Date(edu.startDate), "yyyy")} - {edu.endDate === "present" ? "Present" : format(new Date(edu.endDate), "yyyy")}
                  </p>
                  
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {edu.highlights.map((highlight, i) => (
                        <li key={i} className="text-[0.4rem] leading-relaxed text-gray-400 flex gap-2">
                          <span className="text-[hsl(142_71%_45%)]">▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* Progress indicator for current education */}
              {edu.endDate === "present" && (
                <div className="mt-2 ml-9">
                  <StatBar value={65} />
                  <p className="text-[0.4rem] leading-relaxed text-[hsl(142_71%_45%)] mt-1">In Progress...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
