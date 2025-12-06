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
  border: string;
} {
  const keywords = project.keywords || [];
  if (keywords.includes("Hackathon")) {
    return { color: "text-game-yellow", label: "Legendary", border: "border-game-yellow" };
  }
  if (keywords.includes("Side Project")) {
    return { color: "text-game-purple", label: "Epic", border: "border-game-purple" };
  }
  return { color: "text-game-cyan", label: "Rare", border: "border-game-cyan" };
}

function getIcon(project: CurriculumVitae["projects"][0]): string {
  const keywords = project.keywords || [];
  if (keywords.includes("Hackathon")) return projectIcons["Hackathon"];
  if (keywords.includes("Side Project")) return projectIcons["Side Project"];
  return projectIcons["default"];
}

export function Inventory({ projects }: InventoryProps) {
  const [selectedProject, setSelectedProject] = useState<CurriculumVitae["projects"][0] | null>(null);

  return (
    <>
      <div className="game-panel pixel-border pixel-border-magenta">
        <h2 className="game-section-title text-game-magenta">
          <Package className="w-3 h-3" />
          <span>Inventory</span>
        </h2>
        
        <div className="inventory-grid">
          {projects.map((project, index) => {
            const rarity = getRarity(project);
            return (
              <button
                key={`${project.name}-${index}`}
                className={`inventory-item ${rarity.border}`}
                onClick={() => setSelectedProject(project)}
              >
                <span className="inventory-item-icon">{getIcon(project)}</span>
                <span className="inventory-item-name text-gray-200">{project.name}</span>
                <span className={`game-text-xs mt-1 ${rarity.color}`}>
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
            className="game-panel pixel-border pixel-border-cyan max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getIcon(selectedProject)}</span>
                <div>
                  <h3 className="game-text-base text-white">{selectedProject.name}</h3>
                  <span className={`game-text-xs ${getRarity(selectedProject).color}`}>
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
              <p className="game-text-xs text-gray-400 mb-2">
                {selectedProject.affiliation !== "none" && (
                  <span className="text-game-orange">
                    Obtained from: {selectedProject.affiliation}
                  </span>
                )}
              </p>
              <ul className="space-y-1">
                {selectedProject.highlights.map((highlight, i) => (
                  <li key={i} className="game-text-xs text-gray-300 flex gap-2">
                    <span className="text-game-cyan">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            {selectedProject.keywords && selectedProject.keywords.length > 0 && (
              <div className="mb-3">
                <p className="game-text-xs text-gray-500 mb-1">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.keywords.map((keyword) => (
                    <span key={keyword} className="skill-tag">
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
                className="flex items-center justify-center gap-2 w-full py-2 bg-game-cyan/20 border-2 border-game-cyan text-game-cyan game-text-sm hover:bg-game-cyan/30 transition-colors"
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

