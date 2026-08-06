import type { Transition } from "motion/react";

export const springy: Transition = { type: "spring", stiffness: 420, damping: 30 };

export const hoverLift = { y: -2, scale: 1.02 };
export const tapScale = { scale: 0.96 };
