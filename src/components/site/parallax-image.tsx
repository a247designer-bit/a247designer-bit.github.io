"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * A background image that drifts slower than the page scrolls.
 *
 * The image is rendered oversized (12% past each edge of its clipped
 * container) and translated by that same amount as the section crosses the
 * viewport, so the drift never uncovers empty space at the top or bottom.
 */
export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-x-0 -top-[12%] -bottom-[12%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
