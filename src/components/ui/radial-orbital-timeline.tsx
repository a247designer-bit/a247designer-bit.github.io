"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Adapted from a community "radial orbital timeline" primitive.
 *
 * Trimmed from the source version: `date`, `status` and `energy` were a
 * generic project-timeline conceit (a completion badge, a fabricated
 * percentage) with no honest value for the steps this renders — Blookd's
 * network doesn't have a "60% energy" or an "in progress" state, and
 * inventing one to fill the expanded card would be exactly the kind of
 * decorative noise this project avoids elsewhere. What's kept — title,
 * content and the connected-node cross-links — all comes from real copy.
 *
 * Also dropped: the unused `viewMode` state (declared, set once at
 * construction, never changed — dead state in the source component).
 */

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export interface OrbitalTimelineItem {
  id: number;
  title: string;
  content: string;
  icon: React.ElementType;
  relatedIds: number[];
}

interface RadialOrbitalTimelineProps {
  items: OrbitalTimelineItem[];
  /** The mark shown at the centre of the orbit, e.g. an animated app icon. */
  centerMark?: React.ReactNode;
  className?: string;
}

/**
 * The orbit's own footprint at scale 1: the 384px ring, plus node radius 200
 * reaching past it, plus the node dot and its label — rounded up with a
 * little slack. Below this container width the whole thing scales down
 * rather than clipping or forcing horizontal scroll.
 */
const NATURAL_SIZE = 480;
const NATURAL_HEIGHT = 520;

export function RadialOrbitalTimeline({
  items,
  centerMark,
  className,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / NATURAL_SIZE));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      const opening = !prev[id];
      if (opening) newState[id] = true;

      if (opening) {
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(rotationTimer);
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;
    const nodeIndex = items.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / items.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;

    // Rounded before they ever reach a style prop: an unrounded
    // Math.cos/sin result serializes into the SSR HTML at full float
    // precision, and the browser's own style-attribute parser then re-quantizes
    // it on the client — two different (if numerically equivalent) strings,
    // which React's hydration check flags as a mismatch. Rounding here means
    // both sides already agree on the same short string.
    const x = round(radius * Math.cos(radian), 3);
    const y = round(radius * Math.sin(radian), 3);

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = round(
      Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))),
      4,
    );

    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = items.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ height: NATURAL_HEIGHT * scale }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div
        className="absolute flex items-center justify-center"
        ref={orbitRef}
        style={{
          width: NATURAL_SIZE,
          height: NATURAL_SIZE,
          transform: `scale(${scale})`,
          perspective: "1000px",
        }}
      >
        <div className="absolute z-10 flex size-[126px] items-center justify-center">
          {centerMark}
        </div>

        <div className="absolute size-96 rounded-full border border-white/10"></div>

        {items.map((item, index) => {
          const position = calculateNodePosition(index, items.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          const nodeStyle = {
            transform: `translate(${position.x}px, ${position.y}px)`,
            zIndex: isExpanded ? 200 : position.zIndex,
            opacity: isExpanded ? 1 : position.opacity,
          };

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              className="absolute cursor-pointer transition-all duration-700"
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              <div
                className={`absolute -inset-1 rounded-full ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                  width: "56px",
                  height: "56px",
                  left: "-8px",
                  top: "-8px",
                }}
              ></div>

              <div
                className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isExpanded
                    ? "scale-150 border-white bg-white text-black shadow-lg shadow-white/30"
                    : isRelated
                      ? "animate-pulse border-white bg-white/50 text-black"
                      : "border-white/40 bg-black text-white"
                }`}
              >
                <Icon size={16} />
              </div>

              <div
                className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isExpanded ? "scale-125 text-white" : "text-white/70"
                }`}
              >
                {item.title}
              </div>

              {isExpanded && (
                <Card className="absolute top-20 left-1/2 w-64 -translate-x-1/2 overflow-visible border-white/30 bg-black/90 shadow-xl shadow-white/10 backdrop-blur-lg">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/50"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-white/80">
                    <p>{item.content}</p>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="mb-2 flex items-center">
                          <LinkIcon size={10} className="mr-1 text-white/70" />
                          <h4 className="text-xs font-medium tracking-wider text-white/70 uppercase">
                            Connects to
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const relatedItem = items.find((i) => i.id === relatedId);
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="flex h-6 items-center rounded-none border-white/20 bg-transparent px-2 py-0 text-xs text-white/80 transition-all hover:bg-white/10 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleItem(relatedId);
                                }}
                              >
                                {relatedItem?.title}
                                <ArrowRight size={8} className="ml-1 text-white/60" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
