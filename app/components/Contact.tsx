"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiDownload, FiSend, FiX } from "react-icons/fi";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import {
  buzzRotate,
  buzzTransition,
  hoverLift,
  springy,
  tapScale,
} from "./motionPresets";

const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "https://api.thiraj.space/contact";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";

export default function Contact() {
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");

    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-16 bg-ink py-24 text-cream lg:scroll-mt-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-64 hidden w-64 bg-ink lg:block"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white/[0.04] p-10 text-center sm:p-16">
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Have something in mind?"
            title="Let's Build Something."
            description="Have a project in mind, or hiring for a role? I usually reply within a day."
          />

          <Reveal delay={80} className="mx-auto mt-8">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                type="button"
                whileHover={hoverLift}
                whileTap={tapScale}
                transition={springy}
                onClick={() => {
                  setFormOpen((v) => !v);
                  setStatus("idle");
                }}
                aria-expanded={formOpen}
                className="flex items-center gap-2 rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
              >
                {formOpen ? (
                  <FiX className="h-4 w-4" aria-hidden />
                ) : (
                  <motion.span
                    animate={buzzRotate}
                    transition={buzzTransition}
                    className="inline-flex"
                    aria-hidden
                  >
                    <FiSend className="h-4 w-4" />
                  </motion.span>
                )}
                {formOpen ? "Hide the Form" : "Send a Message"}
              </motion.button>
              <motion.a
                whileHover={hoverLift}
                whileTap={tapScale}
                transition={springy}
                href="mailto:thiraj.hettiarachchi@gmail.com"
                className="rounded-full border border-border-on-black px-6 py-3 font-display font-bold transition-colors hover:bg-white/10"
              >
                thiraj.hettiarachchi@gmail.com
              </motion.a>
              <motion.a
                whileHover={hoverLift}
                whileTap={tapScale}
                transition={springy}
                href="/Thiraj_Hettiarachchi_CV.pdf"
                download
                className="flex items-center gap-2 rounded-full border border-border-on-black px-6 py-3 font-display font-bold transition-colors hover:bg-white/10"
              >
                <FiDownload className="h-4 w-4" aria-hidden />
                Download CV
              </motion.a>
            </div>

            <AnimatePresence initial={false}>
              {formOpen && (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="mx-auto mt-8 max-w-lg space-y-4 text-left"
                  >
                    {/* Honeypot — hidden from real visitors, bots tend to fill every field. */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />

                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm text-cream/70"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={200}
                        placeholder="Your name"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm text-cream/70"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm text-cream/70"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        minLength={10}
                        maxLength={5000}
                        rows={5}
                        placeholder="What are you looking to build?"
                        className={`${fieldClass} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={status !== "submitting" ? hoverLift : undefined}
                      whileTap={status !== "submitting" ? tapScale : undefined}
                      transition={springy}
                      disabled={status === "submitting"}
                      className="w-full rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "submitting" ? "Sending…" : "Send Message"}
                    </motion.button>

                    {status === "success" && (
                      <p className="text-center text-sm text-yellow">
                        Message sent — I&apos;ll reply within a day.
                      </p>
                    )}
                    {status === "error" && (
                      <p className="text-center text-sm text-cream/70">
                        Something went wrong. Please{" "}
                        <a
                          href="mailto:thiraj.hettiarachchi@gmail.com"
                          className="text-yellow underline underline-offset-2"
                        >
                          email me directly
                        </a>{" "}
                        instead.
                      </p>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-cream/60">
              <li>
                <a
                  href="https://linkedin.com/in/thiraj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="tel:+94706428000"
                  className="transition-colors hover:text-cream"
                >
                  +94 70 642 8000
                </a>
              </li>
              <li>Kalutara, Sri Lanka · UTC+5:30</li>
            </ul>
          </Reveal>
        </div>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-on-black pt-8 text-sm text-cream/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Thiraj Hettiarachchi. All rights
            reserved.
          </span>
          <span className="font-mono text-xs tracking-widest uppercase">
            Full Stack Engineer · Kalutara, Sri Lanka
          </span>
        </footer>
      </div>
    </section>
  );
}
