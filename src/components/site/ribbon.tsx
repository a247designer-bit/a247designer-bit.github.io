"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { MarqueeAlongSvgPath } from "@/components/ui/marquee-along-svg-path";

/**
 * The tile ribbon behind the hero.
 *
 * Tiles ride an SVG path via the `MarqueeAlongSvgPath` primitive. The path is
 * authored in a 996x330 space, so the track keeps those exact pixel
 * dimensions and is scaled here — not by the primitive's own responsive mode
 * — because the transform this stage needs (rotate 120°, then scale until
 * both path endpoints clear the viewport) is specific to this one path, not
 * a generic fit-to-box.
 *
 * The horizontal flip is done with the ROTATION SIGN, not by mirroring
 * anything. A mirror is the obvious first idea and it is wrong twice over:
 *
 *   - Mirroring the curve's own coordinates (x → 996 − x) is almost invisible
 *     here, because rotating the result by 120° lays it back down on the same
 *     diagonal. Algebraically M·R(120)·M·P reduces to R(−120)·P — so the flip
 *     the reference actually shows is just the negative angle.
 *   - Wrapping the stage in a CSS scaleX(-1) does flip the composition, but it
 *     mirrors the tile images along with it, which would show as soon as any
 *     tile carries a face or lettering.
 *
 * So: the originally-authored curve, rotated −120°. The tail then exits
 * bottom-right as in the reference, and the artwork stays un-mirrored.
 */

const PATH =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const TRACK_W = 996;
const TRACK_H = 330;
/** Negative: this is the horizontal flip. See the note above. */
const ROTATION = -120;

const TILES = [
  ["05-client-avatar.webp", "Client portrait"],
  ["01-scissors-comb.webp", "Scissors and comb"],
  ["04-hairstylist-avatar.webp", "Hairstylist portrait"],
  ["03-salon-chair.webp", "Salon chair"],
  ["13-community-portraits.webp", "Portraits from the Blookd community"],
  ["06-manicure-tools.webp", "Manicure tools"],
  ["10-nail-pro-avatar.webp", "Nail professional portrait"],
  ["02-barber-tool-grid.webp", "Barber tools"],
  ["11-curly-hair.webp", "Curly hair styling"],
  ["07-workstation-diptych.webp", "Workstation"],
  ["08-makeup-brushes.webp", "Makeup brushes"],
  ["12-workspace-elements.webp", "Workspace details"],
  ["09-skincare-tools.webp", "Skincare tools"],
] as const;

const RAD = (ROTATION * Math.PI) / 180;
const COS = Math.cos(RAD);
const SIN = Math.sin(RAD);
const BOX_W = Math.abs(TRACK_W * COS) + Math.abs(TRACK_H * SIN);
const BOX_H = Math.abs(TRACK_W * SIN) + Math.abs(TRACK_H * COS);

/** Path endpoints, relative to the centre of the track box. */
const ENDS = [
  { x: 1 - TRACK_W / 2, y: 209.434 - TRACK_H / 2 },
  { x: 995 - TRACK_W / 2, y: 156.5 - TRACK_H / 2 },
];

type RibbonProps = {
  /**
   * True once the hero is fully covered by whatever scrolled over it. The
   * marquee unmounts rather than just hiding — that's what actually stops its
   * requestAnimationFrame loop and drops the tile DOM, instead of paying for
   * an animation nobody can see.
   */
  paused?: boolean;
};

export function Ribbon({ paused = false }: RibbonProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;

    const fit = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;

      // Pushes the ribbon right, off the copy column. The flipped rotation
      // swings the loop further left than the old one did, so this is a
      // bigger nudge than the 12% the un-flipped version needed.
      const dx = (30 / 100) * TRACK_W;

      // Size by the stage height, so the ribbon runs off the top and bottom
      // and occupies roughly the right 60% of the width. The width term only
      // takes over on a short, wide screen.
      let scale = Math.max(h / BOX_H, (w / BOX_W) * 0.55, 0.9) * 1.12;

      // Then grow it until both ends have cleared the edges. The margin covers
      // half a tile's rotated diagonal, so the tile sitting on an endpoint is
      // hidden too, not just the point.
      const outside = (s: number) =>
        ENDS.every(({ x, y }) => {
          const rx = (x * COS - y * SIN) * s + dx;
          const ry = (x * SIN + y * COS) * s;
          return Math.abs(rx) > w / 2 + 110 || Math.abs(ry) > h / 2 + 110;
        });
      for (let i = 0; i < 40 && !outside(scale); i++) scale *= 1.08;

      track.style.setProperty("--ribbon-scale", String(scale));
      track.style.setProperty("--ribbon-x", `${dx}px`);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      /*
       * On a wide screen the ribbon owns the right of the hero and the copy
       * owns the left, so both can be full strength and, at lg, draggable.
       * Below lg there is no such split — the ribbon runs straight through
       * the headline — so it drops back to an inert texture and lets the
       * type win; pointer-events-none there also keeps it out of the way of
       * touch scrolling.
       */
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.18] lg:pointer-events-auto lg:opacity-100"
    >
      <div
        ref={trackRef}
        className="absolute left-1/2 top-1/2 h-[330px] w-[996px] origin-center"
        style={{
          transform: `translate(-50%, -50%) translate(var(--ribbon-x, 0px), 0) rotate(${ROTATION}deg) scale(var(--ribbon-scale, 1.2))`,
        }}
      >
        {paused ? null : (
          <MarqueeAlongSvgPath
            path={PATH}
            viewBox="0 0 996 330"
            width={TRACK_W}
            height={TRACK_H}
            className="absolute inset-0"
            repeat={2}
            baseVelocity={reducedMotion ? 0 : 4}
            slowdownOnHover
            slowDownFactor={0.28}
            draggable={!reducedMotion}
            dragSensitivity={0.12}
            dragVelocityDecay={0.94}
            grabCursor
          >
            {TILES.map(([src, alt], i) => {
              const tilt = ((i * 47) % 15) - 7;
              return (
                <div key={src} style={{ transform: `rotate(${tilt}deg)` }} className="size-[78px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/carousel/${src}`}
                    alt={alt}
                    draggable={false}
                    className="size-full rounded-[3px] object-cover shadow-[0_3px_10px_rgba(26,26,26,0.10)]"
                  />
                </div>
              );
            })}
          </MarqueeAlongSvgPath>
        )}
      </div>
    </div>
  );
}
