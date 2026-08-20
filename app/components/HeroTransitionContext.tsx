"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  animate,
  LayoutGroup,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";

type HeroTransitionValue = {
  heroRef: RefObject<HTMLElement | null>;
  aboutRef: RefObject<HTMLElement | null>;
  scrollYProgress: MotionValue<number>;
};

const HeroTransitionContext = createContext<HeroTransitionValue | null>(null);

// The moment a downward scroll leaves Hero, snap straight to About's clean
// view instead of drifting through the blend. Scrolling up is untouched
// (free to return to Hero).
const SNAP_TRIGGER_PROGRESS = 0.03;

export function HeroTransitionProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["end end", "end start"],
  });

  const lastProgress = useRef(0);
  const isSnapping = useRef(false);
  const scrollAnim = useMotionValue(0);

  // Clicking a nav link (`<a href="#...">`) starts the browser's own
  // smooth-scroll to that section, which necessarily passes through the same
  // "leaving Hero" scroll range the auto-snap below watches for. Without this
  // guard, the snap fires mid-navigation and redirects the scroll to About
  // regardless of which link was actually clicked — breaking every nav link
  // that points past Hero.
  useEffect(() => {
    let releaseTimer: number | undefined;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!anchor) return;
      isSnapping.current = true;
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(() => {
        isSnapping.current = false;
      }, 1500);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.clearTimeout(releaseTimer);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (isSnapping.current) return;

    const previous = lastProgress.current;
    lastProgress.current = value;

    const leavingHeroDownward =
      value > previous && previous < SNAP_TRIGGER_PROGRESS && value >= SNAP_TRIGGER_PROGRESS;

    if (leavingHeroDownward && value < 0.98 && aboutRef.current) {
      const targetY =
        window.scrollY + aboutRef.current.getBoundingClientRect().top;
      isSnapping.current = true;

      if (prefersReducedMotion) {
        window.scrollTo({ top: targetY, behavior: "instant" });
        isSnapping.current = false;
        return;
      }

      // Lock out native wheel/touch scrolling for the duration of the snap —
      // otherwise the user's still-active scroll gesture fights our
      // onUpdate's window.scrollTo calls frame-by-frame.
      const { style } = document.documentElement;
      const previousOverflow = style.overflow;
      style.overflow = "hidden";

      scrollAnim.set(window.scrollY);
      animate(scrollAnim, targetY, {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
        // `behavior: "instant"` is required here — globals.css sets
        // `scroll-behavior: smooth` on <html>, and without overriding it
        // per-call, the browser's own smooth-scroll re-targets itself on
        // every one of these onUpdate calls (60/sec), fighting our eased
        // animation and producing the stutter/"stuck" feeling.
        onUpdate: (latest) =>
          window.scrollTo({ top: latest, behavior: "instant" }),
        onComplete: () => {
          style.overflow = previousOverflow;
          isSnapping.current = false;
        },
      });
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="site-nav">
        <HeroTransitionContext.Provider
          value={{ heroRef, aboutRef, scrollYProgress }}
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
