import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import { HeroTransitionProvider } from "./components/HeroTransitionContext";
import HeroAmbientBackdrop from "./components/HeroAmbientBackdrop";
import LocalTimeWidget from "./components/LocalTimeWidget";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Thiraj Hettiarachchi",
  jobTitle: "Full Stack Engineer",
  url: "https://thiraj.space",
  image: "https://thiraj.space/portrait.png",
  sameAs: ["https://linkedin.com/in/thiraj"],
  worksFor: {
    "@type": "Organization",
    name: "Fexcon (Pvt) Ltd",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kalutara",
    addressCountry: "LK",
  },
  knowsAbout: [
    "PHP",
    "Laravel",
    "React",
    "Python",
    "API Integration",
    "E-commerce Development",
  ],
};

export default function Home() {
  return (
    <HeroTransitionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Sidebar />
      <MobileNav />
      <HeroAmbientBackdrop />
      <LocalTimeWidget />
      <main className="relative z-10 flex-1 pt-16 lg:pt-0 lg:pl-64">
        <Hero />
        <About />
        <Projects />
        <Services />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
    </HeroTransitionProvider>
  );
}
