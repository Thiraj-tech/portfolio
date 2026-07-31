"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { LayoutGroup, MotionConfig, useScroll, type MotionValue } from "motion/react";

type HeroTransitionValue = {
  heroRef: RefObject<HTMLElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  pastHero: boolean;
  scrollYProgress: MotionValue<number>;
};

const HeroTransitionContext = createContext<HeroTransitionValue | null>(null);

export function HeroTransitionProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  // Default to "at the hero" — matches how virtually every visit actually
  // starts (top of page). Starting `true` here caused every layoutId
  // element to mount once as the sidebar's version, then immediately
  // unmount and remount as the hero's version a moment after hydration —
  // too fast for Motion to capture the first render's rect, leaving those
  // elements stuck invisible. The IntersectionObserver still corrects this
  // instantly for the rare deep-link/restored-scroll case.
  const [pastHero, setPastHero] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["end end", "end start"],
  });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="hero-morph">
        <HeroTransitionContext.Provider
          value={{ heroRef, aboutRef, pastHero, scrollYProgress }}
        >
          {children}
        </HeroTransitionContext.Provider>
      </LayoutGroup>
    </MotionConfig>
  );
}

export function useHeroTransition() {
  const ctx = useContext(HeroTransitionContext);
  if (!ctx) {
    throw new Error("useHeroTransition must be used within a HeroTransitionProvider");
  }
  return ctx;
}
