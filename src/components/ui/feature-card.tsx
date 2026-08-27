import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A feature card whose illustration is greyed back until you point at it, then
 * takes its colour from a circle rising out of the bottom edge.
 *
 * The picture is drawn TWICE from one file: a desaturated, mostly transparent
 * base that is always there, and a full-colour copy above it clipped to a
 * circle anchored at the bottom centre. Hovering grows that circle past the
 * card's far corners. Two layers rather than a filter transition because
 * `filter` cannot be revealed shape-first — the whole card would desaturate at
 * once, which is the effect this one is deliberately not.
 *
 * `clip-path`, not a mask: `circle()` interpolates in every current browser,
 * where an animated `mask-image` gradient needs a registered custom property to
 * move at all. Both images point at the same URL, so the pair costs one
 * request.
 */
export function FeatureCard({
  title,
  body,
  image,
  icon,
  className,
}: {
  title: string;
  body: string;
  /** Square illustration, sized by the card. */
  image?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      // Square, so the card is the same object whatever length its copy runs
      // to, and so the illustration is never cropped to an odd shape.
      className={cn(
        "group relative aspect-square w-full overflow-hidden rounded-[24px] bg-[var(--surface)]",
        className,
      )}
    >
      {image ? (
        <>
          {/* The resting state: grey, and faint enough that the copy on top of
              it is still reading against the card's own surface rather than
              against a picture. */}
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-[0.22] grayscale transition-opacity duration-700 ease-[var(--ease-out)] group-hover:opacity-0"
          />

          {/* The colour, and the scrim that keeps the copy legible on top of
              it, clipped together — so the darkening arrives with the colour
              instead of trailing it. 130% clears the far corners: from the
              bottom centre of a square they sit 111.8% away. */}
          <div
            className={cn(
              "absolute inset-0 [clip-path:circle(0%_at_50%_100%)]",
              "transition-[clip-path] duration-700 ease-[var(--ease-out)]",
              "group-hover:[clip-path:circle(130%_at_50%_100%)]",
              // The circle IS the animation. With motion turned down it still
              // has to arrive, so it snaps rather than being cancelled.
              "motion-reduce:transition-none",
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Weighted to the top, where the copy is, and let go by 75% so
                the lower half of the illustration — the half the eye actually
                came for — stays at full strength. An even scrim would have to
                be dark enough for the worst pixel behind the text everywhere,
                which is how a picture ends up looking like a grey box.

                The two upper stops are measured, not judged: at 0.85/0.65 the
                worst of the eleven illustrations (set-your-availability, which
                is pale almost edge to edge) still puts white 15px copy at
                4.8:1 over its 95th-percentile pixel. Lighter than this and
                three of them drop under 4.5:1. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.65)_45%,rgba(0,0,0,0.12)_75%,rgba(0,0,0,0.04)_100%)]"
            />
          </div>
        </>
      ) : null}

      {/* Copy sits at the top of the square, inside the padding, and the room
          left over below it is simply room — that lower half is where the
          illustration does its work. */}
      <div className="relative flex h-full flex-col justify-start gap-3 p-6 md:p-7">
        {icon ? (
          <span className="mb-3 text-foreground transition-colors duration-700 [&>svg]:size-8 [&>svg]:stroke-[1.25] group-hover:text-white">
            {icon}
          </span>
        ) : null}
        <h3 className="text-[19px] leading-[1.2] tracking-[-0.025em] transition-colors duration-700 group-hover:text-white">
          {title}
        </h3>
        {/* Pure white, not white/85: the scrim above was measured against
            white, and 85% would quietly spend the margin that measurement
            bought. Size and weight still separate this from the title. */}
        <p className="text-[15px] leading-[1.55] text-ink-62 transition-colors duration-700 group-hover:text-white">
          {body}
        </p>
      </div>
    </div>
  );
}
