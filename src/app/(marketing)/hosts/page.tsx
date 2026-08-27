import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, ImagePlus, Users, Wallet } from "lucide-react";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { Statement } from "@/components/site/pieces";
import { CtaPrimary, CtaSecondary } from "@/components/site/cta";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Hosts",
  description:
    "Connect available beauty workspace with independent professionals looking for exactly that.",
};

export default function HostsPage() {
  return (
    <>
      <Hero
        eyebrow="For hosts"
        title="Put your space to work."
        lede="Connect available beauty workspace with independent professionals looking for exactly that. You set the price, the hours and who books — no long-term commitment."
        actions={<CtaPrimary href="/">List your space</CtaPrimary>}
        media={
          <div className="overflow-hidden rounded-[28px]">
            <Image
              src="/images/hosts-hero.jpg"
              alt="An illustrated portrait of a man looking up"
              width={1254}
              height={1254}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        }
      />

      <Band tone="quiet" stacked size="tall" aria-labelledby="host-flow">
        <AppShowcase
          eyebrow="Hosting on Blookd Rental"
          headingId="host-flow"
          heading="Show professionals what you have."
          accent="indigo"
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                Pause or remove your listing anytime. Nothing about how you run
                your core business has to change.
              </p>
              <CtaPrimary href="/">List your space</CtaPrimary>
            </div>
          }
          steps={[
            {
              id: "h-listing",
              title: "List your space",
              icon: <ImagePlus />,
              summary:
                "Photos, details, amenities and pricing, in one clear listing.",
              body: "Create a listing with photos, workspace details, amenities, pricing and everything professionals need to make a decision.",
              media: (
                <Image
                  src="/list-your-space.png"
                  alt="The Blookd Rental app's listing photo upload screen"
                  width={886}
                  height={1812}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "h-calendar",
              title: "Set your availability",
              icon: <CalendarDays />,
              summary:
                "Open only the hours you want and make unused time bookable.",
              body: "Choose when your workspace is available and make unused time bookable.",
              media: (
                <Image
                  src="/set-your-availability.png"
                  alt="The Blookd Rental app's availability settings screen"
                  width={886}
                  height={1812}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "h-reach",
              title: "Reach people ready to work",
              icon: <Users />,
              summary:
                "Meet professionals actively searching for a place to work.",
              body: "Connect with beauty professionals actively searching for flexible places to run their business.",
              media: (
                <Image
                  src="/reach-people-ready-to-work.png"
                  alt="The Blookd Rental app's host inbox screen"
                  width={886}
                  height={1812}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "h-earn",
              title: "Earn from unused space",
              icon: <Wallet />,
              summary:
                "Turn idle chairs and rooms into steady additional income.",
              body: "Turn unused workspace into additional earning potential without changing how you run your core business.",
              media: (
                <Image
                  src="/earn-from-unused-space.png"
                  alt="The Blookd Rental app's create promotion screen"
                  width={886}
                  height={1812}
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
          ]}
        />
      </Band>

      <Band tone="dark" stacked size="tight">
        <Statement
          lead="Make every chair, room and station count."
          tail={
            <>
              You set the price, the hours and who books.
              <br />
              No long-term commitment — pause or remove your listing anytime.
            </>
          }
        />
      </Band>

      {/* The closing pitch runs on the photograph rather than beside it: the
          page has argued for a whole section that a host's empty chair is worth
          something, and a full-bleed room makes that case faster than a card
          of the same picture.

          Kept on the `paper` tone even though it reads dark, because the tone
          is what the two CTAs resolve their colours from and they are meant to
          look exactly as they did before. Everything the photograph sits under
          — the heading, the lede — is coloured explicitly instead. The band
          also carries a dark base colour of its own so a slow or failed image
          never strands white type on white. */}
      <Band
        tone="paper"
        stacked
        aria-labelledby="hosts-cta"
        className="overflow-hidden bg-[#17120f]"
      >
        <Image
          src="/images/great-spaces.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Two scrims. The flat wash takes the whole frame down a stop; the
            ramp on top of it buys the contrast the type actually needs.

            The ramp changes axis at md because the copy does. On a desktop it
            occupies the left half, so a left-to-right ramp protects it and
            leaves the room itself readable; on a phone the heading runs the
            full width, where a horizontal ramp would strand its last word on
            bare photograph — so it runs top-to-bottom there instead. */}
        <div aria-hidden className="absolute inset-0 bg-black/15" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/45 md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-transparent"
        />

        <div className="container-site relative">
          <Reveal className="flex max-w-[54ch] flex-col items-start gap-6">
            <h2
              id="hosts-cta"
              className="text-display-2 text-white [text-wrap:balance]"
            >
              Great spaces should be working.
            </h2>

            {/* The lede takes a frosted panel of its own. At 17px it is the
                smallest type on the band, and small type is what a busy
                photograph destroys first — the heading is large enough to
                survive on the scrim alone. */}
            <p className="max-w-[52ch] rounded-[16px] bg-black/40 p-4 text-[17px] leading-[1.55] text-white/85 ring-1 ring-inset ring-white/15 backdrop-blur-md md:p-5">
              Turn available beauty workspace into opportunity — and reach the
              independent professionals already looking for it.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <CtaPrimary href="/">Get Blookd Rental</CtaPrimary>
              {/* Unchanged but for a hairline. The dark pill was drawn
                  against white paper before; on a dark photograph it has
                  nothing to separate it from the ground, and the ring restores
                  the edge the background used to provide. */}
              <CtaSecondary
                href="/workspaces"
                className="ring-1 ring-inset ring-white/25"
              >
                See how renting works
              </CtaSecondary>
            </div>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
