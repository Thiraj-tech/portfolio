"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Optional stagger, in ms, for grouped elements entering together. */
  delay?: number;
};

/**
 * Scroll-triggered reveal wrapper built on motion's `whileInView`. Animates
 * once per element (`viewport={{ once: true }}`), and — via the root
 * `MotionConfig reducedMotion="user"` in HeroTransitionContext — collapses
 * to an instant opacity change when the visitor has reduced motion enabled.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 26,
        delay: delay / 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
