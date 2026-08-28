// facebook - from Lucide Animated (https://lucide-animated.com)
// Author: dmytro (@pqoqubbw)
// License: MIT. Source: https://github.com/pqoqubbw/icons
"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import type { HTMLAttributes, MouseEvent } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface FacebookIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface FacebookIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FACEBOOK_VARIANTS: Variants = {
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

const FacebookIcon = forwardRef<FacebookIconHandle, FacebookIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    // The stylesheet's reduced-motion block can only reach CSS animation and
    // transition; this one is driven from script, so it has to opt out itself.
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
        {/* viewBox added: the path is drawn in a 24-unit box, and without one
            it is laid out at 1:1 against width/height — at any size but 24 the
            mark is cropped rather than scaled. */}
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
            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
            initial="normal"
            variants={FACEBOOK_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

FacebookIcon.displayName = "FacebookIcon";

export { FacebookIcon };
