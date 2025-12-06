import type { ReactNode } from "react";
import type { CurriculumVitae } from "@/data/resume-schema";

export interface CommandResult {
  output: ReactNode;
  isError?: boolean;
  action?: "clear" | "open-url";
  url?: string;
}

export type CommandHandler = (args: string[], data: CurriculumVitae) => CommandResult;

function formatDate(date: string | Date): string {
  if (date === "present") return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: `Available commands:

  whoami      - About me
  work        - Work experience
  education   - Education history
  skills      - Technical skills
  projects    - Project showcase
  activities  - Leadership & activities
  awards      - Honors & awards
  contact     - Contact information
  blog        - List blog posts
  cv          - Open PDF resume
  clear       - Clear terminal
  
Type any command to get started. Use ↑/↓ to navigate history.`,
  }),

  whoami: (_, data) => ({
    output: `
╭─────────────────────────────────────────────────────────────╮
│  ${data.personal.name}                                              
│  ${data.personal.about}                                             
├─────────────────────────────────────────────────────────────┤
│  Location: ${data.personal.location.city}, ${data.personal.location.country}
│  Email:    ${data.personal.email}
│  Website:  ${data.personal.url}
╰─────────────────────────────────────────────────────────────╯

Type 'contact' for social links or 'work' to see my experience.`,
  }),

  about: (args, data) => commands.whoami(args, data),

  work: (_, data) => {
    const workOutput = data.work
      .map(
        (job) => `
┌─ ${job.organization} ─────────────────────────────────
│  ${job.position}
│  ${job.location} | ${formatDate(job.startDate)} - ${formatDate(job.endDate)}
│
${job.highlights.map((h) => `│  • ${h}`).join("\n")}
└────────────────────────────────────────────────────────`
      )
      .join("\n");

    return { output: workOutput };
  },

  education: (_, data) => {
    const eduOutput = data.education
      .map(
        (edu) => `
┌─ ${edu.institution} ─────────────────────────────────
│  ${edu.studyType} in ${edu.area}
│  ${edu.location} | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
│
${(edu.highlights ?? []).map((h) => `│  • ${h}`).join("\n")}
└────────────────────────────────────────────────────────`
      )
      .join("\n");

    return { output: eduOutput };
  },

  skills: (_, data) => {
    const skillsOutput = data.skills
      .map(
        (category) => `
[${category.category}]
  ${category.skills.join(" • ")}`
      )
      .join("\n");

    return { output: skillsOutput };
  },

  projects: (_, data) => {
    const projectsOutput = data.projects
      .slice(0, 6)
      .map(
        (project) => `
┌─ ${project.name} ─────────────────────────────────
│  ${project.affiliation !== "none" ? `Affiliation: ${project.affiliation}` : "Personal Project"}
│  ${project.url}
│
${project.highlights.map((h) => `│  • ${h}`).join("\n")}
│
│  Tags: ${(project.keywords ?? []).join(", ")}
└────────────────────────────────────────────────────────`
      )
      .join("\n");

    return { output: projectsOutput };
  },

  activities: (_, data) => {
    const activitiesOutput = data.affiliations
      .map(
        (aff) => `
┌─ ${aff.organization} ─────────────────────────────────
│  ${aff.position}
│  ${aff.location} | ${formatDate(aff.startDate)} - ${formatDate(aff.endDate)}
│
${aff.highlights.map((h) => `│  • ${h}`).join("\n")}
└────────────────────────────────────────────────────────`
      )
      .join("\n");

    return { output: activitiesOutput };
  },

  awards: (_, data) => {
    const awardsOutput = data.awards
      .map(
        (award) => `
┌─ ${award.title} ─────────────────────────────────
│  Issuer: ${award.issuer}
│  ${award.location} | ${formatDate(award.date)}
│
${award.highlights.map((h) => `│  • ${h}`).join("\n")}
└────────────────────────────────────────────────────────`
      )
      .join("\n");

    return { output: awardsOutput };
  },

  contact: (_, data) => ({
    output: `
╭─────────────────────────────────────────────────────────────╮
│  Contact Information                                         
├─────────────────────────────────────────────────────────────┤
│  Email:    ${data.personal.email}
│  Website:  ${data.personal.url}
│  Location: ${data.personal.location.city}, ${data.personal.location.country}
├─────────────────────────────────────────────────────────────┤
│  Social Links:
${data.personal.profiles.map((p) => `│    ${p.network.padEnd(10)} → ${p.url}`).join("\n")}
╰─────────────────────────────────────────────────────────────╯

Feel free to reach out!`,
  }),

  cv: () => ({
    output: "Opening CV in new tab...",
    action: "open-url",
    url: "/cv.pdf",
  }),

  clear: () => ({
    output: "",
    action: "clear",
  }),

  blog: (args) => {
    if (args.length > 0) {
      // Reading a specific blog post - this will be handled by the terminal component
      return {
        output: `Loading blog post: ${args[0]}...`,
      };
    }
    
    return {
      output: `
╭─────────────────────────────────────────────────────────────╮
│  Blog Posts                                                  
├─────────────────────────────────────────────────────────────┤
│  No posts yet. Check back soon!
│
│  Or visit /blog for the full blog experience.
╰─────────────────────────────────────────────────────────────╯

Usage: blog <slug> - Read a specific post`,
    };
  },
};

export function executeCommand(input: string, data: CurriculumVitae): CommandResult {
  const trimmed = input.trim().toLowerCase();
  const [command, ...args] = trimmed.split(/\s+/);

  if (!command) {
    return { output: "" };
  }

  const handler = commands[command];
  if (handler) {
    return handler(args, data);
  }

  return {
    output: `Command not found: ${command}\nType 'help' for available commands.`,
    isError: true,
  };
}
