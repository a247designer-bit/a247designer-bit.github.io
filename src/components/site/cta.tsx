"use client";

import Link from "next/link";
import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

const BASE =
  "relative isolate inline-flex items-center justify-center overflow-hidden rounded-[8px] px-6 py-3 text-[15px] font-medium whitespace-nowrap transition-colors duration-300";

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

/**
 * Pointer/keyboard tracking behind every pill CTA below: a circular fill
 * grows from wherever the pointer entered (or the pill's centre, on keyboard
 * focus), and the label flips to its "covered" colour once the fill has
 * swept it. Same mechanic as the origin-button primitive in components/ui,
 * adapted here for Next's `Link` rather than a plain `<button>` since every
 * CTA on the site navigates.
 */
function useOriginFill<T extends HTMLElement>() {
  const nodeRef = React.useRef<T | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = React.useState(0);

  const updateOrigin = React.useCallback((x: number, y: number) => {
    const node = nodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
  }, []);

  const fromPointer = React.useCallback(
    (event: React.PointerEvent<T>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
    },
    [updateOrigin],
  );

  const fromCenter = React.useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    updateOrigin(rect.width / 2, rect.height / 2);
  }, [updateOrigin]);

  const showFill = hovered || isPressed;

  React.useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!(node && showFill)) return;

    const measure = () => {
      const rect = node.getBoundingClientRect();
      setCoverSize(getCoverDiameter(rect.width, rect.height, origin.x, origin.y));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [showFill, origin.x, origin.y]);

  const handlers = {
    onPointerEnter: (event: React.PointerEvent<T>) => {
      fromPointer(event);
      setHovered(true);
    },
    onPointerLeave: () => {
      setHovered(false);
      setIsPressed(false);
    },
    onPointerDown: (event: React.PointerEvent<T>) => {
      if (event.button !== 0) return;
      fromPointer(event);
      setIsPressed(true);
      setHovered(true);
    },
    onPointerUp: () => setIsPressed(false),
    onPointerCancel: () => setIsPressed(false),
    onFocus: (event: React.FocusEvent<T>) => {
      if (event.currentTarget.matches(":focus-visible")) {
        fromCenter();
        setHovered(true);
      }
    },
    onBlur: () => {
      setIsPressed(false);
      setHovered(false);
    },
  };

  return {
    nodeRef,
    showFill,
    origin,
    coverSize,
    handlers,
    transition: { duration: FILL_DURATION, ease: FILL_EASE },
  };
}

function Fill({
  show,
  size,
  x,
  y,
  transition,
  className,
}: {
  show: boolean;
  size: number;
  x: number;
  y: number;
  transition: { duration: number; ease: readonly [number, number, number, number] };
  className: string;
}) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={{ scale: show && size > 0 ? 1 : 0 }}
      transition={transition}
      className={cn(
        "pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
        className,
      )}
      style={{ width: size, height: size, left: x, top: y }}
    />
  );
}

type CtaProps = Omit<
  React.ComponentProps<typeof Link>,
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
>;

/** The one saturated element on the page. Used once per section, at most. */
export function CtaPrimary({ className, children, ...props }: CtaProps) {
  const { nodeRef, showFill, origin, coverSize, handlers, transition } =
    useOriginFill<HTMLAnchorElement>();
  return (
    <MotionLink
      {...props}
      {...handlers}
      ref={nodeRef}
      whileTap={{ scale: 0.985 }}
      style={{ color: showFill ? "var(--ink)" : undefined }}
      className={cn(
        BASE,
        "bg-linear-to-b from-brand-hi to-brand text-white",
        className,
      )}
    >
      <Fill show={showFill} size={coverSize} x={origin.x} y={origin.y} transition={transition} className="bg-white" />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </MotionLink>
  );
}

export function CtaSecondary({ className, children, ...props }: CtaProps) {
  const { nodeRef, showFill, origin, coverSize, handlers, transition } =
    useOriginFill<HTMLAnchorElement>();
  return (
    <MotionLink
      {...props}
      {...handlers}
      ref={nodeRef}
      whileTap={{ scale: 0.985 }}
      style={{ color: showFill ? "var(--ink)" : undefined }}
      className={cn(BASE, "bg-foreground text-background", className)}
    >
      <Fill show={showFill} size={coverSize} x={origin.x} y={origin.y} transition={transition} className="bg-background" />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </MotionLink>
  );
}

export function CtaQuiet({ className, children, ...props }: CtaProps) {
  const { nodeRef, showFill, origin, coverSize, handlers, transition } =
    useOriginFill<HTMLAnchorElement>();
  return (
    <MotionLink
      {...props}
      {...handlers}
      ref={nodeRef}
      whileTap={{ scale: 0.985 }}
      style={{ color: showFill ? "var(--paper)" : undefined }}
      className={cn(BASE, "bg-ink-06 text-foreground", className)}
    >
      <Fill show={showFill} size={coverSize} x={origin.x} y={origin.y} transition={transition} className="bg-foreground" />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </MotionLink>
  );
}

export function TextLink({ className, ...props }: CtaProps) {
  return (
    <Link
      {...props}
      className={cn(
        // min-h-11 is the 44px touch floor. It also happens to match the pill
        // buttons these sit beside, so the row lines up on its centres.
        "inline-flex min-h-11 items-center text-[15px] text-ink-62 underline decoration-ink-40 underline-offset-4 transition-colors hover:text-foreground",
        className,
      )}
    />
  );
}
