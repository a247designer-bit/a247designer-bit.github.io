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
    apps: [
      { name: "Blookd", tone: "blookd" },
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
  { src: "/images/app-icon-people.svg", alt: "Blookd app icon", x: 12, states: ["people"] },
  { src: "/images/app-icon-pros.svg", alt: "Blookd for pros app icon", x: 12, states: ["professionals"] },
  {
    src: "/images/app-icon-rental.svg",
    alt: "Blookd Rental app icon",
    x: 88,
    states: ["professionals", "hosts"],
  },
] as const;

const PHONES = [
  {
    key: "blookd" as const,
    src: "/images/app-phone-blookd.png",
    alt: "The Blookd app showing top rated providers near you",
  },
  {
    key: "rental" as const,
    src: "/images/app-phone-rental.png",
    alt: "The Blookd Rental app showing workspaces available in Denver",
  },
];

export function AppAudienceSwitcher() {
  const [active, setActive] = useState<AudienceId>("people");
  const baseId = useId();
  const current = AUDIENCES.find((a) => a.id === active) ?? AUDIENCES[0];
  const activeIndex = AUDIENCES.findIndex((a) => a.id === active);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {/* The switch. A single sliding pill rather than three independently
          styled buttons, so the change of state reads as one movement. */}
      <div
        role="tablist"
        aria-label="Choose who the app is for"
        className="relative mx-auto grid w-full max-w-[420px] grid-cols-3 rounded-full bg-black/25 p-1 ring-1 ring-inset ring-white/10"
      >
        {/* Held off pure white on purpose. At full white the pill is the
            brightest thing on the page and pulls rank on the mockups it is
            only meant to index; letting the band's own green through at 20%
            keeps it clearly active without shouting. */}
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-white/80 shadow-[0_1px_6px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[var(--ease-out)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
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
              "relative z-10 rounded-full px-3 py-2.5 text-[15px] transition-colors duration-300",
              audience.id === active
                ? "text-[#0f1b16]"
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
        className="relative flex flex-col items-center gap-8 md:block md:h-[400px] lg:h-[470px]"
      >
        {PHONES.map((phone) => {
          const place = PHONE_PLACEMENT[active][phone.key];
          return (
            <div
              key={phone.key}
              className={cn(
                "w-full max-w-[320px] transition-[left,transform,filter,opacity] duration-700 ease-[var(--ease-out)]",
                "md:absolute md:top-[46%] md:w-[clamp(240px,25vw,360px)] md:-translate-x-1/2 md:-translate-y-1/2 md:scale-[var(--s)]",
                "md:blur-[var(--b)] md:opacity-[var(--o)]",
                // Below md only the app this audience actually opens is shown.
                !place.lifted && "hidden md:block",
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
              <Image
                src={phone.src}
                alt={place.lifted ? phone.alt : ""}
                width={800}
                height={776}
                className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
              />
            </div>
          );
        })}

        {/* `md:contents` dissolves this row from md up, so each icon positions
            against the stage rather than against a wrapper — one set of icons
            that reads as a row on a phone and as two marks flanking the
            mockups on a desktop. */}
        <div className="flex items-center gap-4 md:contents">
          {ICONS.map((icon) => {
            const shown = (icon.states as readonly string[]).includes(active);
            return (
              <div
                key={icon.src}
                aria-hidden={!shown}
                className={cn(
                  "transition-[left,opacity,transform] duration-700 ease-[var(--ease-out)]",
                  "md:absolute md:top-[82%] md:z-30 md:block md:-translate-x-1/2",
                  shown ? "md:opacity-100" : "hidden md:block md:scale-75 md:opacity-0",
                )}
                style={{ left: `${icon.x}%` }}
              >
                <Image
                  src={icon.src}
                  alt={shown ? icon.alt : ""}
                  width={80}
                  height={80}
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
          className="w-full transition-[left,width] duration-700 ease-[var(--ease-out)] md:absolute md:top-[46%] md:z-30 md:w-[var(--cw)] md:-translate-x-1/2 md:-translate-y-1/2"
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
            className="animate-in fade-in rounded-[16px] bg-[#0A1C15]/45 p-5 text-balance ring-1 ring-inset ring-white/10 backdrop-blur-md duration-500 md:p-6"
          >
            <h3 className="font-display text-[clamp(22px,2.1vw,30px)] leading-[1.1] tracking-[-0.03em] text-foreground">
              {current.title}
            </h3>

            {/* One chip per app, so "Blookd + Blookd Rental" stops being a
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

            <ul className="mt-4 flex flex-col gap-2.5 border-t border-white/10 pt-4">
              {current.points.map((point) => (
                <li
                  key={point}
                  className="text-pretty text-[14px] leading-[1.5] text-ink-70"
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
