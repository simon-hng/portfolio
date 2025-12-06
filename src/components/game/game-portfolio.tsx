"use client";

import { useState, useRef, useEffect } from "react";
import type { CurriculumVitae } from "@/data/resume-schema";
import { CharacterCard } from "./character-card";
import { StatsPanel } from "./stats-panel";
import { QuestLog } from "./quest-log";
import { Inventory } from "./inventory";
import { Achievements } from "./achievements";
import { GameNav } from "./game-nav";

interface GamePortfolioProps {
  data: CurriculumVitae;
}

export function GamePortfolio({ data }: GamePortfolioProps) {
  const [activeSection, setActiveSection] = useState("quests");
  
  const statsRef = useRef<HTMLDivElement>(null);
  const questsRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const trophiesRef = useRef<HTMLDivElement>(null);

  const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    stats: statsRef,
    quests: questsRef,
    items: itemsRef,
    trophies: trophiesRef,
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    refs[section]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["quests", "stats", "items", "trophies"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = refs[section]?.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get current job title for character card
  const currentJob = data.work.find(w => w.endDate === "present");
  const currentTitle = currentJob ? `${currentJob.position}` : undefined;

  return (
    <div className="font-pixel min-h-screen bg-linear-to-b from-[hsl(230_25%_6%)] to-[hsl(230_25%_10%)] p-4 pb-20 relative overflow-x-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-[0.4rem] leading-relaxed text-gray-600">
          Scroll or tap to navigate
        </p>
      </div>

      {/* Character Card - Always visible at top */}
      <CharacterCard personal={data.personal} currentTitle={currentTitle} />

      {/* Quests Section */}
      <section ref={questsRef} id="quests" className="scroll-mt-4 mt-4">
        <QuestLog work={data.work} affiliations={data.affiliations} />
      </section>

      {/* Stats Section */}
      <section ref={statsRef} id="stats" className="scroll-mt-4 mt-4">
        <StatsPanel skills={data.skills} languages={data.languages} />
      </section>

      {/* Items Section */}
      <section ref={itemsRef} id="items" className="scroll-mt-4 mt-4">
        <Inventory projects={data.projects} />
      </section>

      {/* Trophies Section */}
      <section ref={trophiesRef} id="trophies" className="scroll-mt-4 mt-4">
        <Achievements awards={data.awards} education={data.education} />
      </section>

      {/* Bottom Navigation */}
      <GameNav activeSection={activeSection} onSectionChange={handleSectionChange} />
    </div>
  );
}
