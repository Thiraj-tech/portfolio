import type { Transition } from "motion/react";

export const springy: Transition = { type: "spring", stiffness: 420, damping: 30 };

export const hoverLift = { y: -2, scale: 1.02 };
export const tapScale = { scale: 0.96 };

// Periodic "buzz" wiggle for an icon that should draw the eye every so
// often without being distracting — pair with an `animate` prop.
export const buzzRotate = { rotate: [0, -15, 12, -10, 8, -4, 0] };
export const buzzTransition: Transition = {
  duration: 0.6,
  repeat: Infinity,
  repeatDelay: 4,
  ease: "easeInOut",
};
