"use client";

import type { CurriculumVitae } from "@/data/resume-schema";
import { format } from "date-fns";
import { Scroll, CheckCircle2, Circle, ExternalLink } from "lucide-react";

interface QuestLogProps {
  work: CurriculumVitae["work"];
  affiliations: CurriculumVitae["affiliations"];
}

function formatDateRange(startDate: Date | string, endDate: Date | string | "present"): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = endDate === "present" ? null : (typeof endDate === "string" ? new Date(endDate) : endDate);
  
  const startStr = format(start, "MMM yyyy");
  const endStr = end ? format(end, "MMM yyyy") : "Present";
  
  return `${startStr} - ${endStr}`;
}

export function QuestLog({ work, affiliations }: QuestLogProps) {
  const isActive = (endDate: Date | string | "present") => endDate === "present";

  return (
    <div className="space-y-4">
      {/* Main Quests (Work) */}
      <div className="game-panel pixel-border pixel-border-yellow">
        <h2 className="game-section-title text-game-yellow">
          <Scroll className="w-3 h-3" />
          <span>Main Quests</span>
        </h2>
        
        <div className="space-y-1">
          {work.map((job, index) => (
            <div
              key={`${job.organization}-${index}`}
              className={`quest-item ${isActive(job.endDate) ? "active" : ""}`}
            >
              <div className="flex items-start gap-2">
                {isActive(job.endDate) ? (
                  <Circle className="w-3 h-3 text-game-green mt-0.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-game-cyan mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="game-text-sm text-white truncate">
                      {job.organization}
                    </h3>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-game-cyan hover:text-game-yellow transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <p className="game-text-xs text-game-magenta">{job.position}</p>
                  <p className="game-text-xs text-gray-500 mt-0.5">
                    {formatDateRange(job.startDate, job.endDate)} • {job.location}
                  </p>
                  
                  {/* Objectives */}
                  <ul className="mt-2 space-y-1">
                    {job.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="game-text-xs text-gray-400 flex gap-2">
                        <span className="text-game-yellow">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Quests (Affiliations) */}
      <div className="game-panel pixel-border">
        <h2 className="game-section-title text-game-purple">
          <Scroll className="w-3 h-3" />
          <span>Side Quests</span>
        </h2>
        
        <div className="space-y-1">
          {affiliations.map((affiliation, index) => (
            <div
              key={`${affiliation.organization}-${index}`}
              className={`quest-item ${isActive(affiliation.endDate) ? "active" : ""}`}
            >
              <div className="flex items-start gap-2">
                {isActive(affiliation.endDate) ? (
                  <Circle className="w-3 h-3 text-game-green mt-0.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-game-cyan mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="game-text-sm text-white truncate">
                    {affiliation.organization}
                  </h3>
                  <p className="game-text-xs text-game-orange">{affiliation.position}</p>
                  <p className="game-text-xs text-gray-500 mt-0.5">
                    {formatDateRange(affiliation.startDate, affiliation.endDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

