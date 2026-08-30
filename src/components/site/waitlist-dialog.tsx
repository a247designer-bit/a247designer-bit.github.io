"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { ChevronDown, X } from "lucide-react";

import { CtaSecondaryButton } from "@/components/site/cta";
import { cn } from "@/lib/utils";

/**
 * The inbox, base64.
 *
 * Not secrecy — this is client-side script, and anything it can decode, a
 * scraper that runs script can decode too. It is about what a scraper that does
 * NOT run script can find, which is most of them: they fetch the bundle and run
 * a regex over it, and the address never appears in it as a run of characters
 * for that regex to match.
 *
 * What that actually protects is the ENDPOINT, not the address. The address has
 * been on blookd.com's own Terms page since 2023 and is in this site's copy of
 * it 38 times over — harvesting it needs no cleverness at all. The URL below is
 * a different thing: a live form that anyone holding it can POST to directly,
 * past the honeypot, past the site.
 *
 * `atob`, not a split-and-join: SWC folds `["support","blookd.com"].join("@")`
 * straight back into the literal it was hiding — measured, not assumed. It
 * cannot fold a call to a host API it does not model.
 */
const INBOX_B64 = "c3VwcG9ydEBibG9va2QuY29t";

/** Where the signup is delivered. Shown to the reader when sending fails. */
const WAITLIST_INBOX = atob(INBOX_B64);

/**
 * The form relay.
 *
 * This site is a static export on GitHub Pages (see next.config.ts) — no server,
 * so a signup can only reach an inbox through a relay. FormSubmit was chosen by
 * the site owner.
 *
 * `/ajax/` rather than the plain endpoint: the plain one answers with a redirect
 * to its own thank-you page, which would take the visitor off the site and make
 * the success and failure states below unreachable. The ajax endpoint answers
 * with JSON and CORS headers, so the sheet can report the outcome itself.
 *
 * STILL TO DO: FormSubmit needs activating once. The first real submission
 * sends a confirmation mail to the inbox above, and nothing is delivered until
 * someone opens it and clicks through. Submit the form once from the live site
 * and confirm from that inbox — then swap INBOX for the random alias FormSubmit
 * issues, which is the real fix this splitting only stands in for.
 */
const WAITLIST_ENDPOINT = ["https://formsubmit.co/ajax/", WAITLIST_INBOX].join("");

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Which app the signup is for.
 *
 * Two products, one waitlist — without this the list arrives as a single pile
 * of addresses and nobody can tell who was promised a booking app and who was
 * promised a place to work. Left unset rather than defaulted to Blookd: a
 * preselected answer is one nobody reads, and a column where everyone picked
 * the default is worth no more than no column at all.
 */
const APPS = ["Blookd", "Blookd Rental"] as const;

/** Deliberately loose. The only wrong answer here is a rejected real address. */
const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export function WaitlistDialog({ label = "Join the waitlist" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [app, setApp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const appId = useId();
  const nameId = useId();
  const emailId = useId();
  const noticeId = useId();
  const honeypot = useRef<HTMLInputElement>(null);

  const sending = status === "sending";
  const done = status === "sent";

  function reset() {
    setName("");
    setEmail("");
    setApp("");
    setStatus("idle");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!app) {
      setError("Choose which app you're signing up for.");
      setStatus("error");
      return;
    }
    if (!trimmedName) {
      setError("Tell us what to call you.");
      setStatus("error");
      return;
    }
    if (!looksLikeEmail(trimmedEmail)) {
      setError("That email address doesn't look right.");
      setStatus("error");
      return;
    }

    // A filled honeypot is a bot: the field is off-screen and unlabelled, so
    // nothing driving this with eyes and a pointer will ever put anything in
    // it. Dropped silently — telling a scraper it was caught only teaches it.
    if (honeypot.current?.value) {
      setStatus("sent");
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          app,
          // The app rides in the subject as well as the body: the inbox sorts
          // on subject lines long before anyone opens the table.
          _subject: `${app} waitlist — ${trimmedName}`,
          // FormSubmit otherwise interrupts with its own captcha page, which an
          // ajax POST cannot show and the visitor would only see as a failure.
          _captcha: "false",
          _template: "table",
        }),
      });

      // FormSubmit answers 200 for refusals as well as for deliveries — an
      // unconfirmed address, a rate limit — with the reason in the body. Going
      // on `response.ok` alone would report those as delivered, which is the
      // one failure mode a waitlist cannot have.
      const payload: unknown = await response.json().catch(() => null);
      const success =
        payload && typeof payload === "object" && "success" in payload
          ? String((payload as { success: unknown }).success) === "true"
          : response.ok;

      if (!success) {
        const message =
          payload && typeof payload === "object" && "message" in payload
            ? String((payload as { message: unknown }).message)
            : `Request failed (${response.status}).`;
        throw new Error(message);
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError(
        `We couldn't send that. Try again, or email us at ${WAITLIST_INBOX}.`,
      );
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Reset on the way out, not the way in: the close is animated, and
        // clearing while it is still on screen shows the form emptying itself.
        if (!next) window.setTimeout(reset, 250);
      }}
    >
      <Dialog.Trigger asChild>
        <CtaSecondaryButton>{label}</CtaSecondaryButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[6px] data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-300" />

        {/* Anchored to the bottom of the viewport, centred on it, exactly as
            the reference does: the sheet rises from the edge nearest the thumb
            and the close sits above it rather than inside, so the card is only
            ever the form. `max-h` plus scroll keeps it whole on a short screen
            in landscape, where a bottom sheet is otherwise the first thing to
            get cut. */}
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-[60] mx-auto flex w-full max-w-[440px] flex-col items-center px-4 pb-4",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-bottom-4",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-400",
          )}
        >
          <Dialog.Close
            className="mb-4 grid size-12 place-items-center rounded-[14px] bg-white text-[#111] shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:scale-95 motion-reduce:transition-none"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2.5} />
          </Dialog.Close>

          {/* The sheet keeps its own light palette whatever band it was opened
              from — it sits over a blurred page, not on it, and a panel that
              changed colour with whatever was behind it would read as part of
              the page rather than in front of it. */}
          <div className="max-h-[80svh] w-full overflow-y-auto rounded-[24px] bg-white p-7 text-[#111] md:p-8">
            <Dialog.Title className="font-display text-[30px] leading-[1.1] tracking-[-0.03em]">
              You&apos;re invited to Blookd
            </Dialog.Title>
            <p className="mt-2 text-[16px] leading-[1.45] text-black/55">
              Get early access and be the first to book with independent beauty
              professionals near you.
            </p>

            {done ? (
              <div className="mt-8">
                <p className="text-[17px] leading-[1.45] font-medium">
                  You&apos;re on the list.
                </p>
                <p className="mt-2 text-[15px] leading-[1.5] text-black/55">
                  We&apos;ll email {email.trim()} the moment early access to{" "}
                  {app} opens.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Dialog.Close className="inline-flex min-h-11 items-center rounded-[10px] bg-[#111] px-5 text-[15px] font-medium text-white transition-opacity hover:opacity-90">
                    Done
                  </Dialog.Close>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex min-h-11 items-center rounded-[10px] px-2 text-[15px] text-black/55 underline underline-offset-4 transition-colors hover:text-black"
                  >
                    Add someone else
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-7">
                {/* FormSubmit's honeypot. Positioned off-screen rather than
                    hidden with `display:none` or `type="hidden"` — a bot that
                    reads the stylesheet skips both, and this one it has to fill
                    to look like it filled the form. `tabIndex={-1}` and
                    aria-hidden keep it away from anyone using the keyboard or a
                    screen reader. */}
                <input
                  ref={honeypot}
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute left-[-9999px] size-px opacity-0"
                />
                <SelectField
                  id={appId}
                  label="Choose app"
                  options={APPS}
                  value={app}
                  onChange={setApp}
                  disabled={sending}
                  invalid={status === "error" && !app}
                  describedBy={status === "error" ? noticeId : undefined}
                />
                <Field
                  id={nameId}
                  label="Your first name"
                  placeholder="First Name"
                  value={name}
                  autoComplete="given-name"
                  onChange={setName}
                  disabled={sending}
                />
                <Field
                  id={emailId}
                  label="Your e-mail"
                  placeholder="E-mail"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={setEmail}
                  disabled={sending}
                  invalid={status === "error" && !looksLikeEmail(email.trim())}
                  describedBy={status === "error" ? noticeId : undefined}
                />

                {/* aria-live so the outcome is announced, and rendered as a
                    reserved slot rather than injected — a message that appears
                    out of nowhere pushes the button out from under the finger
                    that was about to press it again. */}
                <p
                  id={noticeId}
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "mt-4 min-h-5 text-[14px] leading-[1.4]",
                    status === "error" ? "text-[#c0341a]" : "text-transparent",
                  )}
                >
                  {error ?? " "}
                </p>

                <button
                  type="submit"
                  disabled={sending}
                  className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-[#111] text-[17px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:hover:opacity-60"
                >
                  {sending ? "Sending…" : "Join the waitlist"}
                </button>

                <p className="mt-4 text-center text-[14px] text-black/45">
                  By signing up, you&apos;re agreeing to our{" "}
                  <a
                    href="/terms-conditions/"
                    className="underline underline-offset-2 hover:text-black"
                  >
                    terms
                  </a>
                  .
                </p>
              </form>
            )}
          </div>

          <VisuallyHidden.Root>
            <Dialog.Description>
              Join the waitlist for Blookd or Blookd Rental with your first
              name and email address.
            </Dialog.Description>
          </VisuallyHidden.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * The same field, holding a choice instead of a line of text.
 *
 * A native `<select>` rather than a listbox built out of divs: this sheet is
 * anchored to the bottom of the viewport because it is mostly read on a phone,
 * and on a phone the native control is a full-height wheel the thumb already
 * knows. Stripped of its own chrome so it sits in the same filled shape as the
 * two fields under it, with the chevron drawn back on top.
 */
function SelectField({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  const ref = useRef<HTMLSelectElement>(null);

  // A `<select>` holding no option that matches an empty value does not sit
  // empty — it lands on its first one, so the control shows "Blookd" and hands
  // the accessibility tree the same, for a choice nobody made. -1 is the state
  // that means nothing is chosen and there is no value that expresses it, so
  // it has to be written onto the element itself.
  //
  // Deliberately no dependency array. React restores the selection on every
  // render it touches this element on, not only on the ones where `value`
  // changed — the submit that reports the field empty is itself such a render,
  // which is how an unanswered field came to read "Blookd" the moment it was
  // complained about.
  useEffect(() => {
    if (!value && ref.current) ref.current.selectedIndex = -1;
  });

  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-[15px] text-black/45">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          ref={ref}
          id={id}
          value={value}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-14 w-full appearance-none rounded-[14px] bg-black/[0.05] pr-12 pl-4 text-[17px] text-[#111] outline-none",
            "focus-visible:ring-2 focus-visible:ring-[#111]/30",
            "disabled:opacity-60",
            invalid && "ring-2 ring-[#c0341a]/50",
          )}
        >
          {/* The two apps and nothing else. There is deliberately no empty
              option standing in for the placeholder: `hidden` on one is
              advisory, and iOS Safari builds its wheel from every option in
              the list regardless — which is how "Choose app" kept turning up
              as a third thing to pick on a phone while desktop showed two.

              With no option matching an empty value the control simply has
              nothing selected, so the field sits empty until someone chooses
              and the check in handleSubmit still sees an unanswered field. */}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {/* Nothing stands in for an unmade choice. The label above the field
            already says Choose app, and a `<select>` is the one control whose
            emptiness is unambiguous — the chevron says it opens, and there is
            no value in it to mistake for one. */}
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-black/40"
        />
      </div>
    </div>
  );
}

/** Label above, filled field below — the reference's shape, on our tokens. */
function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  disabled,
  invalid,
  describedBy,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block text-[15px] text-black/45">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "mt-2 h-14 w-full rounded-[14px] bg-black/[0.05] px-4 text-[17px] text-[#111] outline-none",
          "placeholder:text-black/40",
          "focus-visible:ring-2 focus-visible:ring-[#111]/30",
          "disabled:opacity-60",
          invalid && "ring-2 ring-[#c0341a]/50",
        )}
      />
    </div>
  );
}
