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

export default function Home() {
  return (
    <HeroTransitionProvider>
      <Sidebar />
      <MobileNav />
      <HeroAmbientBackdrop />
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
