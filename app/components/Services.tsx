import Reveal from "./Reveal";

const services = [
  {
    title: "Full Stack Development",
    description:
      "Fast, scalable web platforms in Laravel, React, and Python — clean architecture, type-safe code, and a structure your team can build on.",
  },
  {
    title: "API & Payment Integrations",
    description:
      "REST and GraphQL APIs, webhook flows, and end-to-end payment gateway integrations — Stripe, PayPal, PayHere, Koko, Mintpay — with reconciliation you can trust.",
  },
  {
    title: "Performance & SEO",
    description:
      "Technical SEO, query optimisation, and performance work that has cut page loads 40% across 15 production sites and grown organic traffic 150%.",
  },
  {
    title: "DevOps & Deployment",
    description:
      "Docker-based deployments, AWS (S3, EC2), Nginx, and Cloudflare — consistent multi-environment releases across 100+ containerised components.",
  },
  {
    title: "AI-Assisted Workflows",
    description:
      "Claude Code, MCP servers, and LLM-assisted pipelines applied to real production work — shipping faster without sacrificing quality.",
  },
  {
    title: "Open to Full-Time Roles",
    description:
      "Alongside freelance projects, I'm open to the right full-time opportunity — remote or hybrid, flexible hours, overlapping most time zones.",
  },
];

const skills: Record<string, string[]> = {
  Languages: ["PHP", "Python", "JavaScript"],
  Frameworks: ["Laravel", "Zend Framework", "React.js"],
  "APIs & Integration": ["REST", "GraphQL", "Payment Gateways", "Webhooks"],
  "CMS Platforms": ["WordPress", "Shopify", "Wix", "Squarespace", "GoDaddy"],
  "DevOps & Cloud": ["Docker", "AWS (S3, EC2)", "Nginx", "Linux", "Cloudflare"],
  Databases: ["MySQL", "Query Optimisation"],
  "AI Tooling": ["Claude Code", "MCP Servers", "LLM Integrations"],
};

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24">
      <span aria-hidden className="bg-wordmark">
        OFFER
      </span>

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <p className="mb-3 inline-block rounded-full border border-ink/20 px-4 py-1.5 font-mono text-sm tracking-widest uppercase">
            Capabilities overview
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight sm:text-5xl">
            What You Get
          </h2>
          <p className="mt-4 max-w-xl text-ink-muted">
            Strategy, precision, and development combined — turning your
            vision into a digital experience that feels effortless.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={(i % 3) * 80}>
              <article className="h-full rounded-2xl bg-cream-card p-8 transition-colors hover:bg-cream-card-2">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {service.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-2xl bg-cream-card p-8">
            <h3 className="font-mono text-sm tracking-widest uppercase">
              The toolbox
            </h3>
            <div className="mt-6 space-y-5">
              {Object.entries(skills).map(([category, items]) => (
                <div
                  key={category}
                  className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-40 shrink-0 text-sm font-medium">
                    {category}
                  </span>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-yellow/60 px-3 py-1 font-mono text-xs text-ink"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
