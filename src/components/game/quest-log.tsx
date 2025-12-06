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

export function QuestLog({ work, affiliations }: QuestLogProps) {
  const isActive = (endDate: Date | string | "present") => endDate === "present";

  return (
    <div className="space-y-4">
      {/* Main Quests (Work) */}
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(142_60%_50%/0.5)]">
        <SectionTitle icon={Scroll} color="text-[hsl(142_60%_50%)]">Main Quests</SectionTitle>
        
        <div className="space-y-1">
          {work.map((job, index) => (
            <div
              key={`${job.organization}-${index}`}
              className={`p-3 bg-transparent border-l-2 mb-2 transition-all hover:bg-[hsl(220_15%_10%)] ${
                isActive(job.endDate) 
                  ? "border-l-[hsl(142_71%_45%)] hover:border-l-[hsl(142_71%_45%/0.7)]" 
                  : "border-l-[hsl(220_10%_20%)] hover:border-l-[hsl(142_71%_45%/0.7)]"
              }`}
            >
              <div className="flex items-start gap-2">
                {isActive(job.endDate) ? (
                  <Circle className="w-3 h-3 text-[hsl(142_71%_45%)] mt-0.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-[hsl(142_71%_45%)] mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[0.5rem] leading-snug text-white truncate">
                      {job.organization}
                    </h3>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[hsl(142_71%_45%)] hover:text-[hsl(142_60%_50%)] transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[0.4rem] leading-relaxed text-[hsl(142_50%_35%)]">{job.position}</p>
                  <p className="text-[0.4rem] leading-relaxed text-gray-500 mt-0.5">
                    {formatDateRange(job.startDate, job.endDate)} • {job.location}
                  </p>
                  
                  {/* Objectives */}
                  <ul className="mt-2 space-y-1">
                    {job.highlights.slice(0, 2).map((highlight, i) => (
                      <li key={i} className="text-[0.4rem] leading-relaxed text-gray-400 flex gap-2">
                        <span className="text-[hsl(142_60%_50%)]">▸</span>
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
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
        <SectionTitle icon={Scroll} color="text-[hsl(142_40%_40%)]">Side Quests</SectionTitle>
        
        <div className="space-y-1">
          {affiliations.map((affiliation, index) => (
            <div
              key={`${affiliation.organization}-${index}`}
              className={`p-3 bg-transparent border-l-2 mb-2 transition-all hover:bg-[hsl(220_15%_10%)] ${
                isActive(affiliation.endDate) 
                  ? "border-l-[hsl(142_71%_45%)] hover:border-l-[hsl(142_71%_45%/0.7)]" 
                  : "border-l-[hsl(220_10%_20%)] hover:border-l-[hsl(142_71%_45%/0.7)]"
              }`}
            >
              <div className="flex items-start gap-2">
                {isActive(affiliation.endDate) ? (
                  <Circle className="w-3 h-3 text-[hsl(142_71%_45%)] mt-0.5 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 text-[hsl(142_71%_45%)] mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.5rem] leading-snug text-white truncate">
                    {affiliation.organization}
                  </h3>
                  <p className="text-[0.4rem] leading-relaxed text-[hsl(30_60%_45%)]">{affiliation.position}</p>
                  <p className="text-[0.4rem] leading-relaxed text-gray-500 mt-0.5">
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
