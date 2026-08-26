import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Compass, Heart, Search } from "lucide-react";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { SpotlightSearch } from "@/components/ui/spotlight-search";
import { Statement } from "@/components/site/pieces";
import { Eyebrow, Lede } from "@/components/site/type";
import { CtaPrimary, CtaSecondary } from "@/components/site/cta";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Discover beauty and wellness professionals whose work fits your style, needs and schedule.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        eyebrow="Blookd · Beauty services"
        title="Find the right pro."
        lede="Discover beauty and wellness professionals whose work fits your style, needs and schedule."
        actions={<CtaPrimary href="/">Get Blookd</CtaPrimary>}
        media={
          <div className="overflow-hidden rounded-[28px]">
            <Image
              src="/images/services-hero.jpg"
              alt="Illustrated portraits of four beauty professionals"
              width={1254}
              height={1254}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        }
      />

      <Band tone="quiet" stacked aria-labelledby="discovery">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col items-start gap-6">
            <Eyebrow>Discovery</Eyebrow>
            <h2 id="discovery" className="text-display-2">
              Start with what you&apos;re looking for.
            </h2>
            <Lede>
              Explore professionals by service, location and availability.
              Whether it&apos;s your regular cut or something completely new,
              Blookd helps you find someone who feels right for you.
            </Lede>
            <p className="text-[12px] tracking-[0.06em] text-ink-62">
              service · location · availability
            </p>
          </Reveal>
          <Reveal delay={120}>
            <SpotlightSearch />
          </Reveal>
        </div>
      </Band>

      <Band tone="paper" stacked size="tall" aria-labelledby="journey">
        <AppShowcase
          eyebrow="The client journey"
          headingId="journey"
          heading="See their work before they do yours."
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                Portfolios, services, pricing, availability and reviews — all in
                one place.
              </p>
              <CtaPrimary href="/">Get Blookd</CtaPrimary>
            </div>
          }
          steps={[
            {
              id: "s-discover",
              title: "Discover",
              icon: <Compass />,
              summary:
                "Search by service, style and location, and see which professionals work near you.",
              body: "Explore professionals near you and find the style, service and experience you're looking for.",
              media: (
                <Image
                  src="/discover-2.png"
                  alt="The Blookd app's discover screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "s-profiles",
              title: "Explore profiles",
              icon: <Search />,
              summary:
                "Portfolios, pricing, availability and reviews, gathered on a single profile.",
              body: "Explore portfolios, services, pricing, availability and reviews in one place.",
              media: (
                <Image
                  src="/explore.png"
                  alt="The Blookd app's professional profile screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "s-book",
              title: "Book them",
              icon: <CalendarDays />,
              summary:
                "Pick the service and the time that fit your week, then confirm in a few taps.",
              body: "Choose the service and time that work for you and manage your appointment from Blookd.",
              media: (
                <Image
                  src="/book.png"
                  alt="The Blookd app's booking flow screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "s-trust",
              title: "Come back",
              icon: <Heart />,
              summary:
                "Save the professionals you trust and rebook them without starting over.",
              body: "Keep track of the professionals you love and make it easier to come back when it's time for your next appointment.",
              media: (
                <Image
                  src="/come-back-2.png"
                  alt="The Blookd app's saved professionals screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
          ]}
        />
      </Band>

      <Band tone="quiet" stacked size="tight">
        <Statement
          lead="A good appointment can become a great relationship."
          tail="Keep track of the professionals you love and make it easier to come back when it's time for your next appointment."
        />
      </Band>

      <Band tone="paper" stacked aria-labelledby="services-cta">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col items-start gap-7">
            <h2 id="services-cta" className="text-display-2">
              Your next pro could be closer than you think.
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <CtaPrimary href="/">Get Blookd</CtaPrimary>
              <CtaSecondary href="/professionals">Join as a pro</CtaSecondary>
            </div>
          </Reveal>
          <Reveal delay={120} className="overflow-hidden rounded-[28px]">
            <Image
              src="/images/your-next-pro.jpg"
              alt="An illustrated portrait of a hair stylist with a comb and scissors"
              width={1254}
              height={1254}
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>
      </Band>
    </>
  );
}
