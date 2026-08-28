import type { Metadata } from "next";
import Image from "next/image";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { Split, Statement } from "@/components/site/pieces";
import { Eyebrow, Lede } from "@/components/site/type";
import { CtaPrimary, CtaSecondary } from "@/components/site/cta";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Blookd started with a simple belief: independent beauty works better when the right people can find each other.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="Our story"
        title="Built from inside beauty."
        lede="Blookd started with a simple belief: independent beauty works better when the right people can find each other."
      />

      <Band tone="quiet" stacked aria-labelledby="origin">
        <Split
          headingId="origin"
          eyebrow={<Eyebrow>Origin</Eyebrow>}
          heading="We knew the industry before we built the technology."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/about-origin.jpg"
                alt="Collage of beauty professionals set into cut-out Blookd letterforms"
                width={1600}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Blookd comes from real experience inside beauty — working with
            professionals, clients and businesses and seeing firsthand how much
            of independent work still depends on disconnected tools, missed
            opportunities and finding the right people at the right time.
          </Lede>
        </Split>
      </Band>

      <Band tone="paper" stacked size="tight">
        <Statement
          lead={
            <>
              Talent shouldn&apos;t be hard to find.
              <br />
              Neither should opportunity.
            </>
          }
          tail={
            <>
              Clients need great professionals.
              <br />
              Professionals need clients and places to work.
              <br />
              Workspace owners need the right people to fill available space.
              <br />
              These aren&apos;t separate problems.
              <br />
              They&apos;re parts of the same network.
            </>
          }
        />
      </Band>

      <Band tone="dark" stacked aria-labelledby="mission">
        <Split
          reverse
          headingId="mission"
          eyebrow={<Eyebrow>Mission</Eyebrow>}
          heading="Connect the industry around the people who make it work."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/about-mission.jpg"
                alt="A nail artist at work, collaged into cut-out Blookd letterforms"
                width={1600}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            We&apos;re building Blookd to make independent beauty easier to
            discover, easier to access and easier to build a career around.
          </Lede>
        </Split>
      </Band>

      <Band tone="paper" stacked aria-labelledby="future">
        <div className="container-site">
          <Reveal className="flex max-w-[56ch] flex-col items-start gap-7">
            <Eyebrow>What&apos;s next</Eyebrow>
            <h2 id="future" className="text-display-2">
              One connected place for independent beauty.
            </h2>
            <Lede>
              Today Blookd connects people through mobile products. The network
              will continue to grow, making more of the beauty experience
              discoverable, bookable and manageable wherever people choose to
              use it.
            </Lede>
            <div className="flex flex-wrap items-center gap-3">
              <CtaPrimary href="/services">Get Blookd</CtaPrimary>
              <CtaSecondary href="/professionals">Join as a pro</CtaSecondary>
            </div>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
