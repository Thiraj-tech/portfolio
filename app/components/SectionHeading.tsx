import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  const isCenter = align === "center";

  return (
    <Reveal className={isCenter ? "text-center" : undefined}>
      <p
        className={`mb-3 inline-block rounded-full border px-4 py-1.5 font-mono text-sm tracking-widest uppercase ${
          isDark ? "border-border-on-black text-yellow" : "border-ink/20"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl ${
          isCenter ? "mx-auto" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-xl text-lg ${
            isDark ? "text-cream/60" : "text-ink-muted"
          } ${isCenter ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
