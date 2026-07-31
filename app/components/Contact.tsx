import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="bg-ink py-24 text-cream">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="rounded-3xl bg-white/[0.04] p-10 text-center sm:p-16">
            <p className="mb-3 inline-block rounded-full border border-border-on-black px-4 py-1.5 font-mono text-sm tracking-widest text-yellow uppercase">
              Have something in mind?
            </p>
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s Build Something.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/60">
              Have a project in mind, or hiring for a role? I usually reply
              within a day.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:thiraj.hettiarachchi@gmail.com"
                className="rounded-full bg-yellow px-6 py-3 font-display font-bold text-ink transition-opacity hover:opacity-85"
              >
                thiraj.hettiarachchi@gmail.com
              </a>
              <a
                href="/Thiraj_Hettiarachchi_CV.pdf"
                download
                className="rounded-full border border-border-on-black px-6 py-3 font-display font-bold transition-colors hover:bg-white/10"
              >
                Download CV
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-cream/60">
              <li>
                <a
                  href="https://linkedin.com/in/thiraj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="tel:+94706428000"
                  className="transition-colors hover:text-cream"
                >
                  +94 70 642 8000
                </a>
              </li>
              <li>Kalutara, Sri Lanka · UTC+5:30</li>
            </ul>
          </div>
        </Reveal>

        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border-on-black pt-8 text-sm text-cream/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Thiraj Hettiarachchi. All rights
            reserved.
          </span>
          <span className="font-mono text-xs tracking-widest uppercase">
            Full Stack Engineer · Kalutara, Sri Lanka
          </span>
        </footer>
      </div>
    </section>
  );
}
