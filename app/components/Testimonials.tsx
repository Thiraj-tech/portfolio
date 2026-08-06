"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { springy } from "./motionPresets";

/**
 * PLACEHOLDER CONTENT — replace each entry with a real quote, name, role, and
 * company before publishing. Keep entries you have permission to use;
 * delete the rest (or the whole section) if none are ready.
 */
const testimonials = [
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "Ask a manager, client, or colleague for 2–4 sentences about working with you, and paste it here.",
    name: "Full Name",
    role: "Role, Company",
  },
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "A good prompt to send them: 'What was it like working with me, and what result do you remember most?'",
    name: "Full Name",
    role: "Role, Company",
  },
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "Three quotes is enough to launch with. Delete any card you don't fill in.",
    name: "Full Name",
    role: "Role, Company",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-ink py-24 text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-64 hidden w-64 bg-ink lg:block"
      />
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Testimonials"
          title="From People I've Worked With"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <motion.figure
                whileHover={{ y: -4 }}
                transition={springy}
                className="flex h-full flex-col rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] p-8"
              >
                <h3 className="text-lg font-semibold text-cream/90">
                  {t.headline}
                </h3>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-cream/50">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-cream/50">{t.role}</div>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
