"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Facet = { src: string; alt: string; label: string };

/** How long a picture holds before the carousel moves on. */
const HOLD_MS = 4000;

/**
 * The three faces of the network: a row of three on a desktop, a carousel on a
 * phone.
 *
 * Stacked, the three were 1300px of scrolling for one idea. Side by side they
 * are the idea — which is what the desktop row already was, and what a phone
 * can only have by scrolling sideways instead of down.
 *
 * One element serves both. Below sm it is a snap scroller, from sm up the same
 * div is the grid it always was, and the slides go from a fixed width back to
 * auto. Nothing is duplicated and nothing is hidden.
 *
 * The pictures stand at 2/3 of the screen rather than filling it, so the next
 * one is always showing at the edge. That sliver is the whole affordance: a
 * full-width slide gives no reason to think there is anything beside it, and
 * the dots underneath are a report on position, not an instruction to swipe.
 */
export function RealGallery({ items }: { items: Facet[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  /**
   * Set the moment a finger lands on the strip, and never unset. Auto-advance
   * is there to say the strip moves; once someone has moved it themselves the
   * point is made, and a carousel that keeps tugging at a picture you chose to
   * look at is arguing with you.
   */
  const [taken, setTaken] = useState(false);

  const slidesOf = (el: HTMLElement) => Array.from(el.children) as HTMLElement[];

  /** Which slide is nearest the middle of the scrollport. */
  const readIndex = useCallback((el: HTMLElement) => {
    const middle = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestGap = Infinity;
    slidesOf(el).forEach((slide, i) => {
      const gap = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    });
    return best;
  }, []);

  /**
   * Measured off the slide rather than off `clientWidth * i`: the slides are
   * narrower than the scrollport and sit inside its padding, so the two are
   * not the same number and never will be.
   */
  const goTo = useCallback((i: number, smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    const slide = slidesOf(el)[i];
    if (!slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // Position, reported from the scroll itself — so a swipe, a dot and the
  // timer all leave the dots saying the same thing.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => setIndex(readIndex(el));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [readIndex]);

  useEffect(() => {
    if (taken) return;
    const el = scroller.current;
    if (!el) return;

    const wide = window.matchMedia("(min-width: 640px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let timer: ReturnType<typeof setInterval> | undefined;
    // Off-screen the strip is not moving for anyone, and a phone should not be
    // running a timer and a smooth scroll for a section nobody is looking at.
    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const start = () => {
      // From sm up there is no carousel to advance — the same div is a grid,
      // and all three are already in view.
      if (timer || wide.matches || still.matches) return;
      timer = setInterval(() => {
        if (!inView || document.hidden) return;
        goTo((readIndex(el) + 1) % items.length);
      }, HOLD_MS);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const retest = () => {
      stop();
      start();
    };

    start();
    wide.addEventListener("change", retest);
    still.addEventListener("change", retest);
    return () => {
      stop();
      io.disconnect();
      wide.removeEventListener("change", retest);
      still.removeEventListener("change", retest);
    };
  }, [taken, items.length, goTo, readIndex]);

  return (
    <div className="flex flex-col gap-5 sm:gap-0">
      <div
        ref={scroller}
        // pointerdown, not scroll: the timer's own scrollTo fires scroll
        // events too, and a carousel that stops itself is a carousel that
        // never ran.
        onPointerDown={() => setTaken(true)}
        role="group"
        aria-label="Real people, real talent, real places"
        className={cn(
          // The padding is what lets the first and last slide reach the middle
          // — a snap point they cannot otherwise scroll to. Half of what the
          // slide leaves over, on each end.
          // overscroll-x-contain so a swipe that runs off the end of the strip
          // stays in the strip — on iOS it would otherwise be handed to the
          // browser as a back gesture.
          "-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[17vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0",
        )}
      >
        {items.map((item) => (
          <div
            key={item.src}
            className="flex w-[66vw] shrink-0 snap-center flex-col gap-4 sm:w-auto"
          >
            <div className="overflow-hidden rounded-[24px]">
              <Image
                src={item.src}
                alt={item.alt}
                width={900}
                height={900}
                sizes="(min-width: 640px) 33vw, 66vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <span className="font-display text-[20px] tracking-[-0.025em]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Phone only, where there is something to be at position 2 of. */}
      <div className="flex justify-center gap-2 sm:hidden">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show ${item.label}`}
            aria-current={i === index}
            onClick={() => {
              setTaken(true);
              goTo(i);
            }}
            // The hit area is 24px square; the mark inside it is the small
            // thing, not the target.
            className="grid size-6 place-items-center"
          >
            <span
              className={cn(
                "block size-2 rounded-full transition-colors duration-300",
                i === index ? "bg-ink" : "bg-ink/25",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
