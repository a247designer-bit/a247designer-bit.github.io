"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/site/type";

export type ShowcaseStep = {
  id: string;
  title: string;
  body: string;
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
};

/**
 * The app walkthrough: a pinned column of steps on the left, the screens
 * themselves scrolling past on the right.
 *
 * The step list doubles as a progress indicator — whichever card is nearest
 * the middle of the viewport is the one lit up. Clicking a step scrolls to its
 * card, so the list works as navigation too and not only as decoration.
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
}: AppShowcaseProps) {
  const [active, setActive] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the middle of the viewport rather than the
        // first intersecting one, so tall cards do not hold the highlight all
        // the way past the next card.
        const middle = window.innerHeight / 2;
        let best: { index: number; distance: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = cards.indexOf(entry.target as HTMLElement);
          if (index < 0) continue;
          const box = entry.boundingClientRect;
          const distance = Math.abs(box.top + box.height / 2 - middle);
          if (!best || distance < best.distance) best = { index, distance };
        }
        if (best) setActive(best.index);
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [steps.length]);

  const goTo = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="container-site">
      <div className="flex flex-col gap-16 lg:flex-row lg:gap-[clamp(56px,8vw,150px)]">
        <div className="lg:w-[420px] lg:shrink-0">
          <div className="flex flex-col gap-8 lg:sticky lg:top-[120px]">
            {eyebrow ? <Eyebrow className="self-start">{eyebrow}</Eyebrow> : null}

            <h2 id={headingId} className="text-display-2">
              {heading}
            </h2>

            <ul className="hidden flex-col items-start gap-4 lg:flex">
              {steps.map((step, i) => (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "rounded-[4px] px-3.5 py-2 text-left text-[15px] transition-colors duration-500",
                      i === active
                        ? "bg-[#FE5D14] text-white"
                        : "bg-ink-06 text-ink-62 hover:text-ink-62",
                    )}
                  >
                    {step.title}
                  </button>
                </li>
              ))}
            </ul>

            {footer ? <div className="hidden lg:block">{footer}</div> : null}
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
                    // drop-shadow (not box-shadow) follows the actual painted
                    // pixels of the mockup inside, so it hugs the phone's own
                    // silhouette through its transparent PNG edges rather than
                    // boxing this wrapper's full (wider) rectangle.
                    i === active &&
                      "drop-shadow-[0_0_40px_rgba(240,101,48,0.55)]",
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
