"use client";

import Link from "next/link";
import { User, Swords, Package, Trophy, Notebook } from "lucide-react";

interface GameNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "quests", label: "Quests", icon: Swords },
  { id: "stats", label: "Stats", icon: User },
  { id: "items", label: "Items", icon: Package },
  { id: "trophies", label: "Awards", icon: Trophy },
];

export function GameNav({ activeSection, onSectionChange }: GameNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[hsl(220_20%_6%)] border-t border-[hsl(220_10%_20%)] flex justify-around py-2 z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 px-4 py-2 text-[0.5rem] bg-transparent border-none cursor-pointer transition-all ${
            activeSection === item.id 
              ? "text-[hsl(142_71%_45%)]" 
              : "text-[hsl(0_0%_60%)] hover:text-[hsl(142_71%_45%)]"
          }`}
          onClick={() => onSectionChange(item.id)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </button>
      ))}
      <Link 
        href="/blog" 
        className="flex flex-col items-center gap-1 px-4 py-2 text-[0.5rem] text-[hsl(0_0%_60%)] hover:text-[hsl(142_71%_45%)] transition-all"
      >
        <Notebook className="w-5 h-5" />
        <span>Blog</span>
      </Link>
    </nav>
  );
}
