"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Which of the two apps each audience actually holds.
 *
 * The switch is the point of the section: people carry Blookd, hosts carry
 * Blookd Rental, and pros are the only ones who live in both — which is why the
 * de-emphasised app is dimmed rather than removed. Seeing the second phone slip
 * back is what tells you the other app still exists and who it belongs to.
 */

type AudienceId = "people" | "professionals" | "hosts";

/**
 * An app name, carrying the colour of its own store icon — orange for Blookd,
 * indigo for Blookd Rental. The two chips and the two marks on the stage are
 * the same pair of things, so naming them in the same colours is what lets the
 * copy and the mockups be read as one statement.
 */
type AppChip = { name: string; tone: "blookd" | "rental" };

type Audience = {
  id: AudienceId;
  tab: string;
  title: string;
  apps: AppChip[];
  points: string[];
};

const CHIP_TONE: Record<AppChip["tone"], string> = {
  blookd: "bg-primary text-primary-foreground",
  rental: "bg-[#413B96] text-white",
};

const AUDIENCES: Audience[] = [
  {
    id: "people",
    tab: "People",
    title: "App for People:",
    apps: [{ name: "Blookd", tone: "blookd" }],
    points: [
      "Find pros near you by service, style and price.",
      "See real work and availability before you commit.",
      "Book, rebook and keep every appointment in one place.",
    ],
  },
  {
    id: "professionals",
    tab: "Professionals",
    title: "Apps for Pros:",
    // Blookd Biz, not Blookd: the client app and the pro app are separate
    // builds off the same orange mark, and this is the side of the switch
    // where saying just "Blookd" would name the one the pro does NOT carry.
    apps: [
      { name: "Blookd Biz", tone: "blookd" },
      { name: "Blookd Rental", tone: "rental" },
    ],
    points: [
      "Get discovered by clients looking for your work.",
      "Take bookings and run your own schedule.",
      "Rent a chair or a studio for the days you need it.",
    ],
  },
  {
    id: "hosts",
    tab: "Hosts",
    title: "App for Hosts:",
    apps: [{ name: "Blookd Rental", tone: "rental" }],
    points: [
      "List a chair, room or station in minutes.",
      "Set your own availability, rates and house rules.",
      "Earn from space that would otherwise sit empty.",
    ],
  },
];

/**
 * Where each layer sits on the stage, per state.
 *
 * `x` is the layer's own centre as a percentage of the stage — the phones, the
 * copy and the icons all key off the same axis, so the copy can sit exactly on
 * top of the phone that has dropped back instead of merely near it. Written as
 * data rather than as three sets of classes because the whole design of this
 * section is the difference BETWEEN the three states.
 */
type Placement = {
  x: number;
  scale: number;
  blur: number;
  opacity: number;
  lifted: boolean;
};

const PHONE_PLACEMENT: Record<AudienceId, { blookd: Placement; rental: Placement }> = {
  people: {
    blookd: { x: 32, scale: 1, blur: 0, opacity: 1, lifted: true },
    rental: { x: 84, scale: 0.66, blur: 8, opacity: 0.55, lifted: false },
  },
  professionals: {
    blookd: { x: 19, scale: 0.88, blur: 0, opacity: 1, lifted: true },
    rental: { x: 81, scale: 0.88, blur: 0, opacity: 1, lifted: true },
  },
  hosts: {
    blookd: { x: 16, scale: 0.66, blur: 8, opacity: 0.55, lifted: false },
    rental: { x: 68, scale: 1, blur: 0, opacity: 1, lifted: true },
  },
};

/**
 * The copy block takes the side the prominent phone left free. `w` is its own
 * width on the stage: the three-up state has a phone on either side to clear,
 * the other two only have the dimmed mockup underneath.
 */
const COPY_PLACEMENT: Record<AudienceId, { x: number; w: number }> = {
  people: { x: 70, w: 33 },
  professionals: { x: 50, w: 27 },
  hosts: { x: 30, w: 33 },
};

/**
 * The app icons, one per store listing.
 *
 * `people` and `pros` are the same app in two dresses — the client build and
 * the pro build — so they share the left mark and never appear together.
 */
const ICONS = [
  { src: "/images/app-icon-people@3x.png", alt: "Blookd app icon", x: 12, states: ["people"] },
  { src: "/images/app-icon-pros@3x.png", alt: "Blookd Biz app icon", x: 12, states: ["professionals"] },
  {
    src: "/images/app-icon-rental@3x.png",
    alt: "Blookd Rental app icon",
    x: 88,
    states: ["professionals", "hosts"],
  },
] as const;

/**
 * The mockups, shot straight on rather than in isometric.
 *
 * They used to be lit with the brand halo the product-page walkthroughs use,
 * one accent each. That reading is gone from this block: the tabs above now
 * carry the app's colour, and having the phone glow it as well said the same
 * thing twice over an already busy band. Which phone is being talked about is
 * still legible from its scale and from the blur on the other one.
 */
type Phone = {
  key: "blookd" | "rental";
  src: string;
  alt: string;
  /** States where this slot shows a different build of the same app. */
  byAudience?: Partial<Record<AudienceId, { src: string; alt: string }>>;
};

const PHONES: Phone[] = [
  {
    key: "blookd",
    src: "/images/app-phone-blookd-2.png",
    alt: "The Blookd app showing top rated providers near you",
    // The chips already say a pro carries Blookd Biz rather than Blookd, and
    // this slot was still holding up the client app underneath them — the one
    // screen on the stage that belongs to somebody else. Same orange mark,
    // same left position, different build: what changes is the screen.
    byAudience: {
      professionals: {
        src: "/images/app-phone-biz.png",
        alt: "The Blookd Biz app showing a pro's next appointment and the day's schedule",
      },
    },
  },
  {
    key: "rental",
    src: "/images/app-phone-rental-2.png",
    alt: "The Blookd Rental app showing workspaces available in Denver",
  },
];

/**
 * The upright mockups are portrait — 886x1812, a hair under 1:2 — where the
 * isometric pair they replace was almost square. So the stage is now sized by
 * how tall a phone should be rather than by how wide, and every other figure
 * on it is derived from that one number.
 *
 * `--stage-h` is the height of the stage; a phone stands 76% of it, which at
 * the 886/1812 aspect makes it 0.372 of the stage tall in width. Written as a
 * calc off the same variable so the two can never drift apart when the stage
 * is retuned.
 */
/**
 * The stage, laid out for a phone.
 *
 * Above md it is an absolute canvas and the figures are placed on it by
 * percentage. There is no room for that below md, so it collapses to the same
 * shape in all three states: the copy takes the full width, the mockups sit in
 * a row underneath it.
 *
 * The copy used to take the side the prominent mockup left free, mirroring the
 * desktop placement. It only had ~150px to say anything in, which is where the
 * three-phone state had already refused to go — professionals carries two
 * mockups and had the copy above them for exactly this reason. Sending the
 * other two the same way costs the mirrored composition and buys every state
 * the full 327px for its words.
 *
 * 40% is the halved mockup — 260px on the old stacked layout, ~131px here —
 * and it is 40% in every state, so a phone is the same size whichever tab you
 * are on.
 */
/**
 * The colour the active tab is lit in — the app that tab is about.
 *
 * People and professionals both open an orange-marked app, hosts open Rental,
 * so hosts is the only one that turns. Lightened well past --brand-2 itself:
 * at full strength the indigo is darker than the band it sits on and reads as
 * a hole rather than as a highlight.
 */
const TAB_TINT: Record<AudienceId, string> = {
  people: "var(--primary)",
  professionals: "var(--primary)",
  hosts: "color-mix(in oklab, var(--brand-2) 62%, white)",
};

const MOBILE_COPY = "order-1 w-full";

/**
 * How wide a mockup stands below md, by how many are standing.
 *
 * 40% was set when the copy sat beside the phone and the row had to hold
 * both. It does not any more: the copy took the full width above, so a state
 * carrying one phone has the whole row for it and a 131px mockup under a
 * 327px card read as a footnote to it. Two still share the row, and 40% each
 * is what fits them with a gap.
 */
const MOBILE_PHONE = { 1: "order-2 w-[60%]", 2: "order-2 w-[40%]" } as const;

const PHONE_WIDTH = "md:w-[calc(var(--stage-h)*0.372)]";

export function AppAudienceSwitcher() {
  const [active, setActive] = useState<AudienceId>("people");
  const baseId = useId();
  const current = AUDIENCES.find((a) => a.id === active) ?? AUDIENCES[0];
  const activeIndex = AUDIENCES.findIndex((a) => a.id === active);
  // How many mockups this state stands up — the same `lifted` flag that
  // decides which of them shows below md at all.
  const liftedCount = PHONES.filter(
    (phone) => PHONE_PLACEMENT[active][phone.key].lifted,
  ).length as 1 | 2;

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* The switch. A single sliding pill rather than three independently
          styled buttons, so the change of state reads as one movement. */}
      <div
        role="tablist"
        aria-label="Choose who the app is for"
        // -mx-2 on a phone: "Professionals" needs 96px at 15px and an equal
        // third of the panel only gave it 106px to sit in, so the longest of
        // the three labels was clipping its own pill. Widened first, then the
        // label dropped a point — at 14px it measures 90px in a 111px cell,
        // which is the difference between fitting and being seen to fit.
        className="relative -mx-2 grid w-[calc(100%+1rem)] grid-cols-3 rounded-full bg-black/25 p-1 ring-1 ring-inset ring-white/10 md:mx-auto md:w-full md:max-w-[420px]"
      >
        {/* A wash of the app's own colour rather than a white slab. The white
            pill was the brightest thing on the page and pulled rank on the
            mockups it is only meant to index; at a fifth strength the tint
            marks the tab without competing, and the label carries the state in
            weight instead of in contrast.

            Colour is inline because it changes with the state and the shade is
            mixed from it three ways. It transitions alongside the slide, so
            moving from professionals to hosts is one movement that also turns
            orange into lilac. */}
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out)]"
          style={{
            transform: `translateX(${activeIndex * 100}%)`,
            backgroundColor: `color-mix(in oklab, ${TAB_TINT[active]} 20%, transparent)`,
            boxShadow: [
              `0 0 18px color-mix(in oklab, ${TAB_TINT[active]} 30%, transparent)`,
              `inset 0 0 0 1px color-mix(in oklab, ${TAB_TINT[active]} 45%, transparent)`,
            ].join(", "),
          }}
        />
        {AUDIENCES.map((audience) => (
          <button
            key={audience.id}
            type="button"
            role="tab"
            id={`${baseId}-${audience.id}-tab`}
            aria-selected={audience.id === active}
            aria-controls={`${baseId}-panel`}
            onClick={() => setActive(audience.id)}
            className={cn(
              "relative z-10 rounded-full px-1.5 py-2.5 text-[14px] transition-colors duration-300 md:px-3 md:text-[15px]",
              audience.id === active
                ? "font-bold text-white"
                : "text-white/65 hover:text-white",
            )}
          >
            {audience.tab}
          </button>
        ))}
      </div>

      {/* The stage. Absolute only from md up — below that there is no room for
          two phones side by side, so it collapses to the prominent phone with
          the copy under it and the dimmed app is dropped rather than shrunk to
          nothing. */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-${active}-tab`}
        className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-8 md:block md:h-[var(--stage-h)] md:[--stage-h:480px] lg:[--stage-h:680px]"
      >
        {PHONES.map((phone) => {
          const place = PHONE_PLACEMENT[active][phone.key];
          const shot = phone.byAudience?.[active] ?? phone;
          return (
            <div
              key={phone.key}
              className={cn(
                "transition-[left,transform,filter,opacity] duration-700 ease-[var(--ease-out)]",
                MOBILE_PHONE[liftedCount],
                // Below md only the app this audience actually opens is shown;
                // the desktop stage merely dims the other one.
                !place.lifted && "hidden md:block",
                "md:absolute md:top-[44%] md:block md:w-auto md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 md:scale-[var(--s)]",
                PHONE_WIDTH,
                "md:blur-[var(--b)] md:opacity-[var(--o)]",
                place.lifted ? "md:z-20" : "md:z-10",
              )}
              style={
                {
                  left: `${place.x}%`,
                  "--s": place.scale,
                  "--b": `${place.blur}px`,
                  "--o": place.opacity,
                } as CSSProperties
              }
            >
              {/* No halo. The nested element that used to carry
                  `.showcase-glow` went with it — it only existed because the
                  glow writes `filter` and the wrapper above is already using
                  that property for the dimmed state's blur.

                  The cast shadow stays: it is what sets the mockup on the band
                  rather than lighting it, and without it the phone floats. */}
              <Image
                src={shot.src}
                alt={place.lifted ? shot.alt : ""}
                width={886}
                height={1812}
                className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
              />
            </div>
          );
        })}

        {/* `md:contents` dissolves this row from md up, so each icon positions
            against the stage rather than against a wrapper — one set of icons
            that reads as a row on a phone and as two marks flanking the
            mockups on a desktop. */}
        <div className="order-4 flex w-full items-center justify-center gap-4 md:contents">
          {ICONS.map((icon) => {
            const shown = (icon.states as readonly string[]).includes(active);
            return (
              <div
                key={icon.src}
                aria-hidden={!shown}
                className={cn(
                  "transition-[left,opacity,transform] duration-700 ease-[var(--ease-out)]",
                  // 86%, not the 82% the isometric pair left room for. The
                  // mark hangs from its top edge, not its centre, so the figure
                  // has to clear the phone's feet at 82% AND leave its own
                  // height — up to 76px of a 680px stage — above the bottom.
                  "md:absolute md:top-[86%] md:z-30 md:block md:-translate-x-1/2",
                  shown ? "md:opacity-100" : "hidden md:block md:scale-75 md:opacity-0",
                )}
                style={{ left: `${icon.x}%` }}
              >
                <Image
                  src={icon.src}
                  alt={shown ? icon.alt : ""}
                  // 240px for a mark that is never drawn above 76 — see the
                  // note in get-app-fab on why these are rasters now.
                  width={240}
                  height={240}
                  className="size-[clamp(52px,5vw,76px)]"
                />
              </div>
            );
          })}
        </div>

        {/* The copy. Keyed on the active id so the words swap with a fade
            instead of morphing letter by letter as the block slides.

            It rides on its own frosted card rather than straight on the band:
            in two of the three states it sits directly over the dimmed mockup,
            and type laid on a blurred photograph is unreadable however heavy
            the text shadow. The card also gives the block a straight left edge
            to hang from, which is what makes the ragged lines read as set
            rather than as spilled. */}
        <div
          className={cn(
            MOBILE_COPY,
            "transition-[left,width] duration-700 ease-[var(--ease-out)]",
            "md:absolute md:top-[44%] md:z-30 md:w-[var(--cw)] md:-translate-x-1/2 md:-translate-y-1/2",
          )}
          style={
            {
              // Width is a var, not an inline `width`: below md the block is in
              // normal flow and has to stay full-bleed, so the per-state figure
              // must not reach it.
              left: `${COPY_PLACEMENT[active].x}%`,
              "--cw": `${COPY_PLACEMENT[active].w}%`,
            } as CSSProperties
          }
        >
          <div
            key={active}
            // p-4 below md. Beside a mockup the card is ~195px wide, and 20px
            // of padding on each side was taking a quarter of that off the
            // line length.
            className="animate-in fade-in rounded-[16px] bg-[#0A1C15]/45 p-4 text-balance ring-1 ring-inset ring-white/10 backdrop-blur-md duration-500 md:p-6"
          >
            {/* 19px in the narrow column: at 22px "App for People:" measured
                wider than the line it had, so the title broke in the middle of
                its own phrase. */}
            <h3 className="font-display text-[19px] leading-[1.1] tracking-[-0.03em] text-foreground md:text-[clamp(22px,2.1vw,30px)]">
              {current.title}
            </h3>

            {/* One chip per app, so "Blookd Biz + Blookd Rental" stops being a
                sentence to parse and becomes two things you can count. */}
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {current.apps.map((app) => (
                <li
                  key={app.name}
                  className={cn(
                    "rounded-[6px] px-2 py-1 text-[12px] font-medium uppercase leading-none tracking-[0.06em]",
                    CHIP_TONE[app.tone],
                  )}
                >
                  {app.name}
                </li>
              ))}
            </ul>

            <ul className="mt-3.5 flex flex-col gap-2 border-t border-white/10 pt-3.5 md:mt-4 md:gap-2.5 md:pt-4">
              {current.points.map((point) => (
                <li
                  key={point}
                  className="text-pretty text-[13px] leading-[1.5] text-ink-70 md:text-[14px]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
