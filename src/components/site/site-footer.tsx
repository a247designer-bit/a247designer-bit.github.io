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
 * The inset runs on all four sides: the gap on top separates the card from the
 * last band, which rounds its own bottom edge to meet it (see globals.css).
 */
export function SiteFooter() {
  return (
    <div className="relative bg-quiet p-4 md:p-8">
      <footer className="dark rounded-[var(--radius-band)] bg-paper px-6 py-12 text-foreground md:px-12 md:py-16">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-14">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="flex flex-col gap-5">
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
                  bottom is for the documents. `-ml-3` pulls the first icon's
                  44px box back so the drawing lines up with the logotype above
                  it rather than the padding around it. */}
              <SocialLinks className="-ml-3" />
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
