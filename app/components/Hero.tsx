"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useHeroTransition } from "./HeroTransitionContext";
import { hoverLift, springy, tapScale } from "./motionPresets";
import Reveal from "./Reveal";
import TopNav from "./TopNav";

const traits = ["Creative", "Reliable", "Strategist", "Builder", "Efficient"];

const heroGroupVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 28 },
  },
};

// Top-level load sequence: wordmark, then portrait, then everything else.
const heroSequenceVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.4, delayChildren: 0.1 } },
};

const wordmarkVariants = {
  hidden: { opacity: 0, top: "-6rem" },
  show: {
    opacity: 1,
    top: "1rem",
    transition: { type: "spring" as const, stiffness: 190, damping: 24 },
  },
};

const photoVariants = {
  hidden: { opacity: 0, y: 140 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 170, damping: 22 },
  },
};

export default function Hero() {
  const { heroRef, scrollYProgress } = useHeroTransition();
  const prefersReducedMotion = useReducedMotion();

  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const photoBlur = useTransform(scrollYProgress, (v) => `blur(${v * 28}px)`);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);

  const wordmarkScrollOpacity = useTransform(scrollYProgress, [0, 1], [0.7, 0]);
  const wordmarkBlur = useTransform(
    scrollYProgress,
    (v) => `blur(${v * 20}px)`,
  );
  const wordmarkEntrance = useMotionValue(0);
  const wordmarkOpacity = useTransform(
    () => wordmarkEntrance.get() * wordmarkScrollOpacity.get(),
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      wordmarkEntrance.set(1);
      return;
    }
    const controls = animate(wordmarkEntrance, 1, {
      type: "spring",
      stiffness: 190,
      damping: 24,
      delay: 0.1,
    });
    return () => controls.stop();
  }, [prefersReducedMotion, wordmarkEntrance]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative overflow-hidden lg:-ml-64 lg:w-[calc(100%+16rem)]"
    >
      {/* ---------- Desktop: full-bleed cinematic hero ----------
          The section itself (not just its content) cancels the sidebar's
          reserved column and bleeds to the full viewport width. TopNav (an
          inline, non-fixed navbar) covers navigation while the hero is on
          screen and fades out on scroll; the fixed Sidebar (see
          Sidebar.tsx) crossfades in as the About section comes into view,
          so the two never overlap. */}
      <motion.div
        variants={heroSequenceVariants}
        initial="hidden"
        animate="show"
        className="relative hidden h-screen flex-col lg:flex"
      >
        <TopNav />

        <motion.span
          aria-hidden
          variants={wordmarkVariants}
          className="bg-wordmark"
          style={
            prefersReducedMotion
              ? undefined
              : { opacity: wordmarkOpacity, filter: wordmarkBlur }
          }
        >
          THIRAJ
        </motion.span>

        <motion.div
          variants={heroGroupVariants}
          className="relative z-10 flex min-h-0 flex-1 items-end justify-center"
        >
          <motion.div variants={photoVariants} className="h-[130%]">
            <motion.div
              className="h-full"
              style={{
                y: 112,
                ...(prefersReducedMotion
                  ? {}
                  : {
                      scale: photoScale,
                      filter: photoBlur,
                      opacity: photoOpacity,
                    }),
              }}
            >
              <Image
                src="/portrait.png"
                alt="Thiraj Hettiarachchi"
                width={846}
                height={914}
                priority
                className="relative z-10 h-full w-auto object-contain object-bottom"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={heroItemVariants}
            className="absolute bottom-28 left-16 z-40 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-cream-card/80 px-5 py-4 backdrop-blur-sm">
              <span className="font-display text-3xl font-bold text-yellow">
                15+
              </span>
              <span className="text-sm leading-tight font-medium">
                Client
                <br />
                Projects
              </span>
            </div>
            <div className="rounded-2xl bg-cream-card/80 px-5 py-4 text-center backdrop-blur-sm">
              <div className="font-display text-3xl font-bold text-yellow">
                6+
              </div>
              <div className="text-sm font-medium">
                Years of
                <br />
                experience
              </div>
            </div>
          </motion.div>

          {/* Trait tags, right */}
          <motion.ul
            variants={heroItemVariants}
            className="absolute top-1/3 right-16 z-20 flex flex-col gap-3"
          >
            {traits.map((trait) => (
              <li
                key={trait}
                className="flex items-center gap-2 rounded-full bg-cream-card/80 px-4 py-2 text-sm font-semibold backdrop-blur-sm"
              >
                <span aria-hidden className="h-2 w-2 rounded-sm bg-yellow" />
                {trait}
              </li>
            ))}
          </motion.ul>

          {/* Headline + CTAs, overlapping the portrait */}
          <motion.div
            variants={heroItemVariants}
            className="absolute inset-x-0 bottom-0 z-30 px-6 text-center"
          >
            <h1 className="font-display text-6xl leading-[0.95] font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] xl:text-7xl">
              Code, Applied
              <br />
              Differently.
            </h1>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <motion.a
                whileHover={hoverLift}
                whileTap={tapScale}
                transition={springy}
                href="#contact"
                className="rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
              >
                Hire Me for a Project
              </motion.a>
              <motion.a
                whileHover={hoverLift}
                whileTap={tapScale}
                transition={springy}
                href="#about"
                className="rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
              >
                About Me
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={heroItemVariants}
          className="relative z-20 flex items-end justify-between gap-6 px-16 pb-10"
        >
          <p className="text-lg font-medium">The Full Stack Engineer.</p>
          <p className="max-w-sm text-right text-ink-muted">
            Working closely with your team to ship platforms that merge
            reliability, clean engineering, and <br />
            long-term value.
          </p>
        </motion.div>
      </motion.div>

      {/* ---------- Mobile / tablet: cinematic stacked hero ----------
          Fills the screen (minus the fixed 4rem header) on load, like the
          desktop h-screen hero — dvh so it adapts fluidly as the viewport
          resizes rather than locking to a stale px height. */}
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col pt-10 lg:hidden">
        <div className="px-6">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-soft bg-cream-card px-4 py-1.5 text-sm text-ink-muted">
              <span className="animate-pulse-dot h-2 w-2 rounded-full bg-green-600" />
              Available for freelance &amp; open to full-time roles
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mb-3 font-mono text-sm tracking-widest text-ink-muted uppercase">
              Full Stack Engineer. That&apos;s Thiraj.
            </p>
          </Reveal>
        </div>

        {/* Photo as the hero moment, headline overlapping its base — mirrors
            the desktop's cinematic photo-first treatment. The image sits in
            a fixed aspect-ratio box so its crop stays constant no matter how
            tall the text below ends up; the text block flows normally
            (pulled up over the photo's bottom edge with a negative margin)
            instead of being absolutely positioned, so it can never get
            clipped — it just pushes the section taller when it needs to. */}
        <Reveal delay={140} className="relative mt-4 overflow-hidden bg-ink">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/portrait.png"
              alt="Thiraj Hettiarachchi"
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent"
            />
          </div>
          <div className="relative -mt-24 px-6 pb-8">
            <h1 className="font-display text-5xl leading-[1.1] font-bold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.5)] sm:text-6xl">
              Code, Applied
              <br />
              <span className="bg-yellow px-2 text-ink">Differently.</span>
            </h1>

            <p className="mt-4 max-w-lg text-lg text-cream/70">
              6+ years shipping production e-commerce platforms — Laravel,
              React, Python — handling up to $2M in monthly transaction
              volume.
            </p>

            <div className="mt-6 flex flex-nowrap gap-3">
              <motion.a
                whileTap={tapScale}
                transition={springy}
                href="#contact"
                className="flex-1 rounded-full bg-yellow px-3 py-3 text-center font-display text-xs font-bold text-ink transition-opacity hover:opacity-85 sm:px-6 sm:text-base"
              >
                Hire Me for a Project
              </motion.a>
              <motion.a
                whileTap={tapScale}
                transition={springy}
                href="#projects"
                className="flex-1 rounded-full bg-yellow px-3 py-3 text-center font-display text-xs font-bold text-ink transition-opacity hover:opacity-85 sm:px-6 sm:text-base"
              >
                View My Work
              </motion.a>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="px-6 pb-16 lg:hidden">
        <Reveal delay={300}>
          <div className="mt-12 grid grid-cols-3 gap-3 border-t border-ink/10 pt-8">
            <div className="rounded-2xl bg-cream-card py-4 text-center">
              <div className="font-display text-2xl font-bold text-yellow">
                6+
              </div>
              <div className="mt-1 text-xs text-ink-muted">Years exp.</div>
            </div>
            <div className="rounded-2xl bg-cream-card py-4 text-center">
              <div className="font-display text-2xl font-bold text-yellow">
                15+
              </div>
              <div className="mt-1 text-xs text-ink-muted">Projects</div>
            </div>
            <div className="rounded-2xl bg-cream-card py-4 text-center">
              <div className="font-display text-2xl font-bold text-yellow">
                $2M+
              </div>
              <div className="mt-1 text-xs text-ink-muted">Volume</div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={380}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {traits.map((trait) => (
              <li
                key={trait}
                className="flex items-center gap-2 rounded-full bg-cream-card px-4 py-2 text-sm font-semibold"
              >
                <span aria-hidden className="h-2 w-2 rounded-sm bg-yellow" />
                {trait}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
