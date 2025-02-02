"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurRevealProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export const BlurReveal = ({
  children,
  duration = 0.5,
  delay = 0,
}: BlurRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        filter: "blur(10px)",
        transform: "translateY(20px)",
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        filter: isInView ? "blur(0px)" : "blur(10px)",
        transform: isInView ? "translateY(0px)" : "translateY(20px)",
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};
