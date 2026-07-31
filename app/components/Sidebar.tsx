"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { navLinks } from "./navLinks";
import { useHeroTransition } from "./HeroTransitionContext";

export default function Sidebar() {
  const { pastHero } = useHeroTransition();
  const [active, setActive] = useState("#hero");
  const [copied, setCopied] = useState(false);

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
    <aside
      className={`fixed inset-y-0 left-0 z-50 hidden w-64 flex-col gap-4 overflow-y-auto p-4 lg:flex ${
        pastHero ? "" : "pointer-events-none"
      }`}
    >
      {pastHero && (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-cream-card px-4 py-4">
            <motion.a
              layoutId="brand-badge"
              href="#hero"
              className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold tracking-tight text-ink"
            >
              THIRAJ
            </motion.a>
            <div className="flex gap-2">
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-cream-card px-4 py-3 text-sm text-ink-muted"
          >
            Full stack engineer shipping production e-commerce platforms with
            clean, reliable code.
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.div
              layoutId="stat-years"
              className="flex-1 rounded-2xl bg-cream-card py-4 text-center"
            >
              <div className="font-display text-2xl font-bold text-yellow">
                6+
              </div>
              <div className="text-xs text-ink-muted">Years exp.</div>
            </motion.div>
            <motion.div
              layoutId="stat-projects"
              className="flex-1 rounded-2xl bg-cream-card py-4 text-center"
            >
              <div className="font-display text-2xl font-bold text-yellow">
                15+
              </div>
              <div className="text-xs text-ink-muted">Projects</div>
            </motion.div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 rounded-2xl bg-cream-card p-2">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                layoutId={`navlink-${link.href}`}
                href={link.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  active === link.href
                    ? "bg-yellow text-ink"
                    : "text-ink-muted hover:bg-cream-card-2 hover:text-ink"
                }`}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            type="button"
            onClick={copyEmail}
            className="flex items-center justify-between rounded-2xl bg-cream-card px-4 py-3 text-left text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <span>thiraj.hettiarachchi@gmail.com</span>
            <span className="ml-2 shrink-0 font-mono text-xs">
              {copied ? "Copied" : "Copy"}
            </span>
          </motion.button>

          <motion.a
            layoutId="cta-hire"
            href="#contact"
            className="rounded-2xl bg-yellow py-4 text-center font-display font-bold text-ink transition-opacity hover:opacity-85"
          >
            Hire Me
          </motion.a>
        </>
      )}
    </aside>
  );
}
