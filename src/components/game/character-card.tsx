"use client";

import Image from "next/image";
import type { CurriculumVitae } from "@/data/resume-schema";
import type { Profile } from "@/data/resume-schema";
import { MapPin, Globe, Mail, Github, Linkedin, Code2 } from "lucide-react";

interface CharacterCardProps {
  personal: CurriculumVitae["personal"];
  currentTitle?: string;
}

// Map network names to icons
const networkIcons: Record<Profile["network"], typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  LeetCode: Code2,
};

export function CharacterCard({ personal, currentTitle }: CharacterCardProps) {
  return (
    <div className="game-panel pixel-border pixel-border-cyan">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="character-avatar overflow-hidden">
            <Image
              src={personal.avatar}
              alt={personal.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              style={{ imageRendering: "auto" }}
            />
          </div>
          {/* Level badge */}
          <div className="absolute -bottom-1 -right-1 bg-game-yellow text-black px-1 py-0.5 text-[0.4rem] font-bold">
            LV.25
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="game-text-lg text-game-cyan mb-1 truncate">
            {personal.name}
          </h1>
          <p className="game-text-sm text-game-yellow mb-2">
            {currentTitle || personal.about}
          </p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 game-text-xs text-gray-400">
              <MapPin className="w-3 h-3 text-game-magenta" />
              <span>{personal.location.city}, {personal.location.country}</span>
            </div>
            <div className="flex items-center gap-2 game-text-xs text-gray-400">
              <Globe className="w-3 h-3 text-game-cyan" />
              <span className="truncate">{personal.url.replace("https://", "")}</span>
            </div>
            <div className="flex items-center gap-2 game-text-xs text-gray-400">
              <Mail className="w-3 h-3 text-game-green" />
              <span className="truncate">{personal.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-700">
        <div className="flex flex-wrap gap-2">
          {personal.profiles.map((profile) => {
            const Icon = networkIcons[profile.network];
            return (
              <a
                key={profile.network}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="skill-tag flex items-center gap-1.5 hover:border-game-cyan hover:text-game-cyan transition-colors"
              >
                <Icon className="w-3 h-3" />
                <span>{profile.network}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

