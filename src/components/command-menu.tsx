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
import { FileText, Heart } from "lucide-react";
import { DialogDescription, DialogTitle } from "./ui/dialog";

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
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">menu</DialogTitle>
      <DialogDescription className="hidden">
        Press Cmd/Ctrl + J to open
      </DialogDescription>
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
              Print CV
            </span>
          </CommandItem>

          {!!email && (
            <>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  window.open(
                    `mailto:${email}?subject=${encodeURIComponent(
                      "Hello from your website!",
                    )}`,
                  );
                }}
              >
                <span className="flex gap-2">
                  <Heart />
                  Say hello
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
  );
};
