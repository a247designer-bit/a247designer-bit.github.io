import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import Link from "next/link";

import { Band } from "@/components/site/band";
import { Hero } from "@/components/site/hero";

/**
 * The shell every legal document sits in.
 *
 * These pages live in the `(marketing)` route group, so the site header and
 * footer come from its layout — nothing here has to mount them, and they
 * cannot drift out of step with the rest of the site.
 *
 * A single measure and a single type scale, set once here rather than per
 * document: legal copy is long, and the only thing that makes it readable is
 * that nothing on the page competes with the sentence you are on.
 */
export function LegalPage({
  title,
  lede,
  updated,
  children,
}: {
  title: string;
  /** Required: Hero needs one, and a legal page with no one-line summary of
   *  what it governs is a wall of clauses with no way in. */
  lede: string;
  /** Shown verbatim. A legal document that does not say when it changed is
   *  not much use to the person trying to work out which version they agreed
   *  to. */
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <Hero eyebrow="Legal" title={title} lede={lede} />

      <Band tone="quiet" stacked>
        <div className="container-site">
          <article
            className={[
              // 68ch, not the 52ch the marketing copy runs at: that measure is
              // tuned for two-line ledes, and it turns a page of clauses into a
              // column of fragments.
              "max-w-[68ch] text-[16px] leading-[1.65] text-ink-70",
              "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-[24px] [&_h2]:tracking-[-0.025em] [&_h2]:text-foreground",
              "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-[18px] [&_h3]:text-foreground",
              "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2",
              "[&_a]:underline [&_a]:decoration-ink-40 [&_a]:underline-offset-4 [&_a:hover]:text-foreground",
            ].join(" ")}
          >
            {updated ? (
              <p className="mb-10 text-[14px] text-ink-62">
                Last updated: {updated}
              </p>
            ) : null}
            {children}
          </article>
        </div>
      </Band>
    </>
  );
}

/**
 * A document that lives as a file rather than as JSX.
 *
 * Terms and Privacy run to 12,800 and 3,400 words. Transcribed into JSX they
 * would be the two largest source files in the repo and every future edit
 * would be a diff through markup. They sit in `src/content/legal/` as plain
 * HTML instead, converted once from the published documents and reduced to the
 * handful of tags the shell above styles — p, h2, h3, ul, li, strong, em, a.
 * No class, style or script attribute survived that conversion, which is what
 * makes setting the markup directly safe here.
 *
 * Read at build time: every route on this site prerenders (see next.config.ts),
 * so `fs` runs on the build machine and the file never reaches the browser as
 * anything but the finished HTML.
 */
export function LegalDocument({ file }: { file: string }) {
  const html = readFileSync(
    join(process.cwd(), "src/content/legal", `${file}.html`),
    "utf8",
  );
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Stands in until the real document is supplied.
 *
 * Deliberately says that the text is not here yet and sends the reader to the
 * terms that ARE in force, rather than filling the page with plausible clauses
 * — a policy a visitor could act on has to be the company's, not a draft.
 */
export function LegalPending({ document }: { document: string }) {
  return (
    <p>
      The {document} is being finalised and will be published here. In the
      meantime the agreement in force is set out in our{" "}
      <Link href="/terms-conditions">Terms and Conditions</Link> and{" "}
      <Link href="/privacy-policy">Privacy Policy</Link>.
    </p>
  );
}
