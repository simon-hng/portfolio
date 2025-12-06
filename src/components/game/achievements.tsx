"use client";

import type { CurriculumVitae } from "@/data/resume-schema";
import { format } from "date-fns";
import { Trophy, GraduationCap, ExternalLink } from "lucide-react";

interface AchievementsProps {
  awards: CurriculumVitae["awards"];
  education: CurriculumVitae["education"];
}

export function Achievements({ awards, education }: AchievementsProps) {
  return (
    <div className="space-y-4">
      {/* Trophies (Awards) */}
      <div className="game-panel pixel-border pixel-border-yellow">
        <h2 className="game-section-title text-game-yellow">
          <Trophy className="w-3 h-3" />
          <span>Trophies</span>
        </h2>
        
        <div className="space-y-2">
          {awards.map((award, index) => (
            <div key={`${award.title}-${index}`} className="achievement-badge">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-info">
                <div className="flex items-center gap-2">
                  <h3 className="achievement-title truncate flex-1">{award.title}</h3>
                  {award.url && (
                    <a
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-game-yellow hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <p className="achievement-desc">
                  {award.issuer} • {format(new Date(award.date), "MMM yyyy")}
                </p>
                {award.highlights.length > 0 && (
                  <p className="achievement-desc text-game-green mt-1">
                    {award.highlights[0]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training (Education) */}
      <div className="game-panel pixel-border pixel-border-green">
        <h2 className="game-section-title text-game-green">
          <GraduationCap className="w-3 h-3" />
          <span>Training</span>
        </h2>
        
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div key={`${edu.institution}-${index}`} className="relative">
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div className="flex-1 min-w-0">
                  <h3 className="game-text-sm text-white">{edu.studyType}</h3>
                  <p className="game-text-xs text-game-cyan">{edu.area}</p>
                  <p className="game-text-xs text-gray-400 mt-1">
                    {edu.institution}
                  </p>
                  <p className="game-text-xs text-gray-500">
                    {edu.location} • {format(new Date(edu.startDate), "yyyy")} - {edu.endDate === "present" ? "Present" : format(new Date(edu.endDate), "yyyy")}
                  </p>
                  
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {edu.highlights.map((highlight, i) => (
                        <li key={i} className="game-text-xs text-gray-400 flex gap-2">
                          <span className="text-game-green">▸</span>
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
                  <div className="stat-bar">
                    <div className="stat-bar-fill bg-game-green animate-pulse" style={{ width: "65%" }} />
                  </div>
                  <p className="game-text-xs text-game-green mt-1">In Progress...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

