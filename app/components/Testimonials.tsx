import Reveal from "./Reveal";

/**
 * PLACEHOLDER CONTENT — replace each entry with a real quote, name, role, and
 * company before publishing. Keep entries you have permission to use;
 * delete the rest (or the whole section) if none are ready.
 */
const testimonials = [
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "Ask a manager, client, or colleague for 2–4 sentences about working with you, and paste it here.",
    name: "Full Name",
    role: "Role, Company",
  },
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "A good prompt to send them: 'What was it like working with me, and what result do you remember most?'",
    name: "Full Name",
    role: "Role, Company",
  },
  {
    headline: "[Placeholder — replace with a real quote]",
    quote:
      "Three quotes is enough to launch with. Delete any card you don't fill in.",
    name: "Full Name",
    role: "Role, Company",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-ink py-24 text-cream">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="mb-3 inline-block rounded-full border border-border-on-black px-4 py-1.5 font-mono text-sm tracking-widest text-yellow uppercase">
            Testimonials
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
            From People I&apos;ve Worked With
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <figure className="flex h-full flex-col rounded-2xl border border-dashed border-border-on-black bg-white/[0.03] p-8">
                <h3 className="text-lg font-semibold text-cream/90">
                  {t.headline}
                </h3>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-cream/50">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-cream/50">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
