"use client";

import { useState } from "react";
import { navLinks } from "./navLinks";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 lg:hidden">
      <div className="flex items-center justify-between bg-cream/90 px-4 py-3 backdrop-blur-md">
        <a
          href="#hero"
          className="rounded-lg bg-yellow px-2 py-1 font-display text-sm font-bold text-ink"
        >
          THIRAJ
        </a>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-0.5 w-6 bg-ink transition-transform ${
              open ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-ink transition-transform ${
              open ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <ul className="bg-cream px-4 pb-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-xl px-4 py-3 text-lg text-ink-muted transition-colors hover:bg-cream-card hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="mt-2 block rounded-xl bg-yellow px-4 py-3 text-center font-display font-bold text-ink"
              onClick={() => setOpen(false)}
            >
              Hire Me
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
