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
    <nav className="game-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`game-nav-item ${activeSection === item.id ? "active" : ""}`}
          onClick={() => onSectionChange(item.id)}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </button>
      ))}
      <Link href="/blog" className="game-nav-item">
        <Notebook className="w-5 h-5" />
        <span>Blog</span>
      </Link>
    </nav>
  );
}

