"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * A background image that drifts slower than the page scrolls.
 *
 * The image is rendered oversized (`amount` past each edge of its clipped
 * container) and translated by that same amount as the section crosses the
 * viewport, so the drift never uncovers empty space at the top or bottom. The
 * two numbers are one number for exactly that reason — they cannot be tuned
 * apart without opening a gap.
 *
 * Loads lazily. A parallax band only has anything to parallax against once it
 * is being scrolled through, which means it is never the opening screen — so
 * fetching it up front only takes bandwidth away from what is.
 */
export function ParallaxImage({
  src,
  mobileSrc,
  mobileUpTo = 639,
  alt,
  amount = 12,
  objectPosition,
}: {
  src: string;
  /**
   * A differently composed crop for narrow screens.
   *
   * Art direction, not a second resolution: `object-cover` can only ever
   * choose which part of one frame to throw away, and a 2145x803 photograph
   * dropped into a square hole loses two thirds of itself no matter which part
   * it keeps. This picks a file instead of a crop.
   */
  mobileSrc?: string;
  /** Widest viewport that still gets `mobileSrc`, in px. */
  mobileUpTo?: number;
  alt: string;
  /** Percent of travel, and of overscan. Smaller reads as a lighter drift. */
  amount?: number;
  /**
   * Which part of the frame survives when the container is squarer than the
   * photograph. Worth setting whenever the subject is off to one side.
   */
  objectPosition?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${amount}%`, `${amount}%`],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* The overscan is an inline style, not a class: `-top-[${amount}%]`
          would be assembled at runtime and Tailwind, which finds classes by
          scanning source text, would never generate the rule. */}
      <motion.div
        style={{ y, top: `-${amount}%`, bottom: `-${amount}%` }}
        className="absolute inset-x-0"
      >
        {/* A <picture>, not next/image, once there are two crops to choose
            between. next/image has no art-direction escape hatch, and the two
            obvious workarounds both cost a download: rendering both and hiding
            one leaves the hidden file eligible to be fetched, and swapping the
            src from script means the wrong one is already in flight by the
            time the script runs. A <source media> is decided before either
            starts.

            Nothing is lost by dropping next/image here: the optimizer is off
            for this export (see next.config.ts), so it was emitting a plain
            <img> at the original file anyway. `loading` and `decoding` are
            spelled out because they were its defaults, not the tag's. */}
        <picture>
          {mobileSrc ? (
            <source media={`(max-width: ${mobileUpTo}px)`} srcSet={mobileSrc} />
          ) : null}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
            style={{ objectPosition }}
          />
        </picture>
      </motion.div>
    </div>
  );
}
