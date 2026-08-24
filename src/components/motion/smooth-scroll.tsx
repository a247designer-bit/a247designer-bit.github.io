"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling for the marketing pages.
 *
 * Deliberately does nothing when the visitor asks for reduced motion: this
 * hijacks the browser's own scrolling, which is exactly the kind of effect
 * that setting exists to switch off. Keyboard and anchor navigation keep
 * working either way — Lenis translates them rather than swallowing them.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Matches --ease-out; a long tail is what reads as "expensive" rather
      // than floaty.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
