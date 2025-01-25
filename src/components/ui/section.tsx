import { cn } from "@/lib/utils";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Section({ className, ...props }: BadgeProps) {
  return (
    <section
      className={cn("flex min-h-0 flex-col gap-6", className)}
      {...props}
    />
  );
}
