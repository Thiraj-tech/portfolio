"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { springy } from "./motionPresets";
import { supabase } from "../lib/supabaseClient";

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details: string | null;
  client_name: string | null;
  client_info: string | null;
  engagement: string;
  tags: string[];
  cover_image_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("projects")
      .select(
        "id, slug, title, summary, details, client_name, client_info, engagement, tags, cover_image_url, gallery_urls, video_url",
      )
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data || cancelled) return;
        setProjects(data as Project[]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, projects.length - 1));
    const slide = track.children[clamped] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || projects.length === 0) return;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft - track.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  if (projects.length === 0) return null;

  return (
    <section
      id="projects"
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
            eyebrow="Selected work"
            title="Built to Ship, Made to Perform"
            description="Over six years I've helped businesses turn ideas into platforms that look and work exactly how they imagined. Here's a look at some of that work."
          />
          <div className="hidden shrink-0 gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-on-black transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === projects.length - 1}
              aria-label="Next project"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-on-black transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>

        <Reveal>
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="w-full shrink-0 snap-start sm:w-[calc(50%-0.75rem)]"
              >
                <article
                  className="group h-full overflow-hidden rounded-2xl border border-border-on-black bg-white/[0.03] transition-colors hover:border-yellow/50"
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={springy}
                    className="flex h-full flex-col"
                  >
                    {project.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.cover_image_url}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-8">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-sm text-cream/70">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="rounded-full border border-dashed border-border-on-black px-3 py-1 font-mono text-xs text-cream/50">
                            {project.engagement}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(i)}
                          aria-label={`View ${project.title} details`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow text-ink transition-transform group-hover:rotate-45"
                        >
                          ↗
                        </button>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/60">
                        {project.summary}
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
                    </div>
                  </motion.div>
                </article>
              </div>
            ))}
          </div>
        </Reveal>

        {projects.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {projects.map((project, i) => (
              <button
                key={project.id}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to project ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-yellow" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {openIndex !== null && projects[openIndex] && (
        <ProjectModal
          project={projects[openIndex]}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => (i !== null ? i - 1 : i))}
          onNext={() => setOpenIndex((i) => (i !== null ? i + 1 : i))}
          hasPrev={openIndex > 0}
          hasNext={openIndex < projects.length - 1}
        />
      )}
    </section>
  );
}
