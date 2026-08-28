"use client";

import { CalendarDays, Home, MapPin, Search, Sparkles } from "lucide-react";
import {
  RadialOrbitalTimeline,
  type OrbitalTimelineItem,
} from "@/components/ui/radial-orbital-timeline";
import { Eyebrow, Lede } from "@/components/site/type";
import { MediaFrame } from "@/components/site/media";
import { Reveal } from "@/components/motion/reveal";
import { AppAudienceSwitcher } from "@/components/site/app-audience-switcher";

/**
 * Merges what were two separate sections — the ecosystem (people,
 * professionals, places) and the five-step "how it works" walkthrough — into
 * one: the ecosystem is who the network connects, the orbit is how it
 * connects them, and neither reads on its own without the other.
 */

const ECOSYSTEM = [
  {
    // A still, not the 6.3MB GIF that used to sit here — that was 84% of the
    // home page's payload for a 176px preview most visitors never hover. This
    // one is 13KB, which is what the slot was always worth.
    title: "People",
    body: "Looking for someone they can trust.",
    media: "/people.jpg",
  },
  {
    title: "Professionals",
    body: "Building independent careers around their talent.",
    media: "/professionals.jpg",
  },
  {
    title: "Places",
    body: "Flexible spaces where great work can happen.",
    media: "/places.jpg",
  },
];

const STEPS: OrbitalTimelineItem[] = [
  {
    id: 1,
    title: "Discover",
    icon: Search,
    content:
      "Explore independent professionals near you and find the style, service and experience you're looking for.",
    relatedIds: [2, 5],
    // A person, browsing. Their side of the network is the one app.
    apps: [{ name: "Blookd", tone: "blookd" as const }],
  },
  {
    id: 2,
    title: "Book",
    icon: CalendarDays,
    content:
      "Compare services, pricing and availability, then book directly with the professional you chose.",
    relatedIds: [1, 3],
    // Both ends of the same appointment: made in Blookd, landing in the
    // schedule the professional keeps in Blookd Biz.
    apps: [
      { name: "Blookd", tone: "blookd" as const },
      { name: "Blookd Biz", tone: "blookd" as const },
    ],
  },
  {
    id: 3,
    title: "Get discovered",
    icon: Sparkles,
    content:
      "Put your work in front of people looking for services like yours and turn discovery into real appointments.",
    relatedIds: [2, 4],
    // The professional works in Biz; what they publish surfaces in Blookd,
    // where the people looking for it are.
    apps: [
      { name: "Blookd Biz", tone: "blookd" as const },
      { name: "Blookd", tone: "blookd" as const },
    ],
  },
  {
    id: 4,
    title: "Find a place",
    icon: MapPin,
    content:
      "Book a barber chair for the day or a private studio for longer stays — flexible workspaces, on your schedule.",
    relatedIds: [3, 5],
    apps: [{ name: "Blookd Rental", tone: "rental" as const }],
  },
  {
    id: 5,
    title: "Host a space",
    icon: Home,
    content:
      "List an unused chair, room or station, set when it's available and connect with professionals looking to work.",
    relatedIds: [4, 1],
    apps: [{ name: "Blookd Rental", tone: "rental" as const }],
  },
];

export function NetworkOrbital() {
  return (
    <div className="container-site flex flex-col gap-10">
      <Reveal className="flex flex-col items-start gap-4">
        <Eyebrow>How it works</Eyebrow>
        <h2 id="how" className="text-display-2">
          How Blookd comes together.
        </h2>
        <Lede>
          The right client. The right professional. The right space. Blookd
          brings them together in one connected beauty ecosystem.
        </Lede>
      </Reveal>

      <Reveal
        delay={100}
        className="flex flex-col rounded-[16px] bg-[#081C15]/70 p-6 md:p-10"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          {ECOSYSTEM.map((item) => (
            <div key={item.title}>
              <div className="group relative inline-block w-fit">
                <div className="pointer-events-none absolute bottom-full left-full z-20 mb-2 ml-2 w-44 origin-bottom-left scale-75 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100">
                  <div className="overflow-hidden rounded-[10px] border border-white/10 shadow-xl">
                    {item.media ? (
                      // eslint-disable-next-line @next/next/no-img-element -- tiny hover preview, no optimization to gain
                      <img
                        src={item.media}
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <MediaFrame ratio="4 / 3" label={item.title} />
                    )}
                  </div>
                </div>
                <h3 className="rounded-[6px] bg-white/10 px-4 py-2 font-display text-[26px] uppercase tracking-tight text-foreground transition-colors group-hover:bg-white/15 md:text-[30px]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-2 text-[15px] leading-[1.5] text-ink-62">{item.body}</p>
            </div>
          ))}
        </div>

        <RadialOrbitalTimeline
          items={STEPS}
          centerMark={
            <video
              src="/icon-wrapper-motion.webm"
              autoPlay
              loop
              muted
              playsInline
              className="size-full"
            />
          }
        />
        </div>

        {/* The apps themselves, as the same three audiences named above.

            Deliberately no fill of its own: a second tint here — even at 4% —
            draws a hard line across the panel, and the ecosystem, the orbit
            and the apps are one argument, not two blocks stacked. Only the
            spacing separates them. */}
        <div className="mt-12 md:mt-20">
          <AppAudienceSwitcher />
        </div>
      </Reveal>
    </div>
  );
}
