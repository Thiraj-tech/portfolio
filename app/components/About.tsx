import AboutScrollAnchor from "./AboutScrollAnchor";
import Reveal from "./Reveal";

type Milestone = {
  year: string;
  title: string;
  summary: string;
  detail: string;
  handle: string;
  time: string;
};

const milestones: Milestone[] = [
  {
    year: "'16",
    title: "Starting out in Dubai",
    summary:
      "IT support at Madinat Jumeirah — a luxury resort with 500+ guests and staff depending on the network staying up.",
    detail:
      "Peak-season pressure, POS rollouts for three new restaurants, and security hardening that measurably cut incidents. Not writing much code yet, but learning what 'production' really means.",
    handle: "@dubai",
    time: "10 years ago",
  },
  {
    year: "'19",
    title: "First developer role",
    summary:
      "Joined WebTechno remotely and went from support tickets to shipping real client work.",
    detail:
      "Custom themes and plugins across WordPress, Shopify, Wix, Squarespace, and GoDaddy for international clients. 15+ projects delivered end to end, from requirements to launch and support.",
    handle: "@webtechno",
    time: "7 years ago",
  },
  {
    year: "'21",
    title: "Levelling up",
    summary:
      "Started my HND in Computing while revamping a US sports nutrition brand's site — organic traffic grew 150% in six months.",
    detail:
      "SEO and performance work stopped being extras and became how I approach every build. Also began integrating third-party REST and GraphQL APIs to connect client platforms with external services.",
    handle: "@seo",
    time: "5 years ago",
  },
  {
    year: "'23",
    title: "Going full stack at Fexcon",
    summary:
      "Joined Fexcon to build and run large-scale e-commerce platforms in Laravel, Zend, and React.",
    detail:
      "RESTful APIs in PHP and Python supporting up to $2M in monthly transactions, five payment gateways integrated end to end, and Docker deployments across 100+ components. Started my BEng top-up the same year.",
    handle: "@fexcon",
    time: "3 years ago",
  },
  {
    year: "'24",
    title: "Engineering degree, done",
    summary:
      "Completed my BEng (Hons) in Software Engineering at London Metropolitan University — while working full-time.",
    detail:
      "Also shipped performance work that cut page load times 40% across 15 production websites, and built a cron-based automation framework now handling email and SMS notifications across all company platforms.",
    handle: "@londonmet",
    time: "2 years ago",
  },
  {
    year: "'26",
    title: "The journey continues",
    summary:
      "Same obsession, new tools — Claude Code, MCP servers, and LLM-assisted pipelines are now part of how I work every day.",
    detail:
      "AI has opened a whole new layer of what's possible for a small team shipping fast. The best work is still ahead.",
    handle: "@thiraj",
    time: "now",
  },
];

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <AboutScrollAnchor />
      <span aria-hidden className="bg-wordmark">
        JOURNEY
      </span>

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="mb-3 inline-block rounded-full border border-ink/20 px-4 py-1.5 font-mono text-sm tracking-widest uppercase">
            Start small, grow big
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
            About Me (&amp;) My Journey
          </h2>
          <p className="mt-4 max-w-xl text-ink-muted">
            Ten years ago I was fixing resort networks in Dubai. What happened
            after that is easier to show than explain.
          </p>
        </Reveal>

        <div className="relative mt-20 pl-14 md:pl-0">
          <div className="timeline-rail" aria-hidden />

          <ol className="space-y-14">
            {milestones.map((m, i) => {
              const alignRight = i % 2 === 1;
              return (
                <li key={m.year} className="relative">
                  <span
                    aria-hidden
                    className="absolute top-2 -left-14 h-3 w-3 rounded-full bg-yellow ring-4 ring-cream md:top-8 md:left-1/2 md:-translate-x-1/2"
                  />
                  <Reveal
                    delay={(i % 3) * 80}
                    className={`md:w-[46%] ${alignRight ? "md:ml-auto" : ""}`}
                  >
                    <article className="rounded-2xl bg-cream-card p-6 transition-colors hover:bg-cream-card-2 sm:p-8">
                      <span className="font-display text-4xl font-bold text-yellow sm:text-5xl">
                        {m.year}
                      </span>
                      <h3 className="mt-2 text-xl font-semibold">{m.title}</h3>
                      <p className="mt-2 text-ink-muted">{m.summary}</p>
                      <p className="mt-3 hidden text-sm text-ink-muted/80 sm:block">
                        {m.detail}
                      </p>
                      <div className="mt-5 flex items-center gap-2 font-mono text-xs text-ink-muted">
                        <span className="rounded-full bg-ink px-2 py-1 text-cream">
                          {m.handle}
                        </span>
                        {m.time}
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
