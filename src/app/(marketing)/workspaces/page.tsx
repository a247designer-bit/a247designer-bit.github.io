import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Search, Store } from "lucide-react";

import { Band } from "@/components/site/band";
import { FaqSection } from "@/components/site/faq";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { Split } from "@/components/site/pieces";
import { Eyebrow, Lede } from "@/components/site/type";
import { CtaPrimary, CtaSecondary, TextLink } from "@/components/site/cta";
import { Reveal } from "@/components/motion/reveal";
import { WORKSPACE_GROUPS } from "@/lib/workspace-categories";
import { WORKSPACES_FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "Workspaces",
  description:
    "Discover flexible beauty workspaces built for the way independent professionals work.",
};

export default function WorkspacesPage() {
  return (
    <>
      <Hero
        eyebrow="Blookd Rental · Beauty workspaces"
        title="Find your place."
        lede="Discover flexible beauty workspaces built for the way independent professionals work."
        actions={<CtaPrimary href="/">Find a workspace</CtaPrimary>}
        media={
          <div className="overflow-hidden rounded-[28px]">
            <Image
              src="/images/workspaces-hero.jpg"
              alt="An illustrated barber chair, mirror and tool trolley"
              width={1254}
              height={1254}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        }
      />

      <Band tone="quiet" stacked aria-labelledby="variety">
        <div className="container-site flex flex-col gap-14">
          <Reveal className="flex max-w-[52ch] flex-col items-start gap-6">
            <Eyebrow>Variety</Eyebrow>
            <h2 id="variety" className="text-display-2">
              The space you need.
              <br />
              For the time you need it.
            </h2>
            <Lede>
              Find barber chairs, styling stations, private studios, massage
              rooms, nail desks and other professional beauty spaces near you.
            </Lede>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {WORKSPACE_GROUPS.map((group, i) => (
              <Reveal
                key={group.group}
                delay={i * 80}
                className="flex flex-col gap-5 rounded-[24px] bg-[var(--surface)] p-6 md:p-7"
              >
                <span className="text-[13px] text-ink-62">{group.group}</span>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-display text-[19px] tracking-[-0.025em]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      <Band tone="dark" stacked size="tall" aria-labelledby="rental-flow">
        <AppShowcase
          eyebrow="Blookd Rental"
          headingId="rental-flow"
          heading="Know the space before you book."
          accent="indigo"
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                Explore photos, location, amenities, availability and pricing
                before making your choice.
              </p>
              <CtaPrimary href="/">Find a workspace</CtaPrimary>
            </div>
          }
          steps={[
            {
              id: "w-map",
              title: "Find space near you",
              icon: <MapPin />,
              summary:
                "Browse available workspaces by location, type and price.",
              body: "Explore available beauty workspaces by location, type and price.",
              media: (
                <Image
                  src="/find-space-near-you-indigo.png"
                  alt="The Blookd Rental app's workspace search screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "w-know",
              title: "Know before you book",
              icon: <Search />,
              summary:
                "Photos, amenities, availability and pricing, before you commit.",
              body: "Explore photos, location, amenities, availability and pricing before making your choice.",
              media: (
                <Image
                  src="/know-before-you-book-indigo.png"
                  alt="The Blookd Rental app's workspace detail screen"
                  width={443}
                  height={906}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "w-schedule",
              title: "Work around your schedule",
              icon: <CalendarDays />,
              summary:
                "Choose the days and hours that fit your work, not someone else's.",
              body: "Choose the days and times that make sense for your work instead of adapting your business to someone else's schedule.",
              media: (
                <Image
                  src="/work-on-your-schedule-3-indigo.png"
                  alt="The Blookd Rental app's availability calendar screen"
                  width={443}
                  height={906}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "w-hosts",
              title: "Meet the people behind the place",
              icon: <Store />,
              summary:
                "Talk directly with hosts and keep every booking in one place.",
              body: "Connect directly with workspace hosts and keep your rental bookings together in Blookd Rental.",
              media: (
                <Image
                  src="/keep-everything-together-2-indigo.png"
                  alt="The Blookd Rental app's bookings screen"
                  width={443}
                  height={906}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
          ]}
        />
      </Band>

      <Band tone="paper" stacked aria-labelledby="workspaces-cta">
        <Split
          headingId="workspaces-cta"
          heading="Your next workspace is out there."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/rental.jpg"
                alt="A beauty workspace interior"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            From a barber chair for the day to a private studio for longer
            stays, Blookd Rental helps independent professionals find places
            designed for the work they do.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/">Get Blookd Rental</CtaPrimary>
            <CtaSecondary href="/hosts">List your space</CtaSecondary>
            <TextLink href="/professionals">For professionals</TextLink>
          </div>
        </Split>
      </Band>

      {/* FAQ. Last band on the page and quiet against the paper CTA
          above it, so the rhythm carries on and the rounded bottom edge
          that closes every page lands here. */}
      <FaqSection
        id="workspaces-faq"
        eyebrow="Questions"
        heading="Renting a space."
        lede="How booking a workspace through Blookd Rental works, from your first search to the day itself."
        items={WORKSPACES_FAQ}
      />
    </>
  );
}
