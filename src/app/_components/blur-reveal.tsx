"use client";

import { motion } from "motion/react";
import { JSX } from "react";

export const CVContent: React.FC<{ sections: JSX.Element[] }> = ({
  sections,
}) => {
  return (
    <motion.div
      className="mx-auto flex w-full max-w-3xl flex-col gap-16"
      transition={{ staggerChildren: 0.1 }}
      initial="hidden"
      animate="show"
    >
      {sections.map((Section, index) => (
        <motion.div
          key={`section-${index}`}
          variants={{
            hidden: {
              opacity: 0,
              filter: "blur(10px)",
              y: 20,
            },
            show: {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              transition: {
                duration: 0.5,
                ease: "easeOut",
              },
            },
          }}
        >
          {Section}
        </motion.div>
      ))}
    </motion.div>
  );
};
