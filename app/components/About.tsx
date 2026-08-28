"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import AboutScrollAnchor from "./AboutScrollAnchor";
import MilestoneSpark from "./MilestoneSpark";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type Milestone = {
  year: string;
  title: string;
  summary: string;
  detail: string;
  handle: string;
  time: string;
};

const milestones: Milestone[] = [
  {
    year: "'16",
    title: "Starting out in Dubai",
    summary:
      "IT support at a luxury resort with 500+ guests and staff depending on the network staying up.",
    detail:
      "Peak-season pressure, POS rollouts for three new restaurants, and security hardening that measurably cut incidents. Not writing much code yet, but learning what 'production' really means.",
    handle: "@dubai",
    time: "10 years ago",
  },
  {
    year: "'19",
    title: "First developer role",
    summary:
      "Joined WebTechno as a remote developer, going from support tickets to shipping real client work.",
    detail:
      "Custom themes and plugins across WordPress, Shopify, Wix, Squarespace, and GoDaddy for international clients — 15+ projects delivered end to end, from requirements to launch and support.",
    handle: "@webtechno",
    time: "7 years ago",
  },
  {
    year: "'21",
    title: "Levelling up",
    summary:
      "Started my HND in Computing while revamping a US sports nutrition brand's site — organic traffic grew 150% in six months.",
    detail:
      "SEO and performance work stopped being extras and became how I approach every build. Also began integrating third-party REST and GraphQL APIs to connect client platforms with external services.",
    handle: "@seo",
    time: "5 years ago",
  },
  {
    year: "'23",
    title: "Going full stack at Fexcon",
    summary:
      "Joined Fexcon to build and run large-scale e-commerce platforms in Laravel, Zend, and React.",
    detail:
      "RESTful APIs in PHP and Python supporting up to $2M in monthly transactions, five payment gateways integrated end to end, and Docker deployments across 100+ components. Started my BEng top-up the same year.",
    handle: "@fexcon",
    time: "3 years ago",
  },
  {
    year: "'24",
    title: "Engineering degree, done",
    summary:
      "Completed my BEng (Hons) in Software Engineering at London Metropolitan University — while working full-time.",
    detail:
      "Also shipped performance work that cut page load times 40% across 15 production websites, and built a cron-based automation framework now handling email and SMS notifications across all company platforms.",
    handle: "@londonmet",
    time: "2 years ago",
  },
  {
    year: "'26",
    title: "The journey continues",
    summary:
      "Same obsession, new tools — Claude Code, MCP servers, and LLM-assisted pipelines are now part of how I work every day.",
    detail:
      "AI has opened a whole new layer of what's possible for a small team shipping fast. The best work is still ahead.",
    handle: "@thiraj",
    time: "now",
  },
];

export default function About() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: railProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });

  // Scroll-linked, not one-shot: scrolling down slides JOURNEY in from the
  // right, scrolling back up slides it back out the same way it came.
  // Tracked against the wordmark itself (not the section) so the slide
  // finishes right as it actually scrolls into view, instead of drifting
  // mid-animation — which is what was clipping the trailing "Y" against
  // the section's overflow-hidden edge.
  const { scrollYProgress: journeyProgress } = useScroll({
    target: wordmarkRef,
    offset: ["start end", "start center"],
  });
  const journeyX = useTransform(journeyProgress, [0, 1], [400, 0]);

  return (
    <section
      id="about"
      className="relative scroll-mt-16 overflow-hidden pt-[10px] pb-24 lg:scroll-mt-0"
    >
      <AboutScrollAnchor />

      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Start small, grow big"
          title="About Me (&) My Journey"
          description="Ten years ago I was fixing resort networks in Dubai. Since then I've become a full stack developer building Laravel and React platforms for clients worldwide — the story's easier to show than explain."
        />

        <motion.span
          ref={wordmarkRef}
          aria-hidden
          style={{
            position: "static",
            display: "block",
            width: "fit-content",
            marginLeft: "auto",
            x: prefersReducedMotion ? 0 : journeyX,
          }}
          className="bg-wordmark mt-6"
        >
          JOURNEY
        </motion.span>

        <div ref={railRef} className="relative mt-20 pl-14 md:pl-0">
          <div className="timeline-rail" aria-hidden />
          <motion.div
            className="timeline-progress"
            style={{ scaleY: railProgress }}
            aria-hidden
          />

          <ol className="space-y-14">
            {milestones.map((m, i) => {
              const alignRight = i % 2 === 1;
              return (
                <li key={m.year} className="relative">
                  <MilestoneSpark className="absolute top-2 -left-14 h-3 w-3 md:top-8 md:left-1/2 md:-translate-x-1/2" />
                  <Reveal
                    delay={(i % 3) * 80}
                    className={`md:w-[46%] ${alignRight ? "md:ml-auto" : ""}`}
                  >
                    <details className="group rounded-2xl bg-cream-card p-6 transition-colors duration-300 hover:animate-electric-shock hover:bg-cream-card-2 sm:p-8">
                      <summary className="cursor-pointer list-none">
                        <span className="font-display text-4xl font-bold text-yellow sm:text-5xl">
                          {m.year}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold">
                          {m.title}
                        </h3>
                        <p className="mt-2 text-ink-muted">{m.summary}</p>
                      </summary>
                      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-open:grid-rows-[1fr]">
                        <div className="overflow-hidden">
                          <p className="pt-3 text-sm text-ink-muted/80">
                            {m.detail}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-2 font-mono text-xs text-ink-muted">
                        <span className="rounded-full bg-ink px-2 py-1 text-cream">
                          {m.handle}
                        </span>
                        {m.time}
                      </div>
                    </details>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
