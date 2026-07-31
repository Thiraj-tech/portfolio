"use client";

import { useHeroTransition } from "./HeroTransitionContext";

export default function AboutScrollAnchor() {
  const { aboutRef } = useHeroTransition();
  return <span ref={aboutRef} aria-hidden className="absolute inset-x-0 top-0 h-px" />;
}
