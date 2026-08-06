"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

type MilestoneSparkProps = {
  className?: string;
};

export default function MilestoneSpark({ className }: MilestoneSparkProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -50% 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <span ref={ref} aria-hidden className={`relative block ${className ?? ""}`}>
      <span className="absolute inset-0 rounded-full bg-yellow ring-4 ring-cream" />
      {!prefersReducedMotion &&
        SPARK_ANGLES.map((angle) => (
          <motion.span
            key={angle}
            className="absolute top-1/2 left-1/2 -mt-px h-[2px] w-3 origin-left rounded-full bg-yellow"
            style={{
              rotate: angle,
              boxShadow: "0 0 6px 1px rgba(255, 255, 35, 0.85)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              isInView
                ? { scaleX: [0, 1, 0.3], opacity: [0, 1, 0] }
                : { scaleX: 0, opacity: 0 }
            }
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}
    </span>
  );
}
