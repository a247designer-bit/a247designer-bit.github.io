"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/type";

export type ShowcaseStep = {
  id: string;
  title: string;
  body: string;
  /**
   * The short read in the pinned column, under the step's own title. A summary
   * of `body`, not a repeat of it, since both are on screen at once.
   */
  summary?: string;
  icon?: ReactNode;
  /** A screen, a mockup or a clip. Sized by the card, not by itself. */
  media?: ReactNode;
};

type AppShowcaseProps = {
  eyebrow?: string;
  heading: ReactNode;
  headingId?: string;
  steps: ShowcaseStep[];
  /** Sits under the step list, at the bottom of the pinned column. */
  footer?: ReactNode;
  /**
   * Which accent this walkthrough runs on. `indigo` is Blookd Rental's, for
   * the workspace side of the product; everything that carries the accent —
   * the rail, the numbers, the title wipe, the CTA, the lit mockup — swaps
   * together because they all read the same variables.
   */
  accent?: "brand" | "indigo";
};

/**
 * The app walkthrough: a pinned column of steps on the left, the screens
 * themselves scrolling past on the right.
 *
 * The step list doubles as a progress indicator — each step sits on a rail that
 * fills as its own card crosses the middle of the screen, and the title paints
 * in behind it, so the column reads as a walkthrough rather than a menu.
 * Clicking a step scrolls to its card, so the list works as navigation too and
 * not only as decoration.
 *
 * Below `lg` the pinned column cannot work — there is no room beside it — so
 * the whole thing collapses to a plain vertical read and the step list is
 * dropped rather than stranded above the content it indexes.
 */
export function AppShowcase({
  eyebrow,
  heading,
  headingId,
  steps,
  footer,
  accent = "brand",
}: AppShowcaseProps) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement | null>(null);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const titleRefs = useRef<(HTMLElement | null)[]>([]);

  // The rail reads scroll position directly and writes each bar's height to the
  // DOM, so dragging through the section does not re-render React on every
  // frame — `active` is state because it changes once per step, heights are not
  // because they change continuously.
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (!cards.length) return;

      // Both the fill and the lit card key off the same line — the middle of
      // the viewport — so the rail and the glowing mockup can never disagree.
      const line = window.innerHeight / 2;
      let next = cards.length - 1;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const filled = rect.height
          ? Math.min(1, Math.max(0, (line - rect.top) / rect.height))
          : 0;

        const bar = barRefs.current[i];
        if (bar) bar.style.height = `${filled * 100}%`;

        // Same number drives the title's colour sweep, so the bar and the word
        // beside it are always filled to the same point.
        const title = titleRefs.current[i];
        if (title) title.style.setProperty("--wipe", `${filled * 100}%`);

        // The first step the line has not finished crossing is the current one.
        if (filled < 1 && next === cards.length - 1) next = i;
      });

      setActive((prev) => (prev === next ? prev : next));
      markListEdge();
    };

    // The step list scrolls inside the pinned column when the column runs out
    // of height. Left unmarked its cut edge lands mid-word, which reads as
    // broken rather than as "there is more" — so the fade goes on only while
    // there is genuinely something below, and comes off once you reach the end.
    const markListEdge = () => {
      const list = listRef.current;
      if (!list) return;
      const remaining = list.scrollHeight - list.clientHeight - list.scrollTop;
      // 4px, not 1: sub-pixel rounding should not put a fade on a list
      // that is, for every practical purpose, fully visible.
      list.dataset.moreBelow = remaining > 4 ? "true" : "false";
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    const list = listRef.current;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    list?.addEventListener("scroll", markListEdge, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      list?.removeEventListener("scroll", markListEdge);
    };
  }, [steps.length]);

  const goTo = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className={cn("container-site", accent === "indigo" && "accent-indigo")}>
      <div className="flex flex-col gap-16 lg:flex-row lg:gap-[clamp(56px,8vw,150px)]">
        <div className="lg:w-[420px] lg:shrink-0">
          {/* The rail carries a line of copy per step, so the pinned column
              runs tall. It pins tight to the header (which ends at 75px) to buy
              height, and takes a ceiling on top of that, because a sticky block
              taller than the screen would strand its own end below the fold for
              good.

              When it does hit that ceiling the STEP LIST is what gives way, not
              the column: heading and CTA are shrink-0 and the list scrolls
              inside them. Letting the whole column scroll instead put the CTA
              last in line, so on any viewport short by even 30px the primary
              action was silently sliced in half — and with the scrollbar hidden
              there was nothing to say it had been. Nothing is lost when the
              list scrolls: every step is also a card in the column beside it. */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-[100px] lg:max-h-[calc(100dvh-120px)]">
            {eyebrow ? <Eyebrow className="self-start shrink-0">{eyebrow}</Eyebrow> : null}

            <h2 id={headingId} className="text-display-2 lg:shrink-0">
              {heading}
            </h2>

            <ol
              ref={listRef}
              className="step-list hidden flex-col lg:flex lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
            >
              {steps.map((step, i) => (
                <li key={step.id} className="pb-5 last:pb-0">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className="flex w-full gap-4 text-left"
                  >
                    {/* The rail itself. `self-stretch` ties its length to the
                        step's copy, so each step owns its own segment. It does
                        not clip: the fill's glow has to bloom past the 2px
                        track to read as light at all. */}
                    <span
                      aria-hidden
                      className="relative w-[2px] shrink-0 self-stretch rounded-full bg-ink-12"
                    >
                      <span
                        ref={(el) => {
                          barRefs.current[i] = el;
                        }}
                        className="rail-fill absolute inset-x-0 top-0 block rounded-full"
                        style={{ height: 0 }}
                      />
                    </span>

                    <span className="flex flex-col gap-1.5">
                      {/* Number and title share a row — stacking them costs a
                          line of height per step, and the pinned column has to
                          clear the heading and the CTA as well. */}
                      <span className="flex items-baseline gap-2.5">
                        <span
                          className={cn(
                            "font-display text-[19px] leading-[1.15] tracking-[-0.025em] transition-colors duration-500",
                            i === active ? "text-primary" : "text-ink-62",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* No active/inactive colour here — the sweep is the
                            state. It rests at the quiet ink and fills to the
                            accent as this step's card goes by. */}
                        <span
                          ref={(el) => {
                            titleRefs.current[i] = el;
                          }}
                          className="rail-wipe font-display text-[19px] leading-[1.15] tracking-[-0.025em]"
                        >
                          {step.title}
                        </span>
                      </span>
                      {/* Held at ink-62 in every state: the ramp below it is
                          for rules and fills, not for type. Colour on the title
                          and the rail carries the highlight instead. */}
                      <span className="max-w-[34ch] text-[14px] leading-[1.5] text-ink-62">
                        {step.summary ?? step.body}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {footer ? <div className="hidden lg:block lg:shrink-0">{footer}</div> : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6">
          {steps.map((step, i) => (
            <article
              key={step.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex flex-col gap-6 rounded-[28px] bg-[var(--surface)] p-6 md:p-8"
            >
              {step.icon ? (
                <span className="text-foreground [&>svg]:size-9 [&>svg]:stroke-[1.25]">
                  {step.icon}
                </span>
              ) : null}

              <h3 className="text-[22px] leading-[1.15] tracking-[-0.025em]">
                {step.title}
              </h3>

              {step.media ? (
                <div
                  className={cn(
                    "transition-[filter] duration-700",
                    // See .showcase-glow in globals.css: it reads the accent
                    // rather than naming a colour, so the halo follows whichever
                    // brand this walkthrough is running on. The rest class is
                    // what it transitions FROM — the same accent at no
                    // strength, so the halo never passes through grey on its
                    // way in or out.
                    "showcase-glow-rest",
                    i === active && "showcase-glow",
                  )}
                >
                  {step.media}
                </div>
              ) : null}

              <p className="max-w-[52ch] text-[15px] leading-[1.55] text-ink-62">
                {step.body}
              </p>
            </article>
          ))}

          {footer ? <div className="lg:hidden">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
