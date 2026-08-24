import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "paper" | "quiet" | "dark";

const TONES: Record<Tone, string> = {
  paper: "bg-paper text-foreground",
  quiet: "bg-quiet text-foreground",
  // `dark` flips the token set rather than hard-coding colours, so anything
  // nested — buttons, muted copy, borders — resolves correctly on the band.
  dark: "dark bg-paper text-foreground",
};

/**
 * What a card sitting on this band should be filled with.
 *
 * Always a step AWAY from the band's own ground, never toward it: a card that
 * is darker than the light band it sits on reads as a hole rather than as a
 * raised surface. Cards consume this as bg-[var(--surface)].
 */
const SURFACES: Record<Tone, string> = {
  paper: "var(--quiet)",
  quiet: "var(--paper)",
  dark: "color-mix(in oklab, var(--ink) 7%, transparent)",
};

type BandProps = {
  children: ReactNode;
  tone?: Tone;
  /** Rounds the top corners and lifts the band over the one above it. */
  stacked?: boolean;
  /** Vertical rhythm. `tall` is for the scroll-driven sections. */
  size?: "default" | "tight" | "tall";
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
};

const SIZES = {
  tight: "py-16 md:py-24",
  default: "py-24 md:py-40",
  tall: "py-24 md:py-40",
} as const;

/**
 * One section of the page.
 *
 * Bands are flat colour blocks that run the full width; their content sits on
 * the 1160 column via `.container-site`. `stacked` gives the band a rounded top
 * edge that rides over the previous one — the layered look the whole page is
 * built from.
 */
export function Band({
  children,
  tone = "paper",
  stacked = false,
  size = "default",
  id,
  className,
  ...rest
}: BandProps) {
  return (
    <section
      id={id}
      style={{ "--surface": SURFACES[tone] } as CSSProperties}
      className={cn(
        "relative w-full",
        TONES[tone],
        SIZES[size],
        stacked && "-mt-8 rounded-t-[var(--radius-band)]",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
