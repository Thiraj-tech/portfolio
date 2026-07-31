"use client";

import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { navLinks } from "./navLinks";
import { useHeroTransition } from "./HeroTransitionContext";

const traits = ["Creative", "Reliable", "Strategist", "Builder", "Efficient"];
const leftNav = navLinks.slice(0, 2);
const rightNav = navLinks.slice(2);

export default function Hero() {
  const { heroRef, pastHero, scrollYProgress } = useHeroTransition();
  const prefersReducedMotion = useReducedMotion();

  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const photoBlur = useTransform(scrollYProgress, (v) => `blur(${v * 28}px)`);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);

  const wordmarkOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 0]);
  const wordmarkBlur = useTransform(
    scrollYProgress,
    (v) => `blur(${v * 20}px)`,
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden lg:-ml-64 lg:w-[calc(100%+16rem)]"
    >
      {/* ---------- Desktop: full-bleed cinematic hero ----------
          The section itself (not just its content) cancels the sidebar's
          reserved column and bleeds to the full viewport width — doing the
          bleed here, not on an inner div, keeps this section's own
          overflow-hidden clip boundary aligned with that full-bleed edge,
          so the in-hero nav row (which sits close to the left edge) isn't
          clipped. The in-hero nav row, brand badge, LinkedIn icon, stat
          cards, and "Hire Me" CTA share layoutIds with their Sidebar
          counterparts (see Sidebar.tsx) — Framer Motion morphs them into
          the fixed sidebar as the visitor scrolls past. */}
      <div className="relative hidden min-h-[92vh] flex-col lg:flex">
        <motion.span
          aria-hidden
          className="bg-wordmark top-4"
          style={
            prefersReducedMotion
              ? undefined
              : { opacity: wordmarkOpacity, filter: wordmarkBlur }
          }
        >
          THIRAJ
        </motion.span>

        {!pastHero && (
          <nav className="relative z-40 flex items-center justify-between px-16 pt-10 text-sm font-semibold tracking-wide">
            <div className="flex items-center gap-8">
              <motion.a
                layoutId="brand-badge"
                href="#hero"
                className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold tracking-tight text-ink"
              >
                THIRAJ
              </motion.a>
              <ul className="flex gap-8">
                {leftNav.map((link) => (
                  <li key={link.href}>
                    <motion.a
                      layoutId={`navlink-${link.href}`}
                      href={link.href}
                      className="transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-8">
              <ul className="flex gap-8">
                {rightNav.map((link) => (
                  <li key={link.href}>
                    <motion.a
                      layoutId={`navlink-${link.href}`}
                      href={link.href}
                      className="transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.a
                layoutId="linkedin-icon"
                href="https://linkedin.com/in/thiraj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-cream transition-opacity hover:opacity-80"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.4 8.24h4.37v2.01h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V23h-4.56v-6.87c0-1.64-.03-3.75-2.29-3.75-2.29 0-2.64 1.79-2.64 3.63V23H8.4V8.24z" />
                </svg>
              </motion.a>
            </div>
          </nav>
        )}

        <div className="relative z-10 flex flex-1 items-end justify-center">
          <motion.div
            style={
              prefersReducedMotion
                ? { opacity: pastHero ? 0.3 : 1 }
                : {
                    scale: photoScale,
                    filter: photoBlur,
                    opacity: photoOpacity,
                  }
            }
            className={
              prefersReducedMotion
                ? "transition-opacity duration-500"
                : undefined
            }
          >
            <Image
              src="/portrait.png"
              alt="Thiraj Hettiarachchi"
              width={846}
              height={914}
              priority
              className="relative z-10 h-[100vh] w-auto object-contain object-bottom"
            />
          </motion.div>

          {!pastHero && (
            <div className="absolute bottom-28 left-16 z-40 flex flex-col gap-4">
              <motion.div
                layoutId="stat-projects"
                className="flex items-center gap-3 rounded-2xl bg-cream-card/80 px-5 py-4 backdrop-blur-sm"
              >
                <span className="font-display text-3xl font-bold text-yellow">
                  15+
                </span>
                <span className="text-sm leading-tight font-medium">
                  Client
                  <br />
                  Projects
                </span>
              </motion.div>
              <motion.div
                layoutId="stat-years"
                className="rounded-2xl bg-cream-card/80 px-5 py-4 text-center backdrop-blur-sm"
              >
                <div className="font-display text-3xl font-bold text-yellow">
                  6+
                </div>
                <div className="text-sm font-medium">
                  Years of
                  <br />
                  experience
                </div>
              </motion.div>
            </div>
          )}

          {/* Trait tags, right */}
          <ul className="absolute top-1/3 right-16 z-20 flex flex-col gap-3">
            {traits.map((trait) => (
              <li
                key={trait}
                className="flex items-center gap-2 rounded-full bg-cream-card/80 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
              >
                <span aria-hidden className="h-2 w-2 rounded-sm bg-yellow" />
                {trait}
              </li>
            ))}
          </ul>

          {/* Headline + CTAs, overlapping the portrait */}
          <div className="absolute inset-x-0 bottom-36 z-30 px-6 text-center">
            <h1 className="font-display text-6xl leading-[0.95] font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] xl:text-7xl">
              Code, Applied
              <br />
              Differently.
            </h1>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {!pastHero && (
                <motion.a
                  layoutId="cta-hire"
                  href="#contact"
                  className="rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
                >
                  Hire Me for a Project
                </motion.a>
              )}
              <a
                href="#about"
                className="rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
              >
                About Me
              </a>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex items-end justify-between gap-6 px-16 pb-10">
          <p className="text-lg font-medium">
            The Full Stack Expert.
            <br />
            That&apos;s Thiraj.
          </p>
          <p className="max-w-sm text-right text-ink-muted">
            Working closely with your team to ship platforms that merge
            reliability, clean engineering, and long-term value.
          </p>
        </div>
      </div>

      {/* ---------- Mobile / tablet: simple stacked hero ---------- */}
      <div className="px-6 pt-28 pb-16 lg:hidden">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-cream-card px-4 py-1.5 text-sm text-ink-muted">
          <span className="animate-pulse-dot h-2 w-2 rounded-full bg-green-600" />
          Available for freelance &amp; open to full-time roles
        </div>

        <p className="mb-3 font-mono text-sm tracking-widest text-ink-muted uppercase">
          Full Stack Engineer. That&apos;s Thiraj.
        </p>
        <h1 className="font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl">
          Code, Applied
          <br />
          <span className="bg-yellow px-2">Differently.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-ink-muted">
          6+ years shipping production e-commerce platforms — Laravel, React,
          Python — handling up to $2M in monthly transaction volume.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#contact"
            className="rounded-full bg-ink px-6 py-3 font-display font-bold text-cream transition-opacity hover:opacity-85"
          >
            Hire Me for a Project
          </a>
          <a
            href="#projects"
            className="rounded-full border border-ink/20 px-6 py-3 font-display font-bold text-ink transition-colors hover:bg-cream-card"
          >
            View My Work
          </a>
        </div>

        <div className="relative mx-auto mt-10 w-full max-w-xs">
          <Image
            src="/portrait.png"
            alt="Thiraj Hettiarachchi"
            width={846}
            height={914}
            priority
            className="relative mx-auto h-auto w-full max-w-[280px] object-contain"
          />
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-t border-ink/10 pt-8">
          <div>
            <dt className="text-sm text-ink-muted">Years of experience</dt>
            <dd className="font-display text-3xl font-bold">6+</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Client projects</dt>
            <dd className="font-display text-3xl font-bold">15+</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">Monthly volume</dt>
            <dd className="font-display text-3xl font-bold">$2M+</dd>
          </div>
        </dl>

        <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {traits.map((trait) => (
            <li
              key={trait}
              className="font-mono text-sm tracking-widest text-ink-muted uppercase"
            >
              {trait}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
