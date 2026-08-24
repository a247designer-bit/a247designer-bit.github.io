# Blookd

The network for independent beauty — a two-sided marketplace connecting people
with beauty professionals, and professionals with the places where they work.

The promo site is the first step. Booking through the site is the second, which
is why the app code is laid out to take a second product area without moving
anything that already exists.

## Running it

```bash
npm run dev
```

| | |
|---|---|
| `npm run dev` | Next.js dev server on :3000 |
| `npm run build` | production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | typecheck |

The pre-Next static build is kept in `legacy/` as the visual reference. It is
plain HTML and needs a static server:

```bash
node .claude/static-server.mjs
```

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 ·
shadcn/ui on Radix primitives, Lucide icons · Lenis for smooth scrolling.

## Layout

```
src/app/
  layout.tsx           root: fonts, metadata, smooth scroll
  globals.css          design tokens — read this before styling anything
  fonts.ts             JeanLuc (display) + Manrope (body)
  (marketing)/         the promo site
    layout.tsx         header + footer shell
    page.tsx           /
    services|workspaces|professionals|hosts|about/

src/components/
  site/                page-level building blocks
  ui/                  shadcn/ui
  motion/              smooth scroll, scroll reveal

legacy/                the pre-Next static site, kept as the design reference
project/               the original Claude Design handoff
public/                images, carousel tiles, app video
```

`(marketing)` is a route group, so its pages carry no prefix in their URLs. The
booking product goes in a sibling group with its own layout (app chrome, auth)
without touching these routes.

## Design system

Everything lives in `src/app/globals.css`. Two rules carry most of the look:

1. **One weight per family.** Headings are JeanLuc bold, body is Manrope 500.
   Emphasis comes from size and from the ink opacity ramp — never from a
   heavier cut. Reach for `text-display-*` and `text-ink-*`, not `font-bold`.
2. **One tracking value.** Everything sits at `-0.02em`; only display sizes go
   tighter.

Secondary text is the foreground at reduced alpha (`text-ink-62`, `text-ink-40`)
rather than a separate grey, so it stays correct on light and dark bands alike.
The ramp stops at 62% because that is the lowest alpha still clearing 4.5:1 on
paper.

### Building a page

- `<Band>` is one section: a flat colour block (`paper` / `quiet` / `dark`) with
  an optional rounded top edge that rides over the band above it. It publishes
  a `--surface` colour for cards sitting on it — always a step away from its own
  ground, so a card never reads as a hole.
- `<AppShowcase>` is the app walkthrough: a pinned column of steps on the left,
  screens scrolling past on the right. The step list doubles as a progress
  indicator and as navigation.
- `<Reveal>` fades content in on first view. It renders visible and is hidden by
  script, so content is never trapped behind an animation that did not run.
- `<DeviceFrame>` / `<MediaFrame>` hold app screens and clips. With no source
  they render a labelled placeholder — a marked gap, never a decorative
  stand-in.

## Still to come

- App screens and flow videos. Every `[ reserved: … ]` and `[ App screen ]`
  placeholder marks a slot waiting for real material.
- The booking product — `src/app/(booking)/`.
