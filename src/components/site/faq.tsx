import { Band } from "@/components/site/band";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow, Lede } from "@/components/site/type";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

/**
 * The FAQ band, one shape for all four product pages.
 *
 * The heading holds the left column and the questions run down the right, the
 * same split the rest of the site uses — so the section reads as part of the
 * page rather than as a widget dropped onto it. On a phone it stacks.
 *
 * The accordion's own defaults are a chat demo: a filler timestamp, `bg-muted`
 * questions and a 320px answer bubble in full accent. Its `questionClassName`
 * and `answerClassName` exist for exactly this, so the palette is set here
 * rather than by editing the component:
 *
 * - Questions take the band's card surface, which is a step away from the
 *   band's own ground (see SURFACES in band.tsx). The default `bg-muted`
 *   resolves to `--quiet`, which IS the ground under half these sections —
 *   the chip would have gone invisible on every quiet band.
 * - The open and hover colours are `.faq-chip` in globals.css, not classes
 *   passed from here. `questionClassName` is appended after BOTH of the
 *   component's state branches, so a background set here flattens open and
 *   closed into each other — the +/− would still turn, but the chip you
 *   pressed would stop responding. The open state has to be addressed through
 *   the trigger above the chip, which is where Radix writes data-state, and
 *   that is a rule rather than a utility.
 * - Answers sit on the card surface with no border at all, the same way every
 *   other card on this site does. The component fills them with solid accent,
 *   which is right for a one-line chat reply and wrong for the four-line
 *   answers here — reversed out of solid orange they read as warnings. The
 *   accent stays on the open question above, where it marks which one you
 *   pressed; the answer does not need to be coloured to be found.
 * - `max-w-none` because the default 320px was measured against one-line demo
 *   answers; a real one runs to four lines and would set as a column of
 *   fragments.
 */
export function FaqSection({
  id,
  eyebrow,
  heading,
  lede,
  items,
  tone = "quiet",
}: {
  id: string;
  eyebrow: string;
  heading: string;
  lede?: string;
  items: FaqItem[];
  tone?: "paper" | "quiet";
}) {
  return (
    <Band tone={tone} stacked aria-labelledby={id}>
      <div className="container-site grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <Reveal className="flex flex-col items-start gap-6 lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="text-display-2">
            {heading}
          </h2>
          {lede ? <Lede>{lede}</Lede> : null}
        </Reveal>

        <Reveal delay={120}>
          <FaqAccordion
            data={items}
            className="p-0"
            questionClassName="faq-chip min-h-11 rounded-[14px] bg-[var(--surface)] px-4 text-[16px] text-foreground"
            answerClassName="max-w-none rounded-[14px] bg-[var(--surface)] px-4 py-3 text-[15px] leading-[1.55] text-ink-70"
          />
        </Reveal>
      </div>
    </Band>
  );
}
