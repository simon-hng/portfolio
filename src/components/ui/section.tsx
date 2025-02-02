import { cn } from "@/lib/utils";
import React from "react";
import { BlurReveal, BlurRevealProps } from "../blur-reveal";

export type Props = React.HTMLAttributes<HTMLDivElement> & BlurRevealProps;

export function Section({ className, delay, ...props }: Props) {
  return (
    <BlurReveal delay={delay}>
      <section
        className={cn("flex min-h-0 flex-col gap-6", className)}
        {...props}
      />
    </BlurReveal>
  );
}
