"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Avatar from "./Avatar";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Stars from "./Stars";
import { springy } from "./motionPresets";
import { countryFlag } from "../lib/countries";
import { supabase } from "../lib/supabaseClient";

type Testimonial = {
  quote: string;
  name: string;
  country: string | null;
  avatar: string | null;
  rating: number;
};

const PAGE_SIZE = 9;

export default function Testimonials() {
  const [dbReviews, setDbReviews] = useState<Testimonial[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("reviews")
      .select("name, avatar_url, country, quote, rating, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error || !data || cancelled) return;
        setDbReviews(
          data.map((r) => ({
            quote: r.quote,
            name: r.name,
            country: r.country,
            avatar: r.avatar_url,
            rating: r.rating,
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allTestimonials = dbReviews;
  const avgRating = allTestimonials.length
    ? allTestimonials.reduce((sum, t) => sum + t.rating, 0) /
      allTestimonials.length
    : null;

  return (
    <section
      id="testimonials"
      className="relative scroll-mt-16 bg-ink py-24 text-cream lg:scroll-mt-0"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-64 hidden w-64 bg-ink lg:block"
      />
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            tone="dark"
            eyebrow="Testimonials"
            title="From People I've Worked With"
          />
          {avgRating !== null && (
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] px-5 py-3">
              <svg
                viewBox="0 0 20 20"
                className="h-6 w-6 text-yellow"
                fill="currentColor"
              >
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
              <div>
                <div className="font-display text-2xl font-bold text-yellow">
                  {avgRating.toFixed(1)}
                </div>
                <div className="text-xs text-cream/50">
                  from {allTestimonials.length} reviews
                </div>
              </div>
            </div>
          )}
        </div>

        <Reveal delay={80}>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.slice(0, visibleCount).map((t, i) => {
              const flag = countryFlag(t.country);
              return (
                <motion.figure
                  key={`${t.name}-${i}`}
                  whileHover={{ y: -4 }}
                  transition={springy}
                  className="flex flex-col rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] p-6"
                >
                  <Stars rating={t.rating} />
                  <blockquote className="mt-4 line-clamp-5 flex-1 text-sm leading-relaxed text-cream/60">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <Avatar name={t.name} avatar={t.avatar} />
                    <div>
                      <div className="font-medium">{t.name}</div>
                      <div className="flex items-center gap-1.5 text-sm text-cream/50">
                        {flag && (
                          <span className="text-[18px] leading-none">
                            {flag}
                          </span>
                        )}
                        <span>
                          Verified Client{t.country ? `, ${t.country}` : ""}
                        </span>
                      </div>
                    </div>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </Reveal>

        {visibleCount < allTestimonials.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((c) =>
                  Math.min(c + PAGE_SIZE, allTestimonials.length),
                )
              }
              className="rounded-full border border-dashed border-border-on-black px-6 py-2.5 text-sm font-medium text-cream/70 transition hover:border-yellow hover:text-yellow"
            >
              Show more reviews ({visibleCount} of {allTestimonials.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
