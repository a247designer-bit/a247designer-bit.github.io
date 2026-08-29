import Link from "next/link";

import { SocialLinks } from "@/components/site/social-links";

const COLUMNS = [
  {
    title: "Product",
    links: [
      // Same order as the header's NAV, deliberately: the two lists are the
      // same set of pages, and a visitor who learned the order up top should
      // not have to re-read it down here.
      { href: "/services", label: "Services" },
      { href: "/professionals", label: "Professionals" },
      { href: "/workspaces", label: "Workspaces" },
      { href: "/hosts", label: "Hosts" },
    ],
  },
  {
    title: "Company",
    links: [{ href: "/about", label: "About" }],
  },
];

/**
 * The legal row, kept out of the product columns above.
 *
 * All four documents live on this site now. Terms and Privacy used to hand the
 * reader off to blookd.com; they are the two a visitor is most likely to open
 * mid-signup, and sending them to another domain to read them is the one place
 * on the site where the journey stops.
 */
const LEGAL = [
  { href: "/terms-conditions", label: "Terms and Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
  { href: "/cookies-policy", label: "Cookies Policy" },
];

/**
 * A dark card inset from the page edges, so the band behind it stays visible
 * down the sides — the footer reads as the last object on the page rather than
 * as the page running out.
 *
 * That reading costs 32px of a phone's width, which is more than it is worth
 * there, so below md the card runs edge to edge and keeps only the gap on top.
 * The last band rounds its own bottom edge to meet that gap (see globals.css),
 * and this one rounds its top to answer it.
 */
export function SiteFooter() {
  return (
    // Edge to edge below md. The side inset is what makes the footer read as a
    // card on a desktop, and on a 375px screen it was 32px of quiet ground
    // charged against the only column the content has. The gap above it stays
    // — that is the seam between the last band and this one, and the band
    // rounds its own bottom edge to meet it. Nothing below it, so nothing
    // under it either.
    <div className="relative bg-quiet px-0 pt-4 pb-0 md:p-8">
      <footer className="dark rounded-t-[var(--radius-band)] bg-paper px-6 py-12 text-foreground md:rounded-[var(--radius-band)] md:px-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-14">
          {/* Two columns below md, three from md up. Product runs to four
              links and Company to one, so stacked they were two headings and
              five rows spread down most of a screen; side by side they are a
              directory. The brand block keeps the full width above them. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
            <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
              <img
                src="/brand/blookd-logotype-light.svg"
                alt="Blookd"
                className="h-6 w-auto self-start"
              />
              <p className="max-w-[34ch] text-[15px] leading-[1.55] text-ink-62">
                The network for independent beauty — people, professionals and
                the places they work.
              </p>
              {/* Under the mark and the line about who Blookd is, not down in
                  the legal row: these belong with the brand, and the row at the
                  bottom is for the documents.

                  The pull-back lines the first drawing up with the logotype
                  above it rather than the padding around it, so it is however
                  much padding the box has left over: 7px around a 30px mark on
                  a phone, 12px around the 20px one above md. */}
              <SocialLinks className="-ml-[7px] md:-ml-3" />
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <span className="text-[13px] text-ink-62">{col.title}</span>
                <ul className="flex flex-col gap-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        // 44px rows so neighbouring links cannot steal each other's taps.
                        className="inline-flex min-h-11 items-center text-[15px] text-ink-70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 border-t border-border pt-8 text-[13px] text-ink-62 lg:flex-row lg:items-center lg:justify-between">
            <span>
              © {new Date().getFullYear()} Blookd. All rights reserved.
            </span>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    // Same 44px row as the columns above: these sit closer
                    // together than product links do, so the touch target
                    // matters more here, not less.
                    className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
