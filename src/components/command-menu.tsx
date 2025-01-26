"use client";

import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Profile } from "@/data/resume-schema";
import { SocialIcon } from "./social-icon";
import { Briefcase, FileText, Flame } from "lucide-react";

interface Props {
  links: { url: string; title: Profile["network"] }[];
  email?: string;
}

export const CommandMenu = ({ links, email }: Props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="border-t-muted bg-background fixed bottom-0 left-0 right-0 w-full border-t p-1"
      >
        <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
          Open the command menu with
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>{" "}
          or tap here
        </p>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.open("/cv.pdf", "_blank");
              }}
            >
              <span className="flex gap-2">
                <FileText />
                Print
              </span>
            </CommandItem>

            {!!email && (
              <>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    window.open(
                      `mailto:${email}?subject=${encodeURIComponent(
                        "You're hired",
                      )}&${encodeURIComponent(
                        "I love your CV and I want to see you.",
                      )}`,
                    );
                  }}
                >
                  <span className="flex gap-2">
                    <Briefcase />
                    Hire me
                  </span>
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    window.open(
                      `mailto:${email}?subject=${encodeURIComponent(
                        "You're fired",
                      )}&${encodeURIComponent(
                        "I hate your CV and I never want to see you again.",
                      )}`,
                    );
                  }}
                >
                  <span className="flex gap-2">
                    <Flame />
                    Fire me
                  </span>
                </CommandItem>
              </>
            )}
          </CommandGroup>

          <CommandGroup heading="Links">
            {links.map(({ url, title }) => (
              <CommandItem
                key={url}
                onSelect={() => {
                  setOpen(false);
                  window.open(url, "_blank");
                }}
              >
                <span className="flex gap-2">
                  <SocialIcon social={title} />
                  {title}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};
