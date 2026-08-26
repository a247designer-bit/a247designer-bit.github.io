"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Heart, LayoutGrid, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { WORKSPACE_CATEGORIES } from "@/lib/workspace-categories";

export type SpotlightShortcut = {
  /** What the placeholder reads while this one is hovered. */
  label: string;
  icon: ReactNode;
  /**
   * Cycle the placeholder through these instead of showing `label`. The
   * categories droplet uses it to name the whole catalogue one item at a time,
   * which no single label could do.
   */
  cycle?: string[];
};

const SHORTCUTS: SpotlightShortcut[] = [
  {
    label: "Browse categories",
    icon: <LayoutGrid />,
    cycle: WORKSPACE_CATEGORIES,
  },
  { label: "Search Location", icon: <MapPin /> },
  { label: "Search my Favorites", icon: <Heart /> },
];

/** How long each category holds before the next one swaps in. */
const CYCLE_MS = 1400;

/**
 * The gooey merge. Blur, then crush the alpha ramp so near-opaque pixels snap
 * back to solid — neighbouring shapes fuse where their blurs overlap. The
 * source is blended back over the top so text and icons stay crisp; only the
 * backgrounds gel.
 */
function GooeyFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden className="absolute size-0" focusable="false">
      <filter id={id}>
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" result="blurred" />
        <feColorMatrix
          in="blurred"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 18 -9"
          result="gooey"
        />
        <feBlend in="SourceGraphic" in2="gooey" />
      </filter>
    </svg>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="block whitespace-nowrap text-ink-62"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * The search field from the discovery mock: a pill that the category, location
 * and favourites droplets peel away from when you reach for it.
 *
 * Inline rather than an overlay — it sits in the page as the picture of the
 * feature, so it never takes focus on load and never covers anything.
 */
export function SpotlightSearch({ className }: { className?: string }) {
  // useId's output carries punctuation that is not valid in a url(#…)
  // reference, so it is stripped down to a bare word.
  const filterId = `gooey-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [open, setOpen] = useState(false);
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [query, setQuery] = useState("");
  const closeTimer = useRef<number | null>(null);

  const cycling = hoveredShortcut !== null && SHORTCUTS[hoveredShortcut].cycle;

  // Only runs while the categories droplet is hovered. The index is rewound by
  // whoever starts the hover, not here, so this effect never writes state
  // synchronously on its way in.
  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(
      () => setCycleIndex((i) => (i + 1) % cycling.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [cycling]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const results = query
    ? WORKSPACE_CATEGORIES.filter((c) =>
        c.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : [];

  const placeholder =
    hoveredResult !== null
      ? results[hoveredResult]
      : cycling
        ? cycling[cycleIndex]
        : hoveredShortcut !== null
          ? SHORTCUTS[hoveredShortcut].label
          : "Search";

  /** Rewind the cycle so the catalogue always reads from its first item. */
  const enterShortcut = (i: number) => {
    setHoveredShortcut(i);
    setCycleIndex(0);
  };

  // Focus opens the droplets too: on a touch screen hover never fires, and
  // without this the whole point of the component would never show up there.
  const show = (next: boolean) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    if (next) {
      setOpen(true);
      return;
    }
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setHoveredShortcut(null);
    }, 120);
  };

  return (
    <div className={cn("w-full", className)}>
      <GooeyFilter id={filterId} />

      <div
        onMouseEnter={() => show(true)}
        onMouseLeave={() => show(false)}
        style={{ filter: `url(#${filterId})` }}
        className={cn(
          "flex w-full items-start justify-end gap-3",
          "[&_svg]:size-5 [&_svg]:stroke-[1.5] sm:[&_svg]:size-6",
        )}
      >
        <motion.div
          layout
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-[var(--surface)] shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex h-12 items-center gap-2.5 px-4 sm:h-14 sm:px-5">
            <Search className="shrink-0 text-ink-62" />
            <div className="relative min-w-0 flex-1 text-[15px] sm:text-[17px]">
              {!query && <Placeholder text={placeholder} />}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => show(true)}
                onBlur={() => show(false)}
                aria-label="Search Blookd"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <AnimatePresence>
            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseLeave={() => setHoveredResult(null)}
                className="flex max-h-64 flex-col gap-0.5 overflow-y-auto border-t border-border p-2"
              >
                {results.length === 0 ? (
                  <p className="px-2 py-3 text-[14px] text-ink-62">
                    Nothing matches “{query.trim()}” yet.
                  </p>
                ) : (
                  results.map((result, i) => (
                    <motion.a
                      key={result}
                      href="/workspaces"
                      onMouseEnter={() => setHoveredResult(i)}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.18 }}
                      className="group flex items-center gap-3 rounded-[16px] px-2 py-2 transition-colors hover:bg-ink-06"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center text-ink-62">
                        <LayoutGrid />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[15px]">
                        {result}
                      </span>
                      <ChevronRight className="shrink-0 text-ink-62 opacity-0 transition-opacity group-hover:opacity-100" />
                    </motion.a>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {open &&
            !query &&
            SHORTCUTS.map((shortcut, i) => (
              <motion.button
                key={shortcut.label}
                type="button"
                aria-label={shortcut.label}
                onMouseEnter={() => enterShortcut(i)}
                onFocus={() => {
                  show(true);
                  enterShortcut(i);
                }}
                layout
                initial={{ scale: 0.7, x: -64 * (i + 1) }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0.7, x: 64 * (SHORTCUTS.length - i - 1) }}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  duration: 0.7,
                  delay: i * 0.05,
                }}
                // Hidden on phones: three droplets plus a field that can still
                // hold "Search my Favorites" do not both fit a 342px column,
                // and a clipped placeholder is worse than no droplets. The
                // field alone reads fine there.
                className="hidden size-14 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--surface)] text-ink-62 opacity-60 shadow-[0_2px_20px_rgba(0,0,0,0.06)] transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 sm:flex"
              >
                {shortcut.icon}
              </motion.button>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
