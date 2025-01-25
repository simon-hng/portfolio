import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium ring-1 cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/80 text-primary-foreground ring-primary-foreground/10",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground ring-secondary-foreground/10",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground ring-destructive-foreground/10",
        outline: "text-foreground",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
