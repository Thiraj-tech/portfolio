"use client";

import { useEffect } from "react";

type ProjectDetail = {
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

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export default function ProjectModal({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  project: ProjectDetail;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const embedUrl = project.video_url
    ? getYouTubeEmbedUrl(project.video_url) ?? getVimeoEmbedUrl(project.video_url)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={!hasPrev}
        aria-label="Previous project"
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-cream transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
      >
        ←
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!hasNext}
        aria-label="Next project"
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-cream transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
      >
        →
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border-on-black bg-ink p-8 text-cream sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-border-on-black bg-white/5 text-cream transition hover:border-yellow hover:text-yellow"
        >
          ×
        </button>

        {project.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image_url}
            alt=""
            className="h-64 w-full rounded-2xl object-cover sm:h-80"
          />
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 pr-10">
          <span
            className={`rounded-full px-3 py-1 font-mono text-xs ${
              project.engagement === "Freelance"
                ? "bg-yellow text-ink"
                : "border border-dashed border-border-on-black text-cream/50"
            }`}
          >
            {project.engagement}
          </span>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-cream/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="mt-4 font-display text-3xl font-bold">{project.title}</h2>

        <p className="mt-4 whitespace-pre-line leading-relaxed text-cream/70">
          {project.details || project.summary}
        </p>

        {(project.client_name || project.client_info) && (
          <div className="mt-8 rounded-2xl border border-border-on-black bg-white/[0.03] p-6">
            <h3 className="font-display text-lg font-bold text-yellow">Client</h3>
            {project.client_name && (
              <p className="mt-2 font-medium">{project.client_name}</p>
            )}
            {project.client_info && (
              <p className="mt-1 text-sm text-cream/60">{project.client_info}</p>
            )}
          </div>
        )}

        {embedUrl && (
          <div className="mt-8 aspect-video overflow-hidden rounded-2xl">
            <iframe
              src={embedUrl}
              title={`${project.title} video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}
        {!embedUrl && project.video_url && (
          <video controls src={project.video_url} className="mt-8 w-full rounded-2xl" />
        )}

        {project.gallery_urls.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.gallery_urls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {(hasPrev || hasNext) && (
          <div className="mt-8 flex justify-between gap-3 sm:hidden">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="rounded-full border border-border-on-black px-4 py-2 text-sm font-medium transition hover:border-yellow hover:text-yellow disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
