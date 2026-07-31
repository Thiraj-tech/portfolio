import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Optional stagger, in ms, for grouped elements entering together. */
  delay?: number;
};

/**
 * Scroll-reveal wrapper. Content is fully visible by default with zero
 * JavaScript — the entrance motion is a pure-CSS progressive enhancement
 * (native scroll-driven animation, see .reveal in globals.css) that only
 * activates in browsers that support it. Nothing here can ever leave
 * content stuck invisible, regardless of hydration or JS state.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={`reveal ${className ?? ""}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
