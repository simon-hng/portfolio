import type { ReactNode } from "react";
import type { CurriculumVitae } from "@/data/resume-schema";

export interface CommandResult {
  output: ReactNode;
  isError?: boolean;
  action?: "clear" | "open-url" | "toggle-canvas" | "set-username" | "prompt-username";
  url?: string;
  username?: string;
}

export type CommandHandler = (args: string[], data: CurriculumVitae) => CommandResult;

// Extended context for async commands
export interface CommandContext {
  data: CurriculumVitae;
  username: string | null;
  getOnlineUsers: () => Promise<Array<{
    session_id: string;
    username: string;
    last_command: string | null;
    last_seen: string;
  }>>;
  getGuestbookEntries: () => Promise<Array<{
    id: string;
    username: string;
    message: string;
    created_at: string;
  }>>;
  addGuestbookEntry: (message: string) => Promise<void>;
  getCanvasAscii: () => string;
}

export type AsyncCommandHandler = (
  args: string[],
  ctx: CommandContext
) => Promise<CommandResult> | CommandResult;

function formatDate(date: string | Date): string {
  if (date === "present") return "Present";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatIdleTime(lastSeen: string): string {
  const now = Date.now();
  const seen = new Date(lastSeen).getTime();
  const diff = Math.floor((now - seen) / 1000);

  if (diff < 10) return "active";
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  return `${Math.floor(diff / 3600)}h`;
}

function formatGuestbookDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Async commands that need network access
export const asyncCommands: Record<string, AsyncCommandHandler> = {
  who: async (_, ctx) => {
    try {
      const users = await ctx.getOnlineUsers();

      if (users.length === 0) {
        return {
          output: `
╭─────────────────────────────────────────────────────────────╮
│  No users currently online                                   
╰─────────────────────────────────────────────────────────────╯

You might be the first one here! Others will appear when they join.`,
        };
      }

      const header = `USER              TTY      LAST_CMD              IDLE`;
      const divider = `─`.repeat(60);
      const rows = users.map((u) => {
        const username = u.username.padEnd(16).slice(0, 16);
        const tty = "pts/0".padEnd(8);
        const lastCmd = (u.last_command || "-").padEnd(20).slice(0, 20);
        const idle = formatIdleTime(u.last_seen);
        return `${username}  ${tty}  ${lastCmd}  ${idle}`;
      });

      return {
        output: `
╭─────────────────────────────────────────────────────────────╮
│  Online Users (${users.length})                                          
├─────────────────────────────────────────────────────────────┤
│  ${header}
│  ${divider}
${rows.map((r) => `│  ${r}`).join("\n")}
╰─────────────────────────────────────────────────────────────╯`,
      };
    } catch (error) {
      return {
        output: "Failed to fetch online users. Please try again.",
        isError: true,
      };
    }
  },

  guestbook: async (args, ctx) => {
    // Handle 'guestbook add <message>'
    if (args[0] === "add") {
      const message = args.slice(1).join(" ");

      if (!message) {
        return {
          output: `Usage: guestbook add <message>

Example: guestbook add Hello from NYC!`,
          isError: true,
        };
      }

      if (!ctx.username) {
        return {
          output: "You need a username to add guestbook entries. Choose one now:",
          action: "prompt-username",
        };
      }

      if (message.length > 200) {
        return {
          output: "Message too long. Maximum 200 characters.",
          isError: true,
        };
      }

      try {
        await ctx.addGuestbookEntry(message);
        return {
          output: `
╭─────────────────────────────────────────────────────────────╮
│  Entry added to guestbook!                                   
│                                                              
│  "${message.slice(0, 50)}${message.length > 50 ? "..." : ""}"
│  — ${ctx.username}                                           
╰─────────────────────────────────────────────────────────────╯

Type 'guestbook' to see all entries.`,
        };
      } catch (error) {
        return {
          output: "Failed to add guestbook entry. Please try again.",
          isError: true,
        };
      }
    }

    // Show guestbook entries
    try {
      const entries = await ctx.getGuestbookEntries();

      if (entries.length === 0) {
        return {
          output: `
╭─────────────────────────────────────────────────────────────╮
│  Guestbook                                                   
├─────────────────────────────────────────────────────────────┤
│  No entries yet. Be the first!                               
│                                                              
│  Usage: guestbook add <message>                              
╰─────────────────────────────────────────────────────────────╯`,
        };
      }

      const entryLines = entries.slice(0, 20).map((e) => {
        const date = formatGuestbookDate(e.created_at);
        return `│  [${date}] ${e.username}: ${e.message.slice(0, 40)}${e.message.length > 40 ? "..." : ""}`;
      });

      return {
        output: `
╭─────────────────────────────────────────────────────────────╮
│  Guestbook (${entries.length} ${entries.length === 1 ? "entry" : "entries"})                                         
├─────────────────────────────────────────────────────────────┤
${entryLines.join("\n")}
├─────────────────────────────────────────────────────────────┤
│  Leave a message: guestbook add <your message>               
╰─────────────────────────────────────────────────────────────╯`,
      };
    } catch (error) {
      return {
        output: "Failed to fetch guestbook entries. Please try again.",
        isError: true,
      };
    }
  },

  name: async (args, ctx) => {
    if (args.length === 0) {
      if (ctx.username) {
        return {
          output: `Your current username: ${ctx.username}

To change it: name <new_username>`,
        };
      }
      return {
        output: `Usage: name <username>

Set or change your username. 3-20 characters, letters, numbers, and underscores only.`,
      };
    }

    const newUsername = args[0].toLowerCase();

    // Validate username
    if (newUsername.length < 3) {
      return {
        output: "Username must be at least 3 characters.",
        isError: true,
      };
    }
    if (newUsername.length > 20) {
      return {
        output: "Username must be 20 characters or less.",
        isError: true,
      };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      return {
        output: "Username can only contain letters, numbers, and underscores.",
        isError: true,
      };
    }

    return {
      output: `Username set to: ${newUsername}`,
      action: "set-username",
      username: newUsername,
    };
  },

  draw: async (args, ctx) => {
    if (args[0] === "export") {
      const ascii = ctx.getCanvasAscii();
      return {
        output: `Canvas Export (64x32):
┌${"─".repeat(64)}┐
${ascii
  .split("\n")
  .map((line) => `│${line}│`)
  .join("\n")}
└${"─".repeat(64)}┘

Copy the above ASCII art!`,
      };
    }

    if (args[0] === "clear") {
      if (!ctx.username) {
        return {
          output: "You need a username to clear pixels. Choose one now:",
          action: "prompt-username",
        };
      }
      return {
        output: "Clearing your pixels from the canvas...",
        action: "toggle-canvas",
      };
    }

    // Drawing requires a username
    if (!ctx.username) {
      return {
        output: `Opening collaborative canvas...

You can view and navigate the canvas, but you'll need a username to draw.
Set one with: name <username>

Controls:
  • Arrow keys to move cursor
  • ESC or 'draw' again to close`,
        action: "toggle-canvas",
      };
    }

    return {
      output: `Opening collaborative canvas...

Controls:
  • Arrow keys to move cursor
  • Type any character to place it
  • Backspace/Delete to erase
  • ESC or 'draw' again to close

Commands:
  draw          - Toggle canvas
  draw export   - Export as ASCII text
  draw clear    - Clear your pixels`,
      action: "toggle-canvas",
    };
  },
};

// Sync commands (original)
export const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: `Available commands:

  PORTFOLIO
  ─────────────────────────────────────────────────────────
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

  COLLABORATIVE
  ─────────────────────────────────────────────────────────
  name        - Set or change your username
  who         - See who's online right now
  guestbook   - View/add guestbook entries
  draw        - Open collaborative ASCII canvas

  SYSTEM
  ─────────────────────────────────────────────────────────
  clear       - Clear terminal
  help        - Show this help
  
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

  // Check if it's an async command (will be handled separately)
  if (asyncCommands[command]) {
    return { output: "Loading...", action: undefined };
  }

  return {
    output: `Command not found: ${command}\nType 'help' for available commands.`,
    isError: true,
  };
}

export async function executeAsyncCommand(
  input: string,
  ctx: CommandContext
): Promise<CommandResult | null> {
  const trimmed = input.trim().toLowerCase();
  const [command, ...args] = trimmed.split(/\s+/);

  if (!command) {
    return null;
  }

  const handler = asyncCommands[command];
  if (handler) {
    return await handler(args, ctx);
  }

  return null;
}

export function isAsyncCommand(command: string): boolean {
  return command in asyncCommands;
}
