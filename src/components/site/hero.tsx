"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Ribbon } from "@/components/site/ribbon";
import { Reveal } from "@/components/motion/reveal";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";
import { cn } from "@/lib/utils";

type HeroProps = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  actions?: ReactNode;
  /**
   * Sits beside the copy on wide screens. Dropped below `lg`: the hero is
   * pinned and already fills the viewport there, so a second column would only
   * push the copy off the screen it is meant to open.
   */
  media?: ReactNode;
  /** The home hero runs the ribbon; section pages get a plain ground. */
  ribbon?: boolean;
  className?: string;
};

/**
 * The opening screen.
 *
 * Pinned to the viewport rather than sitting in normal flow: the page's
 * content scrolls up and over it, so the hero is always what's underneath
 * until a later band has fully covered it. That requires a same-height
 * spacer right after it, or every following section would render 92svh too
 * high.
 *
 * Stacking needs no explicit z-index. `Band` is already `position: relative`
 * with no z-index of its own, which puts it in the "positioned, stack level
 * 0" paint layer; making the hero `fixed` puts it in that same layer. Within
 * one layer, later markup paints over earlier markup — so every band, being
 * later in the tree, already draws over the hero without any extra rule.
 * (Verified with elementFromPoint after scrolling — not just reasoned about,
 * since this exact tier is where CSS stacking intuitions go wrong.)
 */
export function Hero({
  eyebrow,
  title,
  lede,
  actions,
  media,
  ribbon = false,
  className,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null);
  const [covered, setCovered] = useState(false);

  // Spacer tracks the hero's real rendered height rather than assuming
  // 92svh: min-height content can legitimately push it taller.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new ResizeObserver(([entry]) => {
      setSpacerHeight(
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height,
      );
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // The hero's own box never leaves the viewport once fixed, so "is it
  // visible" can't be read off the hero itself — it has to come from the
  // spacer, whose scroll position marks exactly where the next section has
  // scrolled up far enough to cover the hero completely.
  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCovered(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(spacer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={heroRef}
        className={cn(
          "fixed inset-x-0 top-0 isolate flex min-h-[92svh] flex-col justify-center overflow-hidden bg-[#f7f6f4] py-28 md:py-32",
          className,
        )}
      >
        <GradientBackground position="50% 90%" to="#D9D9D9" />
        {ribbon ? <Ribbon paused={covered} /> : null}

        <div
          className={cn(
            "container-site relative z-10",
            // Only becomes two columns when there is something to put in the
            // second one; without media the copy keeps the layout it had.
            media
              ? "lg:grid lg:grid-cols-[minmax(0,560px)_1fr] lg:items-center lg:gap-16"
              : "",
          )}
        >
          <div className="flex flex-col gap-16 md:gap-20">
            <div className="flex max-w-[560px] flex-col items-start gap-7">
              <Reveal>
                <span className="inline-flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2b3440]">
                  <span aria-hidden className="size-2.5 bg-[#2b3440]" />
                  {eyebrow}
                </span>
              </Reveal>

              <Reveal delay={80}>
                {/* Sized to the copy column rather than to the viewport: at display-1
                  the second line runs under the ribbon and stops being
                  readable. Width stays capped to this same column, so the
                  larger type only ever wraps onto more lines instead of
                  reaching wider into the ribbon's side of the hero. Capped at
                  4.5rem (not growing further past md) because that's the
                  largest size at which "Find your people" and "Find your
                  place" each still fit this column on one line apiece. */}
                <h1 className="font-display text-[2.75rem] leading-[1.12] tracking-[-0.03em] text-[#2b3440] sm:text-[3.25rem] md:text-[4.5rem] md:leading-[1.05]">
                  {title}
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="max-w-[46ch] text-[17px] leading-[1.55] text-ink-62">
                  {lede}
                </p>
              </Reveal>
            </div>

            {actions ? (
              <Reveal delay={240} className="flex max-w-[560px] justify-start">
                <div className="flex flex-wrap items-center justify-start gap-3">
                  {actions}
                </div>
              </Reveal>
            ) : null}
          </div>

          {media ? (
            <Reveal delay={200} className="hidden lg:block">
              {media}
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* Reserves the hero's height in normal flow so the next section starts
          scrolling from below it, then slides up to cover it. */}
      <div
        ref={spacerRef}
        aria-hidden="true"
        className="min-h-[92svh]"
        style={
          spacerHeight ? { height: spacerHeight, minHeight: 0 } : undefined
        }
      />
    </>
  );
}
