import Reveal from "./Reveal";

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
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="mb-3 inline-block rounded-full border border-ink/20 px-4 py-1.5 font-mono text-sm tracking-widest uppercase">
            FAQ
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Got Any Questions?
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={(i % 3) * 60}>
              <details className="group rounded-2xl bg-cream-card transition-colors open:bg-cream-card-2">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left font-medium">
                  {faq.q}
                  <span
                    aria-hidden
                    className="faq-chevron flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow text-lg text-ink transition-transform"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 text-sm leading-relaxed text-ink-muted">
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
