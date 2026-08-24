import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Sparkles, UserRound } from "lucide-react";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";
import { AppShowcase } from "@/components/site/app-showcase";
import { Split, Statement } from "@/components/site/pieces";
import { MediaFrame } from "@/components/site/media";
import { Eyebrow, Lede } from "@/components/site/type";
import { CtaPrimary, CtaSecondary, TextLink } from "@/components/site/cta";

export const metadata: Metadata = {
  title: "Professionals",
  description:
    "Blookd helps independent beauty professionals get discovered, connect with clients and find flexible places to work.",
};

export default function ProfessionalsPage() {
  return (
    <>
      <Hero
        eyebrow="For professionals"
        title="Your talent is your business."
        lede="Blookd helps independent beauty professionals get discovered, connect with clients and find flexible places to work."
        actions={
          <>
            <CtaPrimary href="/">Join as a pro</CtaPrimary>
            <CtaSecondary href="/workspaces">Find a workspace</CtaSecondary>
          </>
        }
      />

      <Band tone="quiet" stacked aria-labelledby="visibility">
        <Split
          headingId="visibility"
          eyebrow={<Eyebrow>Visibility</Eyebrow>}
          heading="Get discovered for what you do best."
          media={
            <MediaFrame ratio="4 / 3" label="reserved: pro profile preview" />
          }
        >
          <Lede>
            Build a profile around your work and put it in front of people
            looking for services like yours.
          </Lede>
          <p className="font-mono text-[12px] tracking-[0.06em] text-ink-62">
            portfolio · services · availability
          </p>
        </Split>
      </Band>

      <Band tone="paper" stacked size="tall" aria-labelledby="pro-flow">
        <AppShowcase
          eyebrow="How it works"
          headingId="pro-flow"
          heading="Turn discovery into bookings."
          footer={
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-[32ch] text-[15px] leading-[1.55] text-ink-62">
                Give clients a clear way to explore your work, choose a service
                and find a time that works.
              </p>
              <CtaPrimary href="/">Join as a pro</CtaPrimary>
            </div>
          }
          steps={[
            {
              id: "p-profile",
              title: "Build your profile",
              icon: <UserRound />,
              body: "Build a profile around your work and put it in front of people looking for services like yours.",
              media: <MediaFrame ratio="4 / 3" label="reserved: profile builder" />,
            },
            {
              id: "p-services",
              title: "Show your services",
              icon: <Sparkles />,
              body: "Give clients a clear way to explore your work and choose the service they want.",
              media: <MediaFrame ratio="4 / 3" label="reserved: service list" />,
            },
            {
              id: "p-time",
              title: "Take bookings",
              icon: <CalendarDays />,
              body: "Let clients find a time that works and confirm the appointment without the back and forth.",
              media: <MediaFrame ratio="4 / 3" label="reserved: time picker" />,
            },
            {
              id: "p-space",
              title: "Find a place to work",
              icon: <MapPin />,
              body: "Use Blookd Rental to discover flexible workspaces when your business needs them.",
              media: (
                <MediaFrame
                  ratio="4 / 3"
                  label="reserved: workspace listings — cross-link into Blookd Rental"
                />
              ),
            },
          ]}
        />
      </Band>

      <Band tone="quiet" stacked size="tight">
        <Statement
          lead={
            <>
              Your work.
              <br />
              Your name.
            </>
          }
          tail="Build relationships around your own professional identity, portfolio and reputation."
        />
      </Band>

      <Band tone="dark" stacked size="tight">
        <Statement
          lead={
            <>
              Clients when you need clients.
              <br />
              Space when you need space.
            </>
          }
          tail="Two connected products built around one independent professional: you."
        />
      </Band>

      <Band tone="paper" stacked aria-labelledby="pros-cta">
        <Split
          reverse
          headingId="pros-cta"
          heading="Build your work on your terms."
          media={
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/pro-portrait.jpg"
                alt="An independent beauty professional in their workspace"
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
              />
            </div>
          }
        >
          <Lede>
            Blookd helps people discover you. Blookd Rental helps you find where
            to work. One network, built around the way independent beauty
            actually happens.
          </Lede>
          <div className="flex flex-wrap items-center gap-3">
            <CtaPrimary href="/">Get Blookd</CtaPrimary>
            <CtaSecondary href="/workspaces">Get Blookd Rental</CtaSecondary>
            <TextLink href="/hosts">List a space</TextLink>
          </div>
        </Split>
      </Band>
    </>
  );
}
