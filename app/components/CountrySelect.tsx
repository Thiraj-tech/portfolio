"use client";

import { useEffect, useId, useRef, useState } from "react";
import { countries, flagEmoji, type Country } from "../lib/countries";

const fieldClass =
  "w-full rounded-xl border border-border-on-black bg-white/[0.04] px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow/70";

export default function CountrySelect({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const query = value.trim().toLowerCase();
  const matches: Country[] = query
    ? countries.filter((c) => c.name.toLowerCase().includes(query))
    : countries;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="Start typing a country…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setHighlighted(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, matches.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            if (matches[highlighted]) {
              e.preventDefault();
              select(matches[highlighted].name);
            }
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={fieldClass}
      />
      {open && matches.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-border-on-black bg-ink shadow-lg"
        >
          {matches.map((c, i) => (
            <li key={c.code} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(c.name)}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors ${
                  i === highlighted ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-base">{flagEmoji(c.code)}</span>
                <span>{c.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
