"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useHeroTransition } from "./HeroTransitionContext";

export default function HeroAmbientBackdrop() {
  const { scrollYProgress, aboutRef } = useHeroTransition();
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress: aboutProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "start start"],
  });

  const opacity = useTransform(
    [scrollYProgress, aboutProgress],
    ([hero, about]) => (hero as number) * (1 - (about as number)) * 0.35,
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.3]);
  const blur = useTransform(scrollYProgress, (v) => `blur(${v * 40}px)`);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0 flex items-end justify-center"
        style={{ scale, filter: blur }}
      >
        <Image
          src="/portrait.png"
          alt=""
          width={846}
          height={914}
          className="h-[80vh] w-auto object-contain object-bottom"
        />
      </motion.div>
    </motion.div>
  );
}
