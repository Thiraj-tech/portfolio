"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { IconType } from "react-icons";
import {
  SiCloudflare,
  SiClaude,
  SiDocker,
  SiGodaddy,
  SiGraphql,
  SiJavascript,
  SiLaravel,
  SiLinux,
  SiMysql,
  SiNginx,
  SiPhp,
  SiPython,
  SiReact,
  SiShopify,
  SiSquarespace,
  SiWix,
  SiWordpress,
  SiZend,
} from "react-icons/si";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { hoverLift, springy, tapScale } from "./motionPresets";

const process = [
  {
    step: "01",
    title: "Free Consultation",
    description:
      "We hop on a free call to talk through what you need — goals, scope, and must-haves.",
  },
  {
    step: "02",
    title: "Free Quotation & Invoice",
    description:
      "A clear, no-obligation quote is provided, along with an invoice, before development starts — pricing locked in upfront.",
  },
  {
    step: "03",
    title: "Development on Staging",
    description:
      "I build exactly what was quoted on a private staging environment, so nothing touches your live site until it's ready.",
  },
  {
    step: "04",
    title: "Fixed Scope, No Surprises",
    description:
      "Anything outside the original scope is quoted separately, only if you request it.",
  },
  {
    step: "05",
    title: "Payment After You're Happy",
    description:
      "Payment is completed once you've reviewed the outcome on staging and you're satisfied — before it goes live.",
  },
  {
    step: "06",
    title: "Unlimited Revisions, 2 Months",
    description:
      "After launch, unlimited review revisions are free for two months — no extra charge.",
  },
];

const services = [
  {
    title: "Full Stack Development",
    description:
      "Fast, scalable web platforms in Laravel, React, and Python — clean architecture, type-safe code, and a structure your team can build on.",
  },
  {
    title: "API & Payment Integrations",
    description:
      "REST and GraphQL APIs, webhook flows, and end-to-end payment gateway integrations — Stripe, PayPal, PayHere, Koko, Mintpay — with reconciliation you can trust.",
  },
  {
    title: "Performance & SEO",
    description:
      "Technical SEO, query optimisation, and performance work that has cut page loads 40% across 15 production sites and grown organic traffic 150%.",
  },
  {
    title: "DevOps & Deployment",
    description:
      "Docker-based deployments, AWS (S3, EC2), Nginx, and Cloudflare — consistent multi-environment releases across 100+ containerised components.",
  },
  {
    title: "AI-Assisted Workflows",
    description:
      "Claude Code, MCP servers, and LLM-assisted pipelines applied to real production work — shipping faster without sacrificing quality.",
  },
];

const industries = [
  "Rental businesses",
  "Music, production & DJ services",
  "Event planners & wedding businesses",
  "Pet grooming salons",
  "Online e-commerce & retail",
  "Plumbing & trade services",
  "Construction & repair shops",
  "Warehousing & trucking",
];

const skills: Record<string, string[]> = {
  Languages: ["PHP", "Python", "JavaScript"],
  Frameworks: ["Laravel", "Zend Framework", "React.js"],
  "APIs & Integration": ["REST", "GraphQL", "Payment Gateways", "Webhooks"],
  "CMS Platforms": ["WordPress", "Shopify", "Wix", "Squarespace", "GoDaddy"],
  "DevOps & Cloud": ["Docker", "AWS (S3, EC2)", "Nginx", "Linux", "Cloudflare"],
  Databases: ["MySQL", "Query Optimisation"],
  "AI Tooling": ["Claude Code", "MCP Servers", "LLM Integrations"],
};

const skillIcons: Partial<Record<string, IconType>> = {
  PHP: SiPhp,
  Python: SiPython,
  JavaScript: SiJavascript,
  Laravel: SiLaravel,
  "Zend Framework": SiZend,
  "React.js": SiReact,
  GraphQL: SiGraphql,
  WordPress: SiWordpress,
  Shopify: SiShopify,
  Wix: SiWix,
  Squarespace: SiSquarespace,
  GoDaddy: SiGodaddy,
  Docker: SiDocker,
  Nginx: SiNginx,
  Linux: SiLinux,
  Cloudflare: SiCloudflare,
  MySQL: SiMysql,
  "Claude Code": SiClaude,
};

export default function Services() {
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Scroll-linked, not one-shot: scrolling down slides OFFER in from the
  // right, scrolling back up slides it back out the same way it came.
  // Tracked against the wordmark itself (not the section) so the slide
  // finishes right as it actually scrolls into view.
  const { scrollYProgress: wordmarkProgress } = useScroll({
    target: wordmarkRef,
    offset: ["start end", "start center"],
  });
  const wordmarkX = useTransform(wordmarkProgress, [0, 1], [400, 0]);

  return (
    <section
      id="services"
      className="relative scroll-mt-16 overflow-hidden pt-[20px] pb-24 lg:scroll-mt-0"
    >
      <div className="relative mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Capabilities overview"
          title="What You Get"
          description="The same skills I use to run production e-commerce platforms — full stack development, API integrations, performance and SEO — available for your team or your next project."
        />

        <motion.span
          ref={wordmarkRef}
          aria-hidden
          style={{
            position: "static",
            display: "block",
            width: "fit-content",
            marginLeft: "auto",
            x: prefersReducedMotion ? 0 : wordmarkX,
          }}
          className="bg-wordmark mt-6"
        >
          OFFER
        </motion.span>

        <Reveal>
          <div className="mt-16 rounded-2xl bg-cream-card p-8">
            <h3 className="font-mono text-sm tracking-widest uppercase">
              How we&apos;ll work together
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((item) => (
                <div key={item.step}>
                  <span className="font-display text-3xl font-bold text-yellow">
                    {item.step}
                  </span>
                  <h4 className="mt-2 font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <h3 className="mt-16 font-mono text-sm tracking-widest uppercase">
          What I build
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 80}>
              <motion.article
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={springy}
                className="h-full rounded-2xl bg-cream-card p-8 transition-colors hover:bg-cream-card-2"
              >
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-2xl bg-cream-card p-8">
            <h3 className="font-mono text-sm tracking-widest uppercase">
              Who I build for
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
              Most of my production work has been e-commerce and CMS
              platforms, but the skill set isn&apos;t industry-specific — I
              build fast, functional websites for small businesses in any
              space, including:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {industries.map((industry) => (
                <li
                  key={industry}
                  className="rounded-full bg-yellow/60 px-3 py-1 font-mono text-xs text-ink"
                >
                  {industry}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-6 rounded-2xl bg-cream-card p-8">
            <h3 className="font-mono text-sm tracking-widest uppercase">
              The toolbox
            </h3>
            <div className="mt-6 space-y-5">
              {Object.entries(skills).map(([category, items], i) => (
                <Reveal key={category} delay={i * 60}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="w-40 shrink-0 text-sm font-medium">
                      {category}
                    </span>
                    <ul className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const Icon = skillIcons[item];
                        return (
                          <motion.li
                            key={item}
                            whileHover={hoverLift}
                            whileTap={tapScale}
                            transition={springy}
                            className="flex items-center gap-1.5 rounded-full bg-yellow/50 px-3 py-1 font-mono text-xs text-ink transition-colors hover:cursor-crosshair hover:bg-yellow hover:shadow-[0_4px_14px_rgba(255,255,35,0.5)]"
                          >
                            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                            {item}
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-8 text-center font-mono text-xs tracking-widest text-ink-muted uppercase">
            Also open to full-time remote or hybrid roles
          </p>
        </Reveal>
      </div>
    </section>
  );
}
