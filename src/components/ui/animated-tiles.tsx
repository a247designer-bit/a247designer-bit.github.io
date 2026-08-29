"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A picture assembled from a grid of tiles, each breathing at its own pace.
 *
 * The mask is the point: tiles are brightest through the middle and fade to
 * nothing at the edges and along the bottom, so the image resolves out of the
 * page rather than sitting in a box on it.
 *
 * Adapted from the supplied component rather than dropped in as-is. Four
 * things had to change for it to live on a page instead of in a demo.
 *
 * ONE animation loop, not ninety-six. The original called
 * requestAnimationFrame per tile, so a 12x8 grid scheduled 96 callbacks every
 * frame, each writing a style of its own. The motion is identical driven from
 * a single loop, and it is the difference between one scheduled task per frame
 * and ninety-six on a phone.
 *
 * Percentages, not pixels. The original sized tiles in px and laid them out
 * with `float`, which needs the container to be exactly cols x tileSize wide.
 * A grid of `1fr` columns and a background sized in hundreds of percent gives
 * the same sprite offsets at any width, so the figure is fluid.
 *
 * It stops when nobody is watching — off-screen or in a background tab — and
 * it does not run at all under prefers-reduced-motion, where the tiles simply
 * hold at their mask value. Ninety-six elements pulsing is a lot of motion to
 * put in front of someone who asked for less of it.
 *
 * And no default image. The original pointed at a raw.githubusercontent URL;
 * a hero that fetches its own picture from someone else's repository is one
 * outage away from an empty box.
 */

/**
 * How bright each tile is allowed to get, row by row.
 *
 * Weighted to the top on purpose — the last rows fall away to nothing, which is
 * what makes the picture dissolve downward instead of ending on an edge. The
 * grid is derived from this rather than passed in, so the two can never
 * disagree.
 *
 * Eleven rows, not the supplied twelve: the twelfth was zero across, eight
 * tiles that could never be seen holding an twelfth of the figure's height as
 * guaranteed blank. Dropping it changes nothing on screen and takes the field
 * from 2:3 to a less overbearing 8:11.
 */
const MASK = [
  [0.0, 0.2, 0.4, 0.6, 0.6, 0.4, 0.2, 0.0],
  [0.2, 0.4, 0.8, 1.0, 1.0, 0.6, 0.4, 0.2],
  [0.2, 0.4, 1.0, 1.0, 1.0, 0.8, 0.6, 0.2],
  [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
  [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
  [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
  [0.2, 0.4, 0.8, 1.0, 1.0, 0.8, 0.6, 0.2],
  [0.2, 0.4, 0.6, 0.8, 0.8, 0.6, 0.4, 0.1],
  [0.1, 0.2, 0.4, 0.4, 0.4, 0.4, 0.2, 0.1],
  [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1],
  [0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0],
];

const ROWS = MASK.length;
const COLS = MASK[0].length;

/** How far below its mask value a tile is allowed to dip. */
const VARIANCE = 0.4;

export function AnimatedTiles({
  imageUrl,
  label,
  className,
}: {
  /** Local path. Cropped to the grid's own aspect — see ROWS/COLS. */
  imageUrl: string;
  /** What the picture is, for anyone who cannot see it. */
  label: string;
  className?: string;
}) {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const tiles = Array.from(el.children) as HTMLElement[];

    // The mask is the resting state, so it is also the whole of the
    // reduced-motion state: the picture is there, it just holds still.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (still.matches) return;

    // Each tile breathes between its mask value and a little under it, over
    // its own duration and starting at its own point in the cycle — which is
    // what keeps the field from pulsing as one sheet.
    const plan = tiles.map((_, i) => {
      const max = MASK[Math.floor(i / COLS)][i % COLS];
      const period = (Math.random() * 0.25 + 0.75) * 2;
      return {
        max,
        min: Math.max(0, max - VARIANCE),
        period,
        offset: Math.random() * period,
      };
    });

    let frame = 0;
    let running = false;

    const draw = (now: number) => {
      const t = now / 1000;
      for (let i = 0; i < tiles.length; i++) {
        const { max, min, period, offset } = plan[i];
        if (max === 0) continue;
        // Ping-pong: up the first half of the period, back down the second.
        const phase = (t + offset) % period;
        const half = period / 2;
        const k = phase < half ? phase / half : (period - phase) / half;
        tiles[i].style.opacity = String(min + (max - min) * k);
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !document.hidden) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(el);

    const onVisibility = () => {
      if (!document.hidden && onScreen) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={field}
      role="img"
      aria-label={label}
      className={cn("grid w-full", className)}
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        // Square tiles, so the field carries the grid's own aspect and the
        // picture behind it is never stretched to fit.
        aspectRatio: `${COLS} / ${ROWS}`,
      }}
    >
      {MASK.flatMap((row, r) =>
        row.map((max, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              opacity: max,
              backgroundImage: `url(${imageUrl})`,
              // The sprite trick in percentages: the image is laid out COLS
              // boxes wide and ROWS tall, and each tile shows its own share of
              // it. Resolution-independent, unlike a pixel offset.
              backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
              backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
            }}
          />
        )),
      )}
    </div>
  );
}
