import Image from "next/image";
import {
  CalendarDays,
  Compass,
  MapPin,
  Repeat,
  Search,
  Store,
} from "lucide-react";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { NetworkOrbital } from "@/components/site/network-orbital";
import { ShaderBackground } from "@/components/ui/static-mesh-gradient";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { ParallaxImage } from "@/components/site/parallax-image";
import { FeatureCards, Split, Statement } from "@/components/site/pieces";
import { Eyebrow, Lede } from "@/components/site/type";
import { CtaPrimary, CtaQuiet, CtaSecondary, TextLink } from "@/components/site/cta";
import { Reveal } from "@/components/motion/reveal";

export default function HomePage() {
  return (
    <>
      <Hero
        ribbon
        eyebrow="The network for independent beauty"
        title={
          <>
            Find your people
            <br />
            Find your place
          </>
        }
        lede="Blookd connects people with beauty professionals — and professionals with the places where they work."
        actions={
          <>
            <CtaPrimary href="/professionals" className="w-[224px]">
              Join as a pro
            </CtaPrimary>
            <CtaSecondary href="/services">Find a pro</CtaSecondary>
            <CtaQuiet href="/workspaces">Find a workspace</CtaQuiet>
          </>
        }
      />

      {/* S2 — how the network fits together, with the ecosystem it connects */}
      <Band
        tone="dark"
        stacked
        size="tall"
        aria-labelledby="how"
        className="overflow-hidden bg-[#333E54]"
      >
        <ShaderBackground className="absolute inset-0" />
        <div className="relative z-10">
          <NetworkOrbital />
        </div>
      </Band>

      {/* S3 — the client app */}
      <Band tone="paper" stacked size="tall" aria-labelledby="clients">
        <AppShowcase
          eyebrow="Blookd · Beauty services"
          headingId="clients"
          heading="Find the right pro."
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                Discover independent beauty and wellness professionals, explore
                their work, compare services and book when it works for you.
              </p>
              <CtaSecondary href="/services">Explore Blookd</CtaSecondary>
            </div>
          }
          steps={[
            {
              id: "c-discover",
              title: "Discover",
              icon: <Compass />,
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
              id: "c-explore",
              title: "Explore",
              icon: <Search />,
              body: "See portfolios, services, pricing, availability and reviews before you decide.",
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
              id: "c-book",
              title: "Book",
              icon: <CalendarDays />,
              body: "Choose a time that works for you and book directly with your professional.",
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
              id: "c-return",
              title: "Come back",
              icon: <Repeat />,
              body: "Keep your favorite professionals close and make your next appointment easier.",
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

      {/* S6 — statement */}
      <Band
        tone="quiet"
        stacked
        size="tight"
        className="relative overflow-hidden py-0 md:py-0"
      >
        <div className="relative aspect-square w-full sm:aspect-[2145/803]">
          <ParallaxImage src="/in-center-3.jpg" alt="" />
          <div className="container-site relative z-10 flex h-full flex-col justify-center">
            <Reveal>
              <p className="mx-auto max-w-[20ch] text-center font-display text-display-2 text-white">
                Clients on one side.
                <br />
                Space on the other.
                <br />
                You in the middle.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-[58ch] text-center text-[17px] leading-[1.6] text-ink-62">
                That&apos;s the Blookd network.
              </p>
            </Reveal>
          </div>
        </div>
      </Band>

      {/* S5 — for professionals */}
      <Band tone="paper" stacked aria-labelledby="pros">
        <Split
          headingId="pros"
          eyebrow={<Eyebrow>For professionals</Eyebrow>}
          heading={
            <>
              Your work.
              <br />
              Your clients.
              <br />
              Your place.
            </>
          }
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/your-work.jpg"
                alt="An independent beauty professional at work"
                width={1254}
                height={1254}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Build your independent career around the way you want to work.
            Blookd helps people discover you. Blookd Rental helps you find where
            to work.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/professionals">
              Blookd for professionals
            </CtaPrimary>
            <TextLink href="/workspaces">Find a workspace</TextLink>
          </div>
        </Split>

        <div className="container-site mt-16 md:mt-24">
          <FeatureCards
            items={[
              {
                title: "Get discovered.",
                body: "Put your work in front of people looking for services like yours.",
              },
              {
                title: "Get booked.",
                body: "Turn discovery into real appointments and keep your work moving.",
              },
              {
                title: "Find your place.",
                body: "Find flexible beauty workspaces that fit your schedule, services and way of working.",
              },
            ]}
          />
        </div>
      </Band>

      {/* S5.5 — pricing */}
      <Band tone="quiet" stacked aria-labelledby="pricing">
        <Split
          headingId="pricing"
          eyebrow={<Eyebrow>Pricing</Eyebrow>}
          heading="Earn first. Pay after."
          media={
            <Image
              src="/images/payment.png"
              alt="Paying with a tap-to-pay card on a phone"
              width={763}
              height={430}
              className="h-auto w-full"
            />
          }
        >
          <p className="max-w-[46ch] text-[22px] leading-[1.35] md:text-[26px]">
            <span className="text-foreground">No monthly fee. A flat 5%</span>{" "}
            <span className="text-ink-62">
              only when a client pays you. Every feature included.
            </span>
          </p>
          <p className="max-w-[52ch] text-[15px] leading-[1.55] text-ink-62">
            No setup fees. No long-term contract. Full terms shown before you
            publish your first listing.
          </p>
          <CtaSecondary href="/professionals">See how it works</CtaSecondary>
        </Split>
      </Band>

      {/* S7 — Blookd Rental */}
      <Band tone="dark" stacked size="tall" aria-labelledby="rental">
        <AppShowcase
          eyebrow="Blookd Rental · Beauty workspaces"
          headingId="rental"
          heading="Find your place."
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                From a barber chair for the day to a private studio for longer
                stays, Blookd Rental helps independent professionals find places
                designed for the work they do.
              </p>
              <CtaPrimary href="/workspaces">Find a workspace</CtaPrimary>
            </div>
          }
          steps={[
            {
              id: "r-near",
              title: "Find space near you.",
              icon: <MapPin />,
              body: "Explore available beauty workspaces by location, type and price.",
              media: (
                <Image
                  src="/find-space-near-you.png"
                  alt="The Blookd Rental app's workspace search screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "r-know",
              title: "Know before you book.",
              icon: <Search />,
              body: "Check photos, workspace details, amenities and availability before choosing your space.",
              media: (
                <Image
                  src="/know-before-you-book.png"
                  alt="The Blookd Rental app's workspace detail screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "r-schedule",
              title: "Work on your schedule.",
              icon: <CalendarDays />,
              body: "Book the time you need without being tied to a traditional long-term setup.",
              media: (
                <Image
                  src="/work-on-your-schedule-3.png"
                  alt="The Blookd Rental app's availability calendar screen"
                  width={443}
                  height={906}
                  loading="eager"
                  className="mx-auto w-full max-w-[260px]"
                />
              ),
            },
            {
              id: "r-together",
              title: "Keep everything together.",
              icon: <Store />,
              body: "Manage your workspace bookings and stay connected with hosts from one place.",
              media: (
                <Image
                  src="/keep-everything-together-2.png"
                  alt="The Blookd Rental app's bookings screen"
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

      {/* S8 — hosts */}
      <Band tone="paper" stacked aria-labelledby="hosts">
        <Split
          reverse
          headingId="hosts"
          eyebrow={<Eyebrow>For hosts</Eyebrow>}
          heading="Put your space to work."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/put-your-space-to-work.jpg"
                alt="An empty beauty workspace ready to be listed"
                width={1254}
                height={1254}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Turn available beauty workspace into opportunity. List your space,
            control when it&apos;s available and connect with independent
            professionals looking for a place to work.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/hosts">List your space</CtaPrimary>
            <TextLink href="/workspaces">Discover Blookd Rental</TextLink>
          </div>
        </Split>

        <div className="container-site mt-16 md:mt-24">
          <FeatureCards
            columns={4}
            items={[
              {
                title: "List your space.",
                body: "Show professionals what makes your workspace worth booking.",
              },
              {
                title: "Set your availability.",
                body: "Decide when the space is open and keep your schedule under control.",
              },
              {
                title: "Connect with professionals.",
                body: "Reach beauty professionals actively looking for places to work.",
              },
              {
                title: "Earn from unused space.",
                body: "Make more of the chairs, rooms and stations you already have.",
              },
            ]}
          />
        </div>
      </Band>

      {/* S9 — statement */}
      <Band tone="quiet" stacked size="tight">
        <Statement
          lead="Independent doesn't mean doing it alone."
          tail={
            <>
              Build your own clientele.
              <br />
              Choose where you work.
              <br />
              Create relationships that stay yours.
              <br />
              Blookd gives independent beauty professionals a network built
              around the way modern beauty work actually happens.
            </>
          }
        />
      </Band>

      {/* S10 — human */}
      <Band tone="paper" stacked aria-labelledby="human">
        <div className="container-site flex flex-col gap-12">
          <Reveal className="flex max-w-[46ch] flex-col items-start gap-6">
            <h2 id="human" className="text-display-2">
              Real{" "}
              <AnimatedTextCycle
                words={["people", "talent", "places"]}
                interval={2400}
              />
            </h2>
            <Lede>
              Behind every booking is a relationship. Behind every workspace is
              someone&apos;s business. Blookd is built around the people who
              make beauty happen every day.
            </Lede>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                src: "/images/stylist-mirror.jpg",
                alt: "A hair stylist at the mirror",
                label: "Real people",
              },
              {
                src: "/images/nail-artist.jpg",
                alt: "A nail artist working on a client",
                label: "Real talent",
              },
              {
                src: "/images/barber.jpg",
                alt: "A barber at work in a studio",
                label: "Real places",
              },
            ].map((item, i) => (
              <Reveal
                key={item.src}
                delay={i * 90}
                className="flex flex-col gap-4"
              >
                <div className="overflow-hidden rounded-[24px]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={900}
                    height={1100}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <span className="font-display text-[20px] tracking-[-0.025em]">
                  {item.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      {/* S11 — brand story */}
      <Band tone="quiet" stacked aria-labelledby="story">
        <div className="container-site">
          <Reveal className="flex max-w-[62ch] flex-col items-start gap-8">
            <Eyebrow>Our story</Eyebrow>
            <h2 id="story" className="text-display-2">
              Built from inside the industry.
            </h2>
            <p className="text-[17px] leading-[1.6] text-ink-62">
              Blookd grew from real experience in the beauty industry — working
              alongside the professionals, businesses and clients who keep it
              moving. We saw talented independent professionals building careers
              on their own terms, clients looking for the right people, and
              businesses with great spaces waiting to be used. Blookd brings
              those needs together.
            </p>
            <p className="max-w-[46ch] text-[22px] leading-[1.35] md:text-[26px]">
              Built for the way independent beauty works now — and where
              it&apos;s going next.
            </p>
            <CtaSecondary href="/about">Our story</CtaSecondary>
          </Reveal>
        </div>
      </Band>

      {/* S12 — the two apps */}
      <Band
        tone="dark"
        stacked
        aria-labelledby="apps"
        className="overflow-hidden bg-[#333E54]"
      >
        <ShaderBackground className="absolute inset-0" />
        <div className="container-site relative z-10 flex flex-col gap-16">
          <Reveal>
            <h2 id="apps" className="max-w-[16ch] text-display-2">
              One network.
              <br />
              Two apps.
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                name: "Blookd",
                audience: "For clients & professionals",
                body: "Discover talent. Get discovered. Book services. Build relationships.",
                cta: "Get Blookd",
                href: "/services",
                image: "/images/app-card-blookd.jpg",
              },
              {
                name: "Blookd Rental",
                audience: "For professionals & hosts",
                body: "Find workspace. List space. Book flexibly. Make more of every place.",
                cta: "Get Blookd Rental",
                href: "/workspaces",
                image: "/images/app-card-rental.jpg",
              },
            ].map((app, i) => (
              <Reveal
                key={app.name}
                delay={i * 120}
                as="article"
                className="relative flex min-h-[520px] flex-col items-start justify-end gap-6 overflow-hidden rounded-[28px] p-8 md:p-10"
              >
                <Image
                  src={app.image}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

                <div className="relative z-10 flex flex-col items-start gap-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-[26px] tracking-[-0.03em] text-white">
                      {app.name}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.14em] text-white/70">
                      {app.audience}
                    </span>
                  </div>
                  <p className="max-w-[34ch] text-[15px] leading-[1.55] text-white/70">
                    {app.body}
                  </p>
                  <CtaPrimary href={app.href}>{app.cta}</CtaPrimary>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Band>

      {/* S13 — final CTA */}
      <Band tone="paper" stacked aria-labelledby="final">
        <div className="container-site">
          <Reveal className="flex max-w-[52ch] flex-col items-start gap-7">
            <h2 id="final" className="text-display-1">
              Find your people.
              <br />
              Find your place.
            </h2>
            <Lede>
              Whether you&apos;re booking a service, building your independent
              career or opening your space to professionals, there&apos;s a
              place for you in Blookd.
            </Lede>
            <div className="flex flex-wrap items-center gap-3">
              <CtaPrimary href="/services">Get Blookd</CtaPrimary>
              <CtaSecondary href="/workspaces">Get Blookd Rental</CtaSecondary>
              <TextLink href="/hosts">List your space</TextLink>
            </div>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.55] text-ink-62">
              However you show up — booking, building or opening your doors —
              you&apos;re part of the same network.
            </p>
          </Reveal>
        </div>
      </Band>
    </>
  );
}
