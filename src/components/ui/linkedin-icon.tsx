// linkedin - from Lucide Animated (https://lucide-animated.com)
// Author: dmytro (@pqoqubbw)
// License: MIT. Source: https://github.com/pqoqubbw/icons
"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { HTMLAttributes, MouseEvent } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface LinkedinIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LinkedinIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

/** The three parts of the mark draw on together, so they share one variant. */
const DRAW_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: "linear",
      opacity: { duration: 0.1 },
    },
  },
};

const LinkedinIcon = forwardRef<LinkedinIconHandle, LinkedinIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    // One control for all three shapes rather than three identical ones: they
    // run the same variant on the same trigger, so separate controls could
    // only ever fall out of step with each other.
    const controls = useAnimation();
    const reduced = useReducedMotion();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start(reduced ? "normal" : "animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else if (!reduced) {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter, reduced],
    );

    const handleMouseLeave = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          aria-hidden
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
            initial="normal"
            variants={DRAW_VARIANTS}
          />
          <motion.rect
            animate={controls}
            height="12"
            initial="normal"
            variants={DRAW_VARIANTS}
            width="4"
            x="2"
            y="9"
          />
          <motion.circle
            animate={controls}
            cx="4"
            cy="4"
            initial="normal"
            r="2"
            variants={DRAW_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

LinkedinIcon.displayName = "LinkedinIcon";

export { LinkedinIcon };
