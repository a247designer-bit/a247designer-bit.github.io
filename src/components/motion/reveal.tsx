"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * The hide below has to land before the browser paints, or the element flashes
 * in at full opacity and then drops out to animate back — very visible at a
 * 900ms transition. useLayoutEffect is the only hook that runs early enough,
 * and it has no meaning during SSR, so it is swapped out there to avoid React's
 * warning.
 */
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type RevealProps = {
  children: ReactNode;
  /** Stagger within a group, in ms. Keep runs short — 4 or 5 at most. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Reveals its children once, when they first come into view.
 *
 * The hidden state is driven by a data attribute rather than React state: the
 * element must render VISIBLE on the server and stay that way without JS, so
 * content is never trapped behind an animation that did not run. Going through
 * the DOM also means the reveal costs no re-renders — worth having when a page
 * carries fifty of these.
 *
 * The paired CSS lives in globals.css under [data-reveal].
 */
export function Reveal({ children, delay = 0, as, className }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.reveal = "pending";
    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      // Fires a little before the element reaches the fold, so the motion has
      // finished by the time it is properly in view.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
