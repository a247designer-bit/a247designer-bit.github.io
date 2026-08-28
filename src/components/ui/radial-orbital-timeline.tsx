"use client";

import { useEffect, useRef, useState } from "react";
import { Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Adapted from a community "radial orbital timeline" primitive.
 *
 * Trimmed from the source version: `date`, `status` and `energy` were a
 * generic project-timeline conceit (a completion badge, a fabricated
 * percentage) with no honest value for the steps this renders — Blookd's
 * network doesn't have a "60% energy" or an "in progress" state, and
 * inventing one to fill the expanded card would be exactly the kind of
 * decorative noise this project avoids elsewhere.
 *
 * The source's cross-link buttons are gone too. They jumped the orbit to a
 * neighbouring node, which the ring already draws for you; the expanded card
 * now names the app the step is actually done in instead, which is the one
 * thing the diagram cannot show.
 *
 * Also dropped: the unused `viewMode` state (declared, set once at
 * construction, never changed — dead state in the source component).
 */

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Which app you are actually holding while you do this step.
 *
 * `tone` rather than a colour, and the same two the app switcher uses: Blookd
 * and Blookd Biz are one product family off the orange mark, Blookd Rental is
 * the indigo one. A step can name more than one — booking happens in Blookd
 * and lands in Blookd Biz, and saying only one of those would be half the
 * sentence.
 */
export type OrbitalApp = { name: string; tone: "blookd" | "rental" };

export interface OrbitalTimelineItem {
  id: number;
  title: string;
  content: string;
  icon: React.ElementType;
  /** Drives the orbit's relation lines and the pulse on connected nodes. */
  relatedIds: number[];
  apps: OrbitalApp[];
}

const APP_TONE: Record<OrbitalApp["tone"], string> = {
  blookd: "bg-primary text-primary-foreground",
  rental: "bg-[#413B96] text-white",
};

interface RadialOrbitalTimelineProps {
  items: OrbitalTimelineItem[];
  /** The mark shown at the centre of the orbit, e.g. an animated app icon. */
  centerMark?: React.ReactNode;
  className?: string;
}

/** Where the nodes sit, measured from the centre of the orbit. */
const ORBIT_RADIUS = 160;

/**
 * The orbit's own footprint at scale 1: the node radius, plus half a node dot
 * reaching past it, plus the label that hangs underneath — rounded up with a
 * little slack. Below this container width the whole thing scales down rather
 * than clipping or forcing horizontal scroll.
 *
 * The radius is deliberately tighter than the ring it draws: the nodes are the
 * point of this thing, so the footprint is spent on them rather than on empty
 * orbit. A smaller footprint also means a larger scale on a phone, where the
 * whole composition is shrunk to fit the column.
 */
const NATURAL_SIZE = 450;
const NATURAL_HEIGHT = 470;

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
    const radius = ORBIT_RADIUS;
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

        <div className="absolute size-[304px] rounded-full border border-white/10"></div>

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
              {/* The halo, kept at 1.4x the dot so it reads as glow around it
                  rather than as a second ring. */}
              <div
                className={`absolute rounded-full ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                  width: "90px",
                  height: "90px",
                  left: "-13px",
                  top: "-13px",
                }}
              ></div>

              <div
                className={`flex size-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isExpanded
                    ? "scale-150 border-white bg-white text-black shadow-lg shadow-white/30"
                    : isRelated
                      ? "animate-pulse border-white bg-white/50 text-black"
                      : "border-white/40 bg-black text-white"
                }`}
              >
                <Icon size={26} />
              </div>

              {/* Centred under the dot: left-aligned labels hung visibly off to
                  one side once they grew to reading size. Sized to match the
                  ecosystem sub-copy beside the orbit, and left at the project's
                  one tracking value rather than the source's wide setting. */}
              <div
                className={`absolute top-[72px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[15px] leading-[1.5] font-medium transition-all duration-300 ${
                  isExpanded ? "scale-125 text-white" : "text-white/70"
                }`}
              >
                {item.title}
              </div>

              {isExpanded && (
                <Card className="absolute top-[112px] left-1/2 w-64 -translate-x-1/2 overflow-visible border-white/30 bg-black/90 shadow-xl shadow-white/10 backdrop-blur-lg">
                  <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-white/50"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-white/80">
                    <p>{item.content}</p>

                    {/* The apps this step is done in, in place of the
                        cross-links to neighbouring nodes that used to sit here.
                        Those were buttons that jumped the orbit sideways, which
                        answered a question nobody had — the ring already shows
                        what a step connects to. Which app you open to do it is
                        the thing you cannot see from the diagram.

                        Labels, not buttons: there is nowhere to go from here.
                        The colours are the app switcher's, so a pill and a chip
                        further down the page name the same thing the same way. */}
                    {item.apps.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="mb-2 flex items-center">
                          <Smartphone size={10} className="mr-1 text-white/70" />
                          <h4 className="text-xs font-medium tracking-wider text-white/70 uppercase">
                            Use with
                          </h4>
                        </div>
                        <ul className="flex flex-wrap gap-1.5">
                          {item.apps.map((app) => (
                            <li
                              key={app.name}
                              className={`rounded-[5px] px-2 py-1 text-[11px] leading-none font-medium tracking-[0.06em] uppercase ${APP_TONE[app.tone]}`}
                            >
                              {app.name}
                            </li>
                          ))}
                        </ul>
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
