import Image from "next/image";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { NetworkOrbital } from "@/components/site/network-orbital";
import { RealGallery } from "@/components/site/real-gallery";
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

      {/* S2.5 — for people. Deliberately the same shape as the "for
          professionals" band further down — same split, same card row — so the
          two sides of the network are introduced as a matched pair. */}
      <Band tone="paper" stacked aria-labelledby="people">
        <Split
          headingId="people"
          eyebrow={<Eyebrow>For people</Eyebrow>}
          heading="Find the right pro."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/find-the-right-pro.jpg"
                alt="An illustrated portrait of a woman with voluminous curly hair"
                width={1254}
                height={1254}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Discover independent beauty and wellness professionals, explore
            their work, compare services and book when it works for you.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/services">Explore Blookd</CtaPrimary>
            <TextLink href="/professionals">Join as a pro</TextLink>
          </div>
        </Split>

        <div className="container-site mt-16 md:mt-24">
          <FeatureCards
            columns={4}
            // All three card rows keep a third of their colour at rest. The
            // hover still goes to the full picture, so the reveal keeps its
            // distance to travel — see FeatureCard for the measurement.
            tintedAtRest
            items={[
              {
                title: "Discover.",
                image: "/images/cards/discover-2.jpg",
                body: "Browse professionals near you by service, style and the look you want.",
              },
              {
                title: "Explore.",
                image: "/images/cards/explore-2.jpg",
                body: "Portfolios, pricing, availability and reviews, all on one profile.",
              },
              {
                title: "Book.",
                image: "/images/cards/book-2.jpg",
                body: "Pick a time that suits you and book straight with your pro.",
              },
              {
                title: "Come back.",
                image: "/images/cards/come-back-2.jpg",
                body: "Keep your favorites close so the next appointment takes seconds.",
              },
            ]}
          />
        </div>
      </Band>


      {/* S6 — statement */}
      <Band
        tone="quiet"
        stacked
        size="tight"
        className="relative overflow-hidden py-0 md:py-0"
      >
        <div className="relative aspect-square w-full sm:aspect-[2145/803]">
          {/* Two crops, because this band changes shape at `sm`: a 2145x803
              panorama in the square hole below it kept a third of its width
              and cut the barber out of his own picture. The square file is the
              same scene recomposed for that hole. The breakpoint here is the
              one on the container above — they have to be the same number or
              the shape and the file disagree on one viewport. */}
          <ParallaxImage
            src="/in-center-3.jpg"
            mobileSrc="/in-center-mobile.jpg"
            mobileUpTo={639}
            alt=""
          />
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
              <p className="mx-auto mt-8 max-w-[58ch] text-center text-[17px] leading-[1.6] text-white">
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
            tintedAtRest
            items={[
              {
                title: "Get discovered.",
                image: "/images/cards/get-discovered-2.jpg",
                body: "Put your work in front of people looking for services like yours.",
              },
              {
                title: "Get booked.",
                image: "/images/cards/get-booked-2.jpg",
                body: "Turn discovery into real appointments and keep your work moving.",
              },
              {
                title: "Find your place.",
                image: "/images/cards/find-your-place-2.jpg",
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

      {/* S8 — hosts */}
      <Band tone="dark" stacked aria-labelledby="hosts">
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
            tintedAtRest
            items={[
              {
                title: "List your space.",
                image: "/images/cards/list-your-space-2.jpg",
                body: "Show professionals what makes your workspace worth booking.",
              },
              {
                title: "Set your availability.",
                image: "/images/cards/set-your-availability-2.jpg",
                body: "Decide when the space is open and keep your schedule under control.",
              },
              {
                title: "Connect with professionals.",
                image: "/images/cards/connect-with-professionals-2.jpg",
                body: "Reach beauty professionals actively looking for places to work.",
              },
              {
                title: "Earn from unused space.",
                image: "/images/cards/earn-from-unused-space-2.jpg",
                body: "Make more of the chairs, rooms and stations you already have.",
              },
            ]}
          />
        </div>
      </Band>

      {/* S9 — statement.

          The photograph is composed for this exact job: one figure stands in
          the right quarter and everything left of her is empty floor, which is
          where the copy goes. So it runs as a background rather than as a
          picture beside the words.

          The band is given the photograph's own proportions at `md` and up
          rather than being sized by its copy. She occupies 72% of the frame's
          height, so any band shorter than that crops her — at the 472px the
          text alone asked for she loses her legs and the long diagonal shadow
          that is the point of the picture. 52vw is the height at which
          `object-cover` stops cropping vertically at ANY width: the 12%
          parallax overscan takes the container to 58.2vw, past the 56.3vw the
          image covers to, so the crop is only ever the 3.5% taken off the left
          edge — empty floor. The copy centres in the room that leaves.

          The overlay is `lg` and up only. The figure stands at 74% of the
          frame, and `object-cover` walks her leftwards as the band narrows: at
          768px she starts at x=544 while the trailing paragraph still runs to
          657, so the copy sits on her — dark type on a dark boot. At 1024 the
          two clear each other.

          Below that the picture goes UNDER the words rather than behind them,
          in the portrait crop made for it. Overlaying that crop was measured
          and does not work: on a 390px screen the copy crosses her at
          1.00:1 — the same colour as what it is written on — and even the
          clear left third only reaches 3.60:1 for the trailing paragraph,
          because her shadow runs across it. Capping the copy to the clear
          strip would leave a 200px column. Stacked, the picture is whole, the
          copy is on the band's own ground, and neither is compromised to
          rescue the other. */}
      <Band
        tone="quiet"
        stacked
        size="tight"
        className="relative overflow-hidden lg:flex lg:min-h-[52vw] lg:items-center"
      >
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <ParallaxImage
            src="/images/not-alone.jpg"
            alt=""
            // Half the default travel: the brief was a light drift, and this
            // band is short enough that the usual 12% would read as a slide.
            amount={6}
            // Anchored right so the crop is taken off the empty floor instead
            // of off the figure.
            objectPosition="right center"
          />
        </div>
        <div className="relative z-10 w-full">
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

        {/* Held to 360px and centred rather than run full-bleed. A 0.566
            portrait at the full width of the band is 689px tall on a phone but
            1357 at 768 and 1807 by the time `lg` takes over — a picture that
            grows to two screens as the screen gets bigger. Capping the width is
            what keeps it one object at every size below `lg`, and it is never
            cropped to get there.

            Rounded like every other media block on the site, because at this
            size that is what it now is. */}
        <Image
          src="/images/not-alone-mobile.jpg"
          alt="An independent beauty professional standing in an empty studio"
          width={531}
          height={938}
          className="mx-auto mt-12 h-auto w-full max-w-[360px] rounded-[28px] lg:hidden"
        />
        </div>
      </Band>

      {/* S10 — human */}
      <Band tone="paper" stacked aria-labelledby="human">
        <div className="container-site flex flex-col gap-12">
          <Reveal className="flex max-w-[46ch] flex-col items-start gap-6">
            <h2 id="human" className="text-display-2">
              Real{" "}
              {/* The word that changes is the only one worth reading twice,
                  so it carries the accent and "Real" stays ink. `text-primary`
                  rather than a fixed orange: it follows the band's own tone. */}
              <AnimatedTextCycle
                words={["people", "talent", "places"]}
                interval={2400}
                className="text-primary"
              />
            </h2>
            <Lede>
              Behind every booking is a relationship. Behind every workspace is
              someone&apos;s business. Blookd is built around the people who
              make beauty happen every day.
            </Lede>
          </Reveal>

          {/* One Reveal around the strip rather than one per picture. The
              per-item stagger watched each picture for itself, and on a phone
              two of the three now sit outside the viewport — they would have
              waited for an intersection that never comes and stayed hidden
              behind the carousel. */}
          <Reveal>
            <RealGallery
              items={[
                {
                  src: "/images/real-people.jpg",
                  alt: "An illustration of a stylist and her client, side by side",
                  label: "Real people",
                },
                {
                  src: "/images/real-talent.jpg",
                  alt: "An illustration of a braider's hands parting and plaiting hair",
                  label: "Real talent",
                },
                {
                  src: "/images/real-places.jpg",
                  alt: "An illustration of a barber's chair, mirror and station",
                  label: "Real places",
                },
              ]}
            />
          </Reveal>
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
                // Two names on one card, because the left half of the network
                // ships as two builds off the same mark — the client app and
                // the pro app. The audience line underneath already said as
                // much; the title was still naming only one of them.
                name: "Blookd/Blookd BIZ",
                audience: "For clients & professionals",
                body: "Discover talent. Get discovered. Book services. Build relationships.",
                cta: "Get Blookd",
                href: "/services",
                image: "/images/app-card-blookd-3.jpg",
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
    </>
  );
}
