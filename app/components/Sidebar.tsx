"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { navLinks } from "./navLinks";
import { hoverLift, springy, tapScale } from "./motionPresets";
import { useHeroTransition } from "./HeroTransitionContext";

const DARK_SECTION_IDS = ["projects", "testimonials", "contact"];

type DarkMap = {
  profile: boolean;
  description: boolean;
  stat1: boolean;
  stat2: boolean;
  nav: boolean;
  email: boolean;
};

const INITIAL_DARK_MAP: DarkMap = {
  profile: false,
  description: false,
  stat1: false,
  stat2: false,
  nav: false,
  email: false,
};

export default function Sidebar() {
  const { aboutRef } = useHeroTransition();
  const [active, setActive] = useState("#hero");
  const [copied, setCopied] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [darkMap, setDarkMap] = useState<DarkMap>(INITIAL_DARK_MAP);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const stat1Ref = useRef<HTMLDivElement | null>(null);
  const stat2Ref = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const emailRef = useRef<HTMLButtonElement | null>(null);

  // Crossfades in as the About section comes into view — 0 when About's
  // middle reaches the bottom of the viewport, 1 once About's top reaches
  // the top of the viewport (About fully in view). Keeps the sidebar
  // transparent (and inert) while the hero's own TopNav is on screen, so
  // the two never visually overlap.
  const { scrollYProgress: revealProgress } = useScroll({
    target: aboutRef,
    offset: ["center end", "start start"],
  });
  const opacity = useTransform(revealProgress, [0, 1], [0, 1]);
  const blurPx = useTransform(revealProgress, [0, 1], [14, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  useMotionValueEvent(revealProgress, "change", (v) => {
    setInteractive(v > 0.97);
  });

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Each sidebar card is fixed on screen, so what's actually "behind" it
  // changes per-card as the page scrolls underneath — the top cards can be
  // over a light section while the lower ones are already over a black one.
  // Rather than one global light/dark flag, each card checks its own
  // document-space position (fixed viewport offset + scrollY) against the
  // dark sections' measured bounds, so each one flips independently right
  // as it crosses into (or out of) a dark section.
  useEffect(() => {
    let bounds: { top: number; bottom: number }[] = [];

    const computeBounds = () => {
      bounds = DARK_SECTION_IDS.map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return { top, bottom: top + rect.height };
        });
    };

    const isOverDark = (el: HTMLElement | null) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const docY = window.scrollY + rect.top + rect.height / 2;
      return bounds.some((b) => docY >= b.top && docY <= b.bottom);
    };

    let ticking = false;
    const check = () => {
      setDarkMap({
        profile: isOverDark(profileRef.current),
        description: isOverDark(descriptionRef.current),
        stat1: isOverDark(stat1Ref.current),
        stat2: isOverDark(stat2Ref.current),
        nav: isOverDark(navRef.current),
        email: isOverDark(emailRef.current),
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    const onResize = () => {
      computeBounds();
      check();
    };

    computeBounds();
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Dark sections like Projects/Testimonials render empty (zero height, or
    // absent entirely) until their Supabase fetch resolves, then pop in at
    // full height — which silently invalidates the bounds captured above.
    // Recompute whenever the page's total height actually changes, so a
    // card's dark/light state never gets stuck reading a stale section
    // position from before the content loaded.
    const resizeObserver = new ResizeObserver(() => {
      computeBounds();
      check();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
    };
  }, []);

  // Glass-vs-solid card treatment: over the black sections (Projects,
  // Testimonials/Clients, Contact) the sidebar cards fade to a translucent
  // frosted-glass look; everywhere else they stay the normal solid cream
  // cards. Border width stays constant (only its color fades) so nothing
  // shifts layout during the transition. A light (not black) tint is used
  // for the glass fill — the section behind is already black, so a dark
  // fill on top of it reads as flat and barely visible; a soft white tint
  // plus a lifted shadow is what actually reads as "glass" against black.
  const cardTransition =
    "border transition-[background-color,border-color,backdrop-filter,box-shadow,color] duration-500 ease-out";
  const glassCardClass = `${cardTransition} border-white/15 bg-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150`;
  const solidCardClass = `${cardTransition} border-transparent bg-cream-card shadow-[0_10px_30px_-12px_rgba(0,0,0,0),inset_0_1px_0_rgba(255,255,255,0)]`;
  const cardClass = (isDark: boolean) =>
    isDark ? glassCardClass : solidCardClass;
  const mutedClass = (isDark: boolean) =>
    isDark ? "text-cream/60" : "text-ink-muted";
  const navInactiveClass = (isDark: boolean) =>
    isDark
      ? "text-cream/60 hover:bg-white/10 hover:text-cream"
      : "text-ink-muted hover:bg-cream-card-2 hover:text-ink";
  const emailHoverClass = (isDark: boolean) =>
    isDark ? "hover:text-cream" : "hover:text-ink";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("thiraj.hettiarachchi@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <motion.aside
      style={{ opacity, filter }}
      inert={!interactive}
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col gap-2 overflow-hidden p-4 lg:flex"
    >
      <motion.div
        ref={profileRef}
        className={`flex items-center justify-between rounded-2xl px-4 py-3 ${cardClass(darkMap.profile)}`}
      >
        <motion.a
          whileHover={hoverLift}
          whileTap={tapScale}
          transition={springy}
          href="#hero"
          className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold tracking-tight text-ink"
        >
          THIRAJ
        </motion.a>
        <motion.a
          whileHover={hoverLift}
          whileTap={tapScale}
          transition={springy}
          href="https://linkedin.com/in/thiraj"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-cream"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.4 8.24h4.37v2.01h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-6.87c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V23H8.4V8.24z" />
          </svg>
        </motion.a>
      </motion.div>

      <motion.div
        ref={descriptionRef}
        className={`rounded-2xl px-4 py-2 text-sm ${mutedClass(darkMap.description)} ${cardClass(darkMap.description)}`}
      >
        Full stack engineer shipping production e-commerce platforms with clean,
        reliable code.
      </motion.div>

      <motion.div className="flex items-center gap-2">
        <div
          ref={stat1Ref}
          className={`flex-1 rounded-2xl py-3 text-center ${cardClass(darkMap.stat1)}`}
        >
          <div className="font-display text-2xl font-bold text-yellow">6+</div>
          <div className={`text-xs ${mutedClass(darkMap.stat1)}`}>
            Years exp.
          </div>
        </div>
        <div
          ref={stat2Ref}
          className={`flex-1 rounded-2xl py-3 text-center ${cardClass(darkMap.stat2)}`}
        >
          <div className="font-display text-2xl font-bold text-yellow">
            100+
          </div>
          <div className={`text-xs ${mutedClass(darkMap.stat2)}`}>Projects</div>
        </div>
      </motion.div>

      <motion.nav
        ref={navRef}
        className={`flex flex-col gap-1 rounded-2xl p-2 ${cardClass(darkMap.nav)}`}
      >
        {navLinks.map((link) => {
          const isActive = active === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-500 ${
                isActive ? "text-ink" : navInactiveClass(darkMap.nav)
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-nav-pill"
                  className="absolute inset-0 rounded-xl bg-yellow"
                  transition={springy}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          );
        })}
        <Link
          href="/blog/"
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-500 ${navInactiveClass(darkMap.nav)}`}
        >
          Blog
        </Link>
      </motion.nav>

      <motion.button
        ref={emailRef}
        whileHover={hoverLift}
        whileTap={tapScale}
        transition={springy}
        type="button"
        onClick={copyEmail}
        className={`flex items-center justify-between rounded-2xl px-4 py-2 text-left text-sm ${cardClass(darkMap.email)} ${mutedClass(darkMap.email)} ${emailHoverClass(darkMap.email)}`}
      >
        <span className="min-w-0 flex-1 truncate">
          thiraj.hettiarachchi@gmail.com
        </span>
        <span className="ml-2 shrink-0 font-mono text-xs">
          {copied ? "Copied" : "Copy"}
        </span>
      </motion.button>

      <motion.a
        whileHover={hoverLift}
        whileTap={tapScale}
        transition={springy}
        href="#contact"
        className="rounded-2xl bg-yellow py-3 text-center font-display font-bold text-ink"
      >
        Hire Me
      </motion.a>
    </motion.aside>
  );
}
