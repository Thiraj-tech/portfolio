"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { navLinks } from "./navLinks";

const leftNav = navLinks.slice(0, 2);
const rightNav = navLinks.slice(2);

export default function TopNav() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const scrollOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const scrollBlur = useTransform(scrollY, [0, 120], [0, 14]);

  const entrance = useMotionValue(0);
  const opacity = useTransform(() => entrance.get() * scrollOpacity.get());
  const filter = useTransform(
    () => `blur(${(1 - entrance.get()) * 16 + scrollBlur.get()}px)`,
  );
  const pointerEvents = useTransform(opacity, (v) => (v > 0.05 ? "auto" : "none"));

  useEffect(() => {
    if (prefersReducedMotion) {
      entrance.set(1);
      return;
    }
    const controls = animate(entrance, 1, {
      type: "spring",
      stiffness: 190,
      damping: 24,
    });
    return () => controls.stop();
  }, [prefersReducedMotion, entrance]);

  return (
    <motion.nav
      style={
        prefersReducedMotion ? undefined : { opacity, filter, pointerEvents }
      }
      className="relative z-40 flex items-center justify-between px-16 pt-10 text-sm font-semibold tracking-wide"
    >
      <div className="flex items-center gap-8">
        <a
          href="#hero"
          className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold tracking-tight text-ink"
        >
          THIRAJ
        </a>
        <ul className="flex gap-8">
          {leftNav.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-8">
        <ul className="flex gap-8">
          {rightNav.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/blog/" className="transition-opacity hover:opacity-60">
              Blog
            </Link>
          </li>
        </ul>
        <a
          href="https://linkedin.com/in/thiraj"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-cream transition-opacity hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.4 8.24h4.37v2.01h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-6.87c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V23H8.4V8.24z" />
          </svg>
        </a>
      </div>
    </motion.nav>
  );
}
