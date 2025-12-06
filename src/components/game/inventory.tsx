"use client";

import { useState } from "react";
import type { CurriculumVitae } from "@/data/resume-schema";
import { Package, X, ExternalLink, Sparkles } from "lucide-react";

interface InventoryProps {
  projects: CurriculumVitae["projects"];
}

// Map project types to icons
const projectIcons: Record<string, string> = {
  "Side Project": "🔧",
  "Hackathon": "⚡",
  "default": "📦",
};

// Determine rarity based on keywords
function getRarity(project: CurriculumVitae["projects"][0]): {
  color: string;
  label: string;
} {
  const keywords = project.keywords || [];
  if (keywords.includes("Hackathon")) {
    return { color: "text-[hsl(142_71%_45%)]", label: "Hackathon" };
  }
  if (keywords.includes("Side Project")) {
    return { color: "text-gray-500", label: "Side Project" };
  }
  return { color: "text-gray-500", label: "Project" };
}

function getIcon(project: CurriculumVitae["projects"][0]): string {
  const keywords = project.keywords || [];
  if (keywords.includes("Hackathon")) return projectIcons["Hackathon"];
  if (keywords.includes("Side Project")) return projectIcons["Side Project"];
  return projectIcons["default"];
}

// Section title component with decorative lines
function SectionTitle({ children, icon: Icon }: { children: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <h2 className="text-[0.5rem] tracking-wide uppercase mb-3 flex items-center gap-2 text-[hsl(142_71%_45%)] opacity-70">
      <span className="flex-1 h-px bg-[hsl(220_10%_20%)]" />
      <Icon className="w-3 h-3" />
      <span>{children}</span>
      <span className="flex-1 h-px bg-[hsl(220_10%_20%)]" />
    </h2>
  );
}

export function Inventory({ projects }: InventoryProps) {
  const [selectedProject, setSelectedProject] = useState<CurriculumVitae["projects"][0] | null>(null);

  return (
    <>
      <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
        <SectionTitle icon={Package}>Inventory</SectionTitle>
        
        <div className="grid grid-cols-2 gap-2">
          {projects.map((project, index) => {
            const rarity = getRarity(project);
            return (
              <button
                key={`${project.name}-${index}`}
                className="aspect-square bg-transparent border border-[hsl(220_10%_20%)] p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer hover:border-[hsl(142_71%_45%/0.7)] hover:bg-[hsl(220_15%_10%)]"
                onClick={() => setSelectedProject(project)}
              >
                <span className="text-2xl mb-1">{getIcon(project)}</span>
                <span className="text-[0.5rem] leading-snug overflow-hidden text-ellipsis line-clamp-2 text-gray-200">{project.name}</span>
                <span className={`text-[0.4rem] leading-relaxed mt-1 ${rarity.color}`}>
                  {rarity.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-[hsl(220_15%_10%)] p-4 border border-[hsl(142_71%_45%/0.5)] max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getIcon(selectedProject)}</span>
                <div>
                  <h3 className="text-[0.625rem] leading-snug text-white">{selectedProject.name}</h3>
                  <span className={`text-[0.4rem] leading-relaxed ${getRarity(selectedProject).color}`}>
                    <Sparkles className="w-2 h-2 inline mr-1" />
                    {getRarity(selectedProject).label}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <div className="mb-3">
              <p className="text-[0.4rem] leading-relaxed text-gray-400 mb-2">
                {selectedProject.affiliation !== "none" && (
                  <span className="text-[hsl(30_60%_45%)]">
                    Obtained from: {selectedProject.affiliation}
                  </span>
                )}
              </p>
              <ul className="space-y-1">
                {selectedProject.highlights.map((highlight, i) => (
                  <li key={i} className="text-[0.4rem] leading-relaxed text-gray-300 flex gap-2">
                    <span className="text-[hsl(142_71%_45%)]">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            {selectedProject.keywords && selectedProject.keywords.length > 0 && (
              <div className="mb-3">
                <p className="text-[0.4rem] leading-relaxed text-gray-500 mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.keywords.map((keyword) => (
                    <span 
                      key={keyword} 
                      className="inline-block px-2 py-1 text-[0.4rem] bg-transparent border border-[hsl(220_10%_20%)] m-0.5 text-[hsl(0_0%_60%)]"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action */}
            {selectedProject.url && (
              <a
                href={selectedProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[hsl(142_71%_45%/0.2)] border-2 border-[hsl(142_71%_45%)] text-[hsl(142_71%_45%)] text-[0.5rem] hover:bg-[hsl(142_71%_45%/0.3)] transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View Project
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
