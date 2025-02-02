import { cn } from "@/lib/utils";
import React from "react";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function Section({ className, ...props }: Props) {
  return (
    <section
      className={cn("flex min-h-0 flex-col gap-6", className)}
      {...props}
    />
  );
}
