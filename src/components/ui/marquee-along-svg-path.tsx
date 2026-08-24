"use client";

import React, { type RefObject, useEffect, useId, useRef } from "react";
import {
  motion,
  type MotionValue,
  type SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Adapted from a community "marquee along an SVG path" primitive.
 *
 * Two changes from the original source, both load-bearing rather than
 * stylistic:
 *
 * 1. Per-item motion values were computed inline inside an `items.map()` —
 *    calling hooks from within a loop callback, which breaks React's rules of
 *    hooks (the callback is not itself a component). Extracted into
 *    `MarqueeItem` so every hook call sits at the top level of a real
 *    component, one instance per tile.
 * 2. The non-responsive path (`responsive` off) sized the inner `<svg>` with
 *    `w-full h-full`, which resolves against a shrink-to-fit ancestor with no
 *    definite size — the box collapses to nothing until `responsive` runs its
 *    own layout effect. Fixed sizing (as this project always needs) now sets
 *    literal pixel dimensions from the `width`/`height` props, so the whole
 *    stack sizes itself deterministically without relying on the responsive
 *    path at all.
 *
 * `cssVariableInterpolation` (per-item CSS custom property interpolation) and
 * the raw-`HTMLElement` half of `scrollContainer`'s type were dropped: the
 * former needs a variable-length array of hook calls, which has no
 * rules-of-hooks-safe implementation, and the latter was never valid — the
 * scroll container has to be a ref, not an already-resolved element.
 */

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return (((value - min) % range) + range) % range + min;
};

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;

  // Path properties
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;

  // SVG properties
  width?: string | number;
  height?: string | number;
  viewBox?: string;

  // Marquee properties
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;

  // Scroll properties
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null>;

  // Item repetition
  repeat?: number;

  // Drag properties
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;

  // Z-index properties
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;

  // Responsive properties
  responsive?: boolean;
}

type MarqueeItemProps = {
  child: React.ReactNode;
  itemIndex: number;
  itemCount: number;
  repeatIndex: number;
  path: string;
  baseOffset: MotionValue<number>;
  easing?: (value: number) => number;
  enableRollingZIndex: boolean;
  zIndexBase: number;
  zIndexRange: number;
  draggable: boolean;
  grabCursor: boolean;
  onHoverChange: (hovering: boolean) => void;
};

/** One tile. Its own component so its motion values are real hook calls, not calls inside a loop. */
function MarqueeItem({
  child,
  itemIndex,
  itemCount,
  repeatIndex,
  path,
  baseOffset,
  easing,
  enableRollingZIndex,
  zIndexBase,
  zIndexRange,
  draggable,
  grabCursor,
  onHoverChange,
}: MarqueeItemProps) {
  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / itemCount;
    const wrapped = wrap(0, 100, v + position);
    return `${easing ? easing(wrapped / 100) * 100 : wrapped}%`;
  });

  const currentOffsetDistance = useMotionValue(0);

  useEffect(() => {
    return itemOffset.on("change", (value: string) => {
      const match = value.match(/^([\d.]+)%$/);
      if (match?.[1]) currentOffsetDistance.set(parseFloat(match[1]));
    });
  }, [itemOffset, currentOffsetDistance]);

  const zIndex = useTransform(currentOffsetDistance, (value) =>
    Math.floor(zIndexBase + (value / 100) * zIndexRange),
  );

  return (
    <motion.div
      className={cn(
        "absolute top-0 left-0",
        draggable && grabCursor && "cursor-grab",
      )}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        // The default anchor is the box's top-left corner, not its centre —
        // without this every tile sits with the path point at its corner
        // rather than centred on it.
        offsetAnchor: "50% 50%",
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
      }}
      aria-hidden={repeatIndex > 0}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {child}
    </motion.div>
  );
}

export function MarqueeAlongSvgPath({
  children,
  className,

  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  repeat = 3,

  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,

  responsive = false,
}: MarqueeAlongSvgPathProps) {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const pathRef = useRef<SVGPathElement>(null);

  // Responsive scaling via direct DOM manipulation (no re-renders).
  useEffect(() => {
    if (!responsive) return;

    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    const originalWidth = vbWidth || 100;
    const originalHeight = vbHeight || 100;

    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;

      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;
      const scale = Math.min(wrapperWidth / originalWidth, wrapperHeight / originalHeight);

      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;
      const offsetX = (wrapperWidth - scaledWidth) / 2;
      const offsetY = (wrapperHeight - scaledHeight) / 2;

      marqueeContainer.style.width = `${originalWidth}px`;
      marqueeContainer.style.height = `${originalHeight}px`;
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [responsive, viewBox]);

  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => ({
        child,
        repeatIndex,
        itemIndex: repeatIndex * childrenArray.length + childIndex,
        key: `${childIndex}-${repeatIndex}`,
      })),
    );
  }, [children, repeat]);

  // useId, not Math.random: stable across renders and safe to call during
  // render (Math.random is an impure call React now flags outright).
  const generatedId = useId();
  const id = pathId || `marquee-path-${generatedId}`;

  const { scrollY } = useScroll({ container: scrollContainer || container });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const directionFactor = useRef(direction === "normal" ? 1 : -1);

  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }

    hoverFactorValue.set(isHovered.current ? (slowdownOnHover ? slowDownFactor : 1) : 1);

    let moveBy =
      directionFactor.current * baseVelocity * (delta / 1000) * smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      else if (velocityFactor.get() > 0) directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    if (draggable) {
      moveBy += dragVelocity.current;
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }
      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocity.current = 0;
      }
    }

    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;
    const current = { x: e.clientX, y: e.clientY };
    const deltaX = current.x - lastPointerPosition.current.x;
    const deltaY = current.y - lastPointerPosition.current.y;
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const projectedDelta = deltaX > 0 ? delta : -delta;
    dragVelocity.current = projectedDelta * dragSensitivity;
    lastPointerPosition.current = current;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grab";
  };

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <div ref={marqueeContainerRef} className="relative" style={{ contain: "layout style" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className={responsive ? "h-full w-full" : undefined}
          style={
            responsive
              ? undefined
              : {
                  width: typeof width === "number" ? `${width}px` : width,
                  height: typeof height === "number" ? `${height}px` : height,
                  display: "block",
                }
          }
        >
          <path id={id} d={path} stroke={showPath ? "currentColor" : "none"} fill="none" ref={pathRef} />
        </svg>

        {items.map(({ child, repeatIndex, itemIndex, key }) => (
          <MarqueeItem
            key={key}
            child={child}
            itemIndex={itemIndex}
            itemCount={items.length}
            repeatIndex={repeatIndex}
            path={path}
            baseOffset={baseOffset}
            easing={easing}
            enableRollingZIndex={enableRollingZIndex}
            zIndexBase={zIndexBase}
            zIndexRange={zIndexRange}
            draggable={draggable}
            grabCursor={grabCursor}
            onHoverChange={(v) => {
              isHovered.current = v;
            }}
          />
        ))}
      </div>
    </div>
  );
}
