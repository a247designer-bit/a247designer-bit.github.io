"use client";

import Image from "next/image";
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
  alt,
  amount = 12,
  objectPosition,
}: {
  src: string;
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
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
    </div>
  );
}
