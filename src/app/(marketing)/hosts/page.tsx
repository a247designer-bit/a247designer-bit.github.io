import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, ImagePlus, Users, Wallet } from "lucide-react";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { Split, Statement } from "@/components/site/pieces";
import { Lede } from "@/components/site/type";
import { CtaPrimary, CtaSecondary } from "@/components/site/cta";

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
                  loading="eager"
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
                  loading="eager"
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
                  loading="eager"
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

      <Band tone="paper" stacked aria-labelledby="hosts-cta">
        <Split
          headingId="hosts-cta"
          heading="Great spaces should be working."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/host-space.jpg"
                alt="An empty beauty workspace ready for its next professional"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Turn available beauty workspace into opportunity — and reach the
            independent professionals already looking for it.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/">Get Blookd Rental</CtaPrimary>
            <CtaSecondary href="/workspaces">
              See how renting works
            </CtaSecondary>
          </div>
        </Split>
      </Band>
    </>
  );
}
