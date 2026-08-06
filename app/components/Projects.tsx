"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { springy } from "./motionPresets";

type Project = {
  number: string;
  title: string;
  description: string;
  tags: string[];
};

const projects: Project[] = [
  {
    number: "01",
    title: "E-commerce Platforms — Fexcon",
    description:
      "Multiple production e-commerce platforms in Laravel, Zend, and React. RESTful APIs in PHP and Python supporting up to $2M monthly transaction volume, with five payment gateways integrated end to end — webhooks, checkout pipelines, and reconciliation.",
    tags: ["Laravel", "React", "Python", "Payments", "Docker"],
  },
  {
    number: "02",
    title: "US Sports Nutrition Brand — SEO & Performance Revamp",
    description:
      "Full site revamp for a US-based sports nutrition brand focused on SEO and performance, growing organic traffic 150% within six months.",
    tags: ["WordPress", "SEO", "Performance"],
  },
  {
    number: "03",
    title: "Biometric Attendance System",
    description:
      "IoT employee attendance system: ESP32 + FPM10A fingerprint sensor driven by a full state machine, with OLED display, 4x4 keypad, and admin PIN protection. Node.js/Express backend with SQLite.",
    tags: ["IoT", "ESP32", "Node.js", "Hardware"],
  },
  {
    number: "04",
    title: "Multi-CMS Client Projects — WebTechno",
    description:
      "15+ client projects delivered end to end across WordPress, Shopify, Wix, Squarespace, and GoDaddy — custom themes, plugins, and third-party API integrations for international clients.",
    tags: ["WordPress", "Shopify", "Wix", "Squarespace"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative bg-ink py-24 text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-64 hidden w-64 bg-ink lg:block"
      />
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Selected work"
          title="Built to Ship, Made to Perform"
          description="Over six years I've helped businesses turn ideas into platforms that look and work exactly how they imagined. Here's a look at some of that work."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.number} delay={(i % 2) * 100}>
              <motion.article
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={springy}
                className="group flex h-full flex-col rounded-2xl border border-border-on-black bg-white/[0.03] p-8 transition-colors hover:border-yellow/50"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm text-cream/70">
                    {project.number}
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow text-ink transition-transform group-hover:rotate-45"
                  >
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/60">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-cream/80"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
