import Image from "next/image";

/**
 * The three app icons, cycling, as the mark at the centre of the orbit.
 *
 * The order is the network's own: the person's app, the professional's, the
 * one both of them book space in. It is the same order the audience switcher
 * further down the section uses, so the two read as one argument.
 *
 * Pure CSS on three stacked images rather than a video. The keyframes live in
 * globals.css next to a note on what the video was doing wrong; the short
 * version is that Safari drops a WebM's alpha channel, which put a black
 * square in the middle of the orbit on every iPhone.
 */
const CYCLE = [
  { src: "/images/app-icon-people@3x.png", app: "Blookd" },
  { src: "/images/app-icon-pros@3x.png", app: "Blookd Biz" },
  { src: "/images/app-icon-rental@3x.png", app: "Blookd Rental" },
];

/** One pass through all three, matched to the video this replaced. */
const CYCLE_SECONDS = 7.86;

/**
 * Where in its own keyframes an icon has finished arriving — the 9% mark in
 * `app-icon-cycle`. Every icon is held back by it, which puts the first one
 * already on screen at t=0 rather than fading up from an empty centre. Run
 * without it, the orbit opens around nothing for the first two fifths of a
 * second, once, on load.
 */
const ENTERED_AT = CYCLE_SECONDS * 0.09;

export function AppIconCycle() {
  return (
    // Labelled once, as a group. Three icons that swap on a timer are one
    // object to a screen reader, not three images to announce in turn.
    <div
      role="img"
      aria-label="The Blookd, Blookd Biz and Blookd Rental app icons"
      className="relative grid size-full place-items-center"
    >
      {CYCLE.map((icon, i) => (
        <Image
          key={icon.src}
          src={icon.src}
          alt=""
          aria-hidden
          width={240}
          height={240}
          // 57% of the frame — the size the icon sat at inside the old
          // 126px video, so the orbit's centre keeps its weight.
          className="col-start-1 row-start-1 w-[57%]"
          style={{
            animation: `app-icon-cycle ${CYCLE_SECONDS}s var(--ease-out) ${(
              (CYCLE_SECONDS / 3) * i -
              ENTERED_AT
            ).toFixed(3)}s infinite`,
            // The base state the reduced-motion rule in globals.css falls back
            // to when it cuts every animation to nothing: without it all three
            // would settle on the keyframe they end at, which is invisible.
            opacity: i === 0 ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
