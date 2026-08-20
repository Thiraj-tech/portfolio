import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    q: "Are you looking for freelance work or a full-time role?",
    a: "Both. I take on freelance and contract projects, and I'm open to the right full-time opportunity — remote or hybrid. If you're hiring for a role, the same portfolio applies; just mention it when you reach out.",
  },
  {
    q: "What do you build with?",
    a: "My core stack is Laravel, React, and Python for full-stack work, with MySQL, Docker, and AWS underneath. I also have years of hands-on CMS experience — WordPress, Shopify, Wix, Squarespace — so I can meet a project where it already is.",
  },
  {
    q: "Can you work with my existing site or codebase?",
    a: "Yes — a large part of my work has been improving what already exists: performance passes that cut load times 40% across 15 production sites, SEO revamps, payment integrations, and CMS overhauls. You don't need to start from scratch.",
  },
  {
    q: "What about time zones?",
    a: "I'm based in Sri Lanka (UTC+5:30) with flexible hours, and I've worked remotely with US and international clients for years. I can overlap with most time zones for standups, reviews, and pairing.",
  },
  {
    q: "What's your process from start to launch?",
    a: "It starts with a conversation about your goals and what success looks like. From there I put together a clear scope, build in stages, and share progress as I go so feedback stays easy. The goal is a smooth handoff with a platform you actually know how to run.",
  },
  {
    q: "How do you use AI tooling?",
    a: "I use Claude Code, MCP servers, and LLM-assisted pipelines daily — for faster iteration, better test coverage, and automating repetitive work. AI accelerates my output; the engineering judgment, review, and accountability stay human.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 pt-[20px] pb-24 lg:scroll-mt-0">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="FAQ" title="Got Any Questions?" />
          <span className="mb-1 font-mono text-xs tracking-widest text-ink-muted uppercase">
            {String(faqs.length).padStart(2, "0")} Questions
          </span>
        </div>

        <div className="mt-10 border-t border-border-soft">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 3) * 60}>
              <details className="group relative border-b border-border-soft">
                <span
                  aria-hidden
                  className="absolute inset-y-2 -left-6 w-[3px] origin-center scale-y-0 rounded-full bg-yellow transition-transform duration-300 group-hover:scale-y-100 group-open:scale-y-100"
                />
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                  <span className="flex gap-4">
                    <span className="mt-1 w-8 shrink-0 font-mono text-xs text-yellow">
                      Q{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-semibold sm:text-xl">
                      {faq.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 font-mono text-sm text-ink-muted transition-colors group-open:text-yellow"
                  >
                    <span className="faq-toggle-closed">[+]</span>
                    <span className="faq-toggle-open">[–]</span>
                  </span>
                </summary>
                <p className="mb-6 pl-12 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
