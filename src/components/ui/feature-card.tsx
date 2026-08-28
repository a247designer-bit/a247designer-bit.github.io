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
 *
 * None of that survives below sm, and it should not. The reveal is a pointer
 * effect on a card that is a square — at one per row, a square is a 327px tall
 * block carrying two lines of copy, and four of them are most of a phone
 * screen of mostly nothing. So the card turns on its side: copy on the left,
 * the illustration in full colour on the right, at about half the height.
 *
 * The background keeps the scale it had. `object-cover` on a square source
 * takes its scale from the width whether the box is square or not, so the
 * short card is showing the same picture at the same size and simply losing
 * the bottom of it — `object-top` is the whole of that.
 */
export function FeatureCard({
  title,
  body,
  image,
  icon,
  tintedAtRest = false,
  className,
}: {
  title: string;
  body: string;
  /** Square illustration, sized by the card. */
  image?: string;
  icon?: ReactNode;
  /**
   * Leave a third of the illustration's colour in the resting state instead of
   * draining it completely. For the rows where the pictures are the argument
   * and a wall of grey undersells them.
   */
  tintedAtRest?: boolean;
  className?: string;
}) {
  return (
    <div
      // Square from sm up, so the card is the same object whatever length its
      // copy runs to and the illustration is never cropped to an odd shape.
      // Below that the height is the copy's: a fixed one either clips the
      // longest card or pads out the shortest, and the run of them lands
      // within a few pixels of each other anyway.
      className={cn(
        // A flex column below sm so the row inside can stretch to the card.
        // `h-full` cannot do it: the card's own height comes from min-height
        // with `height` still auto, and a percentage height against an auto
        // one resolves to auto — the row stayed as tall as its copy and left
        // the illustration short of the bottom edge.
        "group relative flex min-h-[150px] w-full flex-col overflow-hidden rounded-[24px] bg-[var(--surface)] sm:block sm:aspect-square sm:min-h-0",
        className,
      )}
    >
      {image ? (
        <>
          {/* The resting state: faint enough that the copy on top of it is
              still reading against the card's own surface rather than against a
              picture.

              `tintedAtRest` leaves 35% of the colour in. It costs nothing in
              legibility: `grayscale()` mixes toward the pixel's own luminance,
              so a partial one moves chroma and leaves relative luminance
              exactly where it was — measured across all seven illustrations,
              the worst-case contrast for the body copy is identical at 100%
              and at 65% grey. What changes is only how much colour is left,
              from 0 to a mean 7.7/255 of chroma once the 22% is applied. The
              hover still goes to the full picture, so the reveal keeps its
              distance to travel. */}
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "object-cover object-top opacity-[0.22] transition-opacity duration-700 ease-[var(--ease-out)] sm:object-center sm:group-hover:opacity-0",
              tintedAtRest ? "grayscale-[.65]" : "grayscale",
            )}
          />

          {/* The colour, and the scrim that keeps the copy legible on top of
              it, clipped together — so the darkening arrives with the colour
              instead of trailing it. 130% clears the far corners: from the
              bottom centre of a square they sit 111.8% away.

              From sm up only. It is a hover, and below sm the colour is not
              hiding — it is sitting on the right of the card. */}
          <div
            className={cn(
              "absolute inset-0 hidden [clip-path:circle(0%_at_50%_100%)] sm:block",
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
              sizes="(min-width: 1024px) 25vw, 50vw"
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

      {/* A row below sm, a column above it. From sm up the copy sits at the top
          of the square and the room left over below it is simply room — that
          lower half is where the illustration does its work. */}
      <div className="relative flex flex-1 items-stretch gap-4 p-5 sm:h-full sm:flex-col sm:justify-start sm:gap-3 sm:p-6 md:p-7">
        {/* `sm:contents` dissolves this wrapper from sm up, so the icon, the
            title and the copy become direct children of the column again and
            keep its spacing rather than inheriting a second gap. */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 sm:contents">
          {icon ? (
            <span className="text-foreground transition-colors duration-700 sm:mb-3 sm:group-hover:text-white [&>svg]:size-8 [&>svg]:stroke-[1.25]">
              {icon}
            </span>
          ) : null}
          <h3 className="text-[18px] leading-[1.2] tracking-[-0.025em] transition-colors duration-700 sm:text-[19px] sm:group-hover:text-white">
            {title}
          </h3>
          {/* ink-70 at rest, not the ink-62 the rest of the site's secondary
              copy runs at. This paragraph is the only one on the site sitting
              over a picture — faint, at 22%, but enough to move the ground
              under it. Measured across all eleven illustrations, ink-62 bottoms
              out at 3.79:1 on the light bands and 3.74:1 on the dark one;
              ink-70 takes those to 4.64:1 and 4.28:1, and to 4.73:1 / 4.55:1
              once the worst 5% of pixels are set aside. Only the light rows
              clear AA at their single worst pixel, but both clear it where the
              text actually is.

              Hover goes to pure white, not white/85: the scrim underneath was
              measured against white, and 85% would quietly spend the margin
              that measurement bought. It is scoped to sm and up with the scrim
              that earns it — white copy below that would be white on a card
              with nothing behind it. Size and weight still separate this from
              the title in both states. */}
          <p className="text-[14px] leading-[1.5] text-ink-70 transition-colors duration-700 sm:text-[15px] sm:leading-[1.55] sm:group-hover:text-white">
            {body}
          </p>
        </div>

        {/* The illustration in full colour, phone only — the same file the
            background is drawn from, so it is still one request. Width rather
            than a square: the card's height is set by the copy beside it, and
            a square would push the two out of proportion on the longest one. */}
        {image ? (
          <div className="relative w-[34%] shrink-0 overflow-hidden rounded-[14px] sm:hidden">
            <Image
              src={image}
              alt=""
              fill
              sizes="34vw"
              className="object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
