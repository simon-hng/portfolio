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
    <div className="bg-[hsl(220_15%_10%)] p-4 mb-4 border border-[hsl(220_10%_20%)]">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 border border-[hsl(220_10%_20%)] bg-[hsl(220_15%_10%)] overflow-hidden">
            <Image
              src={personal.avatar}
              alt={personal.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
              style={{ imageRendering: "auto" }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[0.75rem] leading-tight text-[hsl(142_71%_45%)] mb-1 truncate">
            {personal.name}
          </h1>
          <p className="text-[0.5rem] leading-snug text-gray-400 mb-2">
            {currentTitle || personal.about}
          </p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[0.4rem] leading-relaxed text-gray-500">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span>{personal.location.city}, {personal.location.country}</span>
            </div>
            <div className="flex items-center gap-2 text-[0.4rem] leading-relaxed text-gray-500">
              <Globe className="w-3 h-3 text-gray-500" />
              <span className="truncate">{personal.url.replace("https://", "")}</span>
            </div>
            <div className="flex items-center gap-2 text-[0.4rem] leading-relaxed text-gray-500">
              <Mail className="w-3 h-3 text-gray-500" />
              <span className="truncate">{personal.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="flex flex-wrap gap-2">
          {personal.profiles.map((profile) => {
            const Icon = networkIcons[profile.network];
            return (
              <a
                key={profile.network}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-1 text-[0.4rem] bg-transparent border border-[hsl(220_10%_20%)] m-0.5 text-[hsl(0_0%_60%)] hover:border-[hsl(142_71%_45%)] hover:text-[hsl(142_71%_45%)] transition-colors"
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
