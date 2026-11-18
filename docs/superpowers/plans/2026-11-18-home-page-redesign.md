# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page hero and restyle the sections below it: a scroll-driven full-screen room hero (AC → washer → fridge → TV) coming straight out of the Mirror Hall intro, followed by warm-stone shopping sections, keeping every current feature.

**Architecture:** Scene data and the scroll maths live in a small pure module (`src/lib/roomScenes.ts`) with unit tests. `RoomHero` uses the same sticky-plus-scroll-progress pattern as `MirrorHallIntro` (a tall section with a `sticky top-0 h-screen` stage), plus a GSAP ScrollTrigger used **only for snapping** (no GSAP pin, because the intro applies a transform to this element during its hand-off). The light sections stay in `src/app/page.tsx` and are restyled with new Tailwind tokens; the bento becomes its own `ShopByRoom` component.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind 3, framer-motion, GSAP 3 (ScrollTrigger), `next/font/google` (Fraunces), Vitest for the pure module.

**Spec:** `docs/superpowers/specs/2026-11-18-home-page-redesign-design.md`

## Global Constraints

- Warm stone palette: Stone `#F4F0EA` (main light bg), Sand `#EBE5DC` (alternate bg), Linen `#FBF9F6` (cards on stone), Ink `#050B1A` (text, dark bands, offer banners, footer), Electric `#2F6BFF` (buttons, links, eyebrows only).
- Headings in light sections: Fraunces. Body: Plus Jakarta Sans. Prices and numbers: Sora (`font-display`).
- No invented reviews, stats, ratings or "official dealer" claims. Hotspot text must come from `src/data/products.ts` `specs`.
- WhatsApp green `#25D366` only on WhatsApp buttons.
- One Three.js scene per page (the intro). `HeroScene` is removed from the home page.
- Pinned sections on the home page: the intro and the room hero only. The hero pins for about three screen-heights (section height `400vh`).
- Everything respects `prefers-reduced-motion`.
- Do not change `MirrorHallIntro` behaviour; the element directly after it must keep `-mt-[100vh] motion-reduce:mt-0` so the intro's centre-opening hand-off still reveals it.
- Other pages (shop, product, cart, about, contact), navbar and footer are unchanged, except that `ProductCard` gains an opt-in variant.
- Tailwind already has a built-in `stone` palette: name the new tokens `warm-stone`, `warm-sand`, `warm-linen` (under `colors.warm`) to avoid clashing.

## Review Focus

1. **Scroll exactly at scene boundaries** (progress 0, 1/3, 2/3, 1): exactly one scene is fully visible, with no blank or doubled frame. Pinned by `sceneFromProgress` tests in Task 1.
2. **Intro hand-off into the hero**: while the intro opens its hole, the hero's first scene (AC) shows with its dark top, and there's no jump when the intro releases. Checked in the Task 3 browser step.
3. **Phone width (375px)**: hero headline, CTAs, rail and trust strip don't overlap, and the bento collapses to a single column. Checked in the Task 3 and Task 6 browser steps.
4. **Reduced motion**: no pin and no snapping; the AC scene shows with a tap-to-switch row; light sections appear without animation. Checked in the Task 3 browser step.
5. **A hotspot spec missing from product data** (someone edits products later): the hotspot is hidden instead of showing "undefined". Pinned by the `resolveHotspot` test in Task 1.

---

### Task 1: Room scene data and scroll maths

**Files:**
- Create: `src/lib/roomScenes.ts`
- Create: `src/lib/roomScenes.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`)

**Interfaces:**
- Produces:
  - `type Hotspot = { productId: number; specKey: string; x: number; y: number }` (x and y are percentages of the stage, 0–100)
  - `type RoomScene = { id: 'ac' | 'washer' | 'fridge' | 'tv'; eyebrow: string; title: string; accent: string; line: string; image: string; focal: string; cta: { label: string; href: string }; hotspots: Hotspot[] }`
  - `const ROOM_SCENES: RoomScene[]` (exactly 4, in the order ac, washer, fridge, tv)
  - `function sceneFromProgress(p: number, count: number): { index: number; local: number }`: `p` is clamped to 0..1; `index` is the active scene; `local` (0..1) is the progress through the transition to the next scene.
  - `function resolveHotspot(h: Hotspot, products: Product[]): string | null` returns `"<specKey>: <value>"`, or `null` if the product or spec key is missing.

- [ ] **Step 1: Install Vitest and add the script.** Run: `npm i -D vitest@^2`, add `"test": "vitest run"`, and create `vitest.config.ts` with `resolve.alias['@'] = path.resolve(__dirname, 'src')` and `test.environment = 'node'`.

- [ ] **Step 2: Write the failing tests** in `src/lib/roomScenes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { ROOM_SCENES, sceneFromProgress, resolveHotspot } from './roomScenes';
import { ALL_PRODUCTS } from '@/data/products';

describe('sceneFromProgress', () => {
  it('maps the ends and boundaries to whole scenes', () => {
    expect(sceneFromProgress(0, 4)).toEqual({ index: 0, local: 0 });
    expect(sceneFromProgress(1 / 3, 4)).toEqual({ index: 1, local: 0 });
    expect(sceneFromProgress(2 / 3, 4).index).toBe(2);
    expect(sceneFromProgress(1, 4)).toEqual({ index: 3, local: 0 });
  });
  it('reports progress between scenes', () => {
    const r = sceneFromProgress(1 / 6, 4);
    expect(r.index).toBe(0);
    expect(r.local).toBeCloseTo(0.5);
  });
  it('clamps out-of-range input', () => {
    expect(sceneFromProgress(-0.2, 4)).toEqual({ index: 0, local: 0 });
    expect(sceneFromProgress(1.4, 4)).toEqual({ index: 3, local: 0 });
  });
});

describe('ROOM_SCENES', () => {
  it('has the four rooms in order', () => {
    expect(ROOM_SCENES.map((s) => s.id)).toEqual(['ac', 'washer', 'fridge', 'tv']);
  });
  it('every hotspot resolves to real product data (no invented numbers)', () => {
    for (const s of ROOM_SCENES) {
      expect(s.hotspots.length).toBeGreaterThan(0);
      for (const h of s.hotspots) expect(resolveHotspot(h, ALL_PRODUCTS)).not.toBeNull();
    }
  });
});

describe('resolveHotspot', () => {
  it('returns null for a missing spec instead of "undefined"', () => {
    expect(resolveHotspot({ productId: 1, specKey: 'Nope', x: 0, y: 0 }, ALL_PRODUCTS)).toBeNull();
    expect(resolveHotspot({ productId: 99999, specKey: 'Capacity', x: 0, y: 0 }, ALL_PRODUCTS)).toBeNull();
  });
  it('formats a real spec', () => {
    expect(resolveHotspot({ productId: 1, specKey: 'Energy Efficiency', x: 0, y: 0 }, ALL_PRODUCTS))
      .toBe('Energy Efficiency: 5-Star Inverter Rating');
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail.** Run: `npm test`. Expected: FAIL, "Cannot find module './roomScenes'".

- [ ] **Step 4: Implement `src/lib/roomScenes.ts`.** `sceneFromProgress`: `const t = clamp(p) * (count - 1); const index = Math.min(count - 1, Math.floor(t + 1e-9)); return { index, local: index === count - 1 ? 0 : t - index }`. Scene content:

| id | eyebrow | title | accent | line | image | cta | hotspots (productId, specKey) |
|---|---|---|---|---|---|---|---|
| ac | Inverter Air Conditioners | Cool rooms. | Lower bills. | Inverter ACs delivered and installed across Sri Lanka from our shop in Seeduwa. | `/appliances/luxury-ac.jpg` | See inverter ACs → `/products?category=air-conditioners` | (1, 'Energy Efficiency'), (1, 'Noise Level') |
| washer | Washing Machines | Cleaner clothes. | Quieter days. | Inverter direct-drive washers that are gentle on clothes and easy on power. | `/appliances/luxury-washer.jpg` | See washing machines → `/products?category=washing-machines` | (9, 'Capacity'), (9, 'Motor') |
| fridge | Refrigerators | Fresher food. | For longer. | Frost-free and inverter fridges for every kitchen and family size. | `/appliances/luxury-fridge.jpg` | See refrigerators → `/products?category=refrigerators` | (6, 'Capacity') |
| tv | Smart TVs | Every match. | Every movie. | Big, bright smart TVs with brand warranty and wall-mount installation. | `/appliances/luxury-tv.jpg` | See smart TVs → `/products?category=televisions` | (13, 'Screen Size') |

Set `focal` (CSS `object-position`) and the hotspot `x`/`y` by looking at each photo, so each dot sits on the product. For example, the AC photo has the unit at about x 50, y 17.

- [ ] **Step 5: Run the tests to verify they pass.** Run: `npm test`. Expected: all PASS.

- [ ] **Step 6: Commit.** `git add package.json package-lock.json vitest.config.ts src/lib/roomScenes.ts src/lib/roomScenes.test.ts && git commit -m "feat(home): room scene data and scroll maths"`

---

### Task 2: Warm stone tokens, Fraunces and brand guidelines

**Files:**
- Modify: `tailwind.config.ts` (`colors.warm = { stone: '#F4F0EA', sand: '#EBE5DC', linen: '#FBF9F6' }`; `fontFamily.serif = ['var(--font-serif)', 'Georgia', 'serif']`)
- Modify: `src/app/layout.tsx` (load `Fraunces` from `next/font/google` with `subsets: ['latin']`, `weight: ['400','500','600']`, `variable: '--font-serif'`, `display: 'swap'`; add `fraunces.variable` to `<html>` className)
- Modify: `docs/brand-guidelines.md`: add a "Warm stone (home page)" subsection under Colour with the five roles and hexes from Global Constraints; under Typography add "Light-section headings on the home page: Fraunces 400–600"; under Motion change the pinned rule to "at most one pinned section per page; the home page allows two (the intro and the room hero)".

**Interfaces:**
- Produces: Tailwind classes `bg-warm-stone`, `bg-warm-sand`, `bg-warm-linen`, `font-serif` (used by Tasks 3–5).

- [ ] **Step 1: Add the tokens and the font** as listed above.
- [ ] **Step 2: Verify.** Run: `npx tsc --noEmit -p .`, expect no output. Then in the dev server, run `getComputedStyle(document.documentElement).getPropertyValue('--font-serif')` in the browser console; expect a non-empty Fraunces family.
- [ ] **Step 3: Update `docs/brand-guidelines.md`** as listed above.
- [ ] **Step 4: Commit.** `git commit -am "feat(theme): warm stone tokens and Fraunces"`

---

### Task 3: RoomHero (scroll-driven room scenes)

**Files:**
- Create: `src/components/home/RoomHero.tsx`
- Modify: `src/app/page.tsx`: remove the old HERO section (currently lines ~110–318), `<TrustRibbon />`, the `HeroScene` dynamic import, `HERO_SLIDES`, `HERO_CATS` and the slide state they used; render `<RoomHero />` directly after `<MirrorHallIntro />`.

**Interfaces:**
- Consumes: `ROOM_SCENES`, `sceneFromProgress`, `resolveHotspot` (Task 1); `ALL_PRODUCTS` from `@/data/products`; `whatsappLink` and `SITE` from `@/lib/site`; the trust items now in `src/components/TrustRibbon.tsx` (move its `ITEMS` array to an export `TRUST_ITEMS` there and import it).
- Produces: `export default function RoomHero(): JSX.Element`. The root is `<section id="hero" aria-label="Featured rooms" className="relative -mt-[100vh] h-[400vh] bg-ink motion-reduce:mt-0 motion-reduce:h-auto">`.

Behaviour (from the spec):
- Stage: `sticky top-0 h-screen overflow-hidden`. Each scene is a full-bleed `next/image` (`fill`, `sizes="100vw"`, `priority` for the AC scene) with `object-position: scene.focal`, under a gradient overlay that runs from ink at the top, through clear in the middle, to `#F4F0EA` at the bottom.
- Progress is read like the intro: `p = clamp(-rect.top / (rect.height - innerHeight))`, then `sceneFromProgress(p, 4)`. The active scene's opacity is 1. During a transition, the outgoing scene fades out and the incoming one fades in, driven by `local` in the 0.35–0.65 window; the incoming image scales 1.06→1. A slow push-in, `scale(1 + local * 0.04)`, runs on the active image.
- Headline block (bottom centre): eyebrow (11px uppercase, tracking 0.2em, electric-300), `<h1>` in `font-display` with `title` in white and `accent` in the existing `.sc-text-gradient`, then `line`, then two CTAs: primary `cta` (electric pill) and "Get a price on WhatsApp" (green WhatsApp button, `whatsappLink(...)`). On a scene change, the words slide up 24px and fade in (framer-motion `AnimatePresence`, keyed by scene id).
- Hotspots: a pulsing electric dot at `left: x%`, `top: y%`. Clicking or focusing it opens a glass chip with the `resolveHotspot` text. Skip any hotspot where it returns `null`.
- Rail (right edge, vertical): 4 bars, with the active one tall and white. Clicking bar `i` calls `window.scrollTo({ top: sectionTop + i / 3 * (height - innerHeight), behavior: 'smooth' })`. Add a "Skip to shop ↓" link that scrolls to `#categories-section`.
- Trust strip: the 4 `TRUST_ITEMS` in a glass row along the bottom of the stage (`bg-white/[0.06] backdrop-blur border-white/10`). On screens under 768px, only the icons and titles show, in a horizontal scroll row.
- Snapping: in a `useEffect`, `gsap.registerPlugin(ScrollTrigger)` and `ScrollTrigger.create({ trigger: section, start: 'top top', end: 'bottom bottom', snap: { snapTo: 1 / 3, duration: { min: 0.2, max: 0.6 }, delay: 0.12, ease: 'power1.inOut' } })`; kill it on unmount. Skip it under reduced motion.
- Reduced motion: the section height is auto, with no sticky and no snap. Show the AC scene, and render the rail as a horizontal row of 4 buttons that switch scenes on click.
- The intro hand-off: `MirrorHallIntro` sets `transform` on this section during its reveal. Don't set `transform` on the section root yourself; animate the inner elements only.

- [ ] **Step 1: Build `RoomHero.tsx`** per the behaviour above.
- [ ] **Step 2: Wire it into `page.tsx`** and remove the old hero, `TrustRibbon` usage and `HeroScene`.
- [ ] **Step 3: Type-check and test.** Run: `npx tsc --noEmit -p . && npm test`. Expected: no type errors; tests PASS.
- [ ] **Step 4: Browser check at 1280×800** (dev server on :3000), scrolling with the wheel:
  - at the end of the intro, the AC scene appears through the opening hole with a dark top
  - after the intro releases, there's no jump
  - scrolling moves AC → washer → fridge → TV, each settling on its own
  - the rail and "Skip to shop" work
  - hotspots show real specs
  - no console errors
- [ ] **Step 5: Browser check at 375×812:** headline, CTAs, rail and trust strip don't overlap.
- [ ] **Step 6: Browser check with reduced motion emulated:** no pin; the AC scene and the switch buttons show.
- [ ] **Step 7: Commit.** `git commit -am "feat(home): scroll-driven room hero"` (include the new file with `git add`).

---

### Task 4: Shop by room bento, products on sand, and the stone ProductCard

**Files:**
- Create: `src/components/home/ShopByRoom.tsx`
- Modify: `src/components/ProductCard.tsx`: add the optional prop `tone?: 'default' | 'stone'` (default `'default'`, so other pages are unchanged). `'stone'` gives a `bg-warm-linen` card, the room image on top with a `rounded-[22px]` image well, a benefit pill with ink background and stone text (from `product.badge`, falling back to `product.features?.[0]`), and the price in `font-display`.
- Modify: `src/app/page.tsx`: replace the CATEGORIES (BENTO) section body with `<ShopByRoom />` (keep `id="categories-section"`). Make the FEATURED PRODUCTS section `bg-warm-sand`, with its heading in `font-serif` and its cards using `tone="stone"`.

**Interfaces:**
- Consumes: `CATEGORIES` from `@/data/products` (fields `id`, `name`, `image`, `badge`); `font-serif` and `warm-*` tokens (Task 2).
- Produces: `export default function ShopByRoom(): JSX.Element`, rendered as `<section id="categories-section" className="bg-warm-stone py-24">`.

Layout: eyebrow "Shop by room" (electric); a serif heading "Everything your home runs on."; then a grid of the first four categories in mockup order (AC large, spanning 2 rows on desktop; washer; fridge; TV spanning 2 columns). Each tile is a link to `/products?category=<id>`, `rounded-[26px]`, with the image `object-cover`, a bottom gradient, the name, and the badge in a small linen pill. Hover zooms the image to 1.05 and slides the caption up 6px. Below 768px, use a single column with tiles `aspect-[4/3]`. Tiles reveal with framer-motion `whileInView` (fade + 24px rise, `once: true`, staggered 0.08s), skipped under reduced motion.

- [ ] **Step 1: Build `ShopByRoom.tsx`** and the `tone` variant.
- [ ] **Step 2: Wire them into `page.tsx`.**
- [ ] **Step 2b: Match the product photos.** For each product shown on the home page whose `image` in `src/data/products.ts` is an Unsplash URL that clashes with the warm palette (cold, cluttered, or not a real room), swap it for a free-licence `images.unsplash.com` room shot of the same appliance type. That host is already allowed in `next.config` `remotePatterns`. Keep the four local `/appliances/*.jpg` images as they are. List the swapped product ids in the commit message.
- [ ] **Step 3: Verify.** Run: `npx tsc --noEmit -p .`. Expected: no output. In the browser at 1280 and 375 widths, the bento matches the warm-stone mockup and the single column works on phone. `/products` cards still look exactly as before.
- [ ] **Step 4: Commit.** `git commit -am "feat(home): shop-by-room bento and stone product cards"` (add the new file).

---

### Task 5: Restyle the remaining sections on stone

**Files:**
- Modify: `src/app/page.tsx` (ENERGY BAND, OFFERS, COMMUNITY / VISIT, GUIDES sections)
- Modify: `src/components/HomeFeaturesSection.tsx`
- Modify: `src/components/EnergyCalculator.tsx` (colours only, if its light surfaces clash with ink)
- Modify: `src/components/Reveal.tsx` (`SectionHeading`: optional `serif?: boolean` prop, which renders the title in `font-serif font-medium tracking-[-0.01em]`)

**Interfaces:**
- Consumes: `warm-*` tokens and `font-serif` (Task 2); `SectionHeading` with the new `serif` prop.

Per section (from the spec's section map):
- Energy band: stays `bg-ink` (the one dark break), with the calculator restyled to match. No other change.
- Offers: `bg-warm-stone`; offer cards are ink panels with serif headings and an electric CTA, as in the mockup.
- Features (`HomeFeaturesSection`): `bg-warm-sand`, with simple line icons in ink and no glow or blur.
- Community / visit: `bg-warm-stone`; the Facebook card stays Facebook blue, the visit card becomes linen with ink text, and the WhatsApp button stays `#25D366`.
- Guides: `bg-warm-stone`; editorial cards on linen with serif titles.
- Every light-section `SectionHeading` uses `serif`.

- [ ] **Step 1: Apply the restyles above.**
- [ ] **Step 2: Verify.** Run: `npx tsc --noEmit -p .`. Expected: no output. In the browser, scroll the whole page at 1280 and 375 widths: there are no white/mist sections left on the home page apart from the footer, and the contrast is readable.
- [ ] **Step 3: Commit.** `git commit -am "feat(home): warm stone restyle for remaining sections"`

---

### Task 6: Final verification

**Files:** none new.

- [ ] **Step 1:** Run `npm test && npx tsc --noEmit -p . && npm run build` (no lint: the project has no ESLint config, and `next lint` would prompt). Expected: all pass, and the build succeeds.
- [ ] **Step 2:** In the browser at 1280×800, scroll top to bottom: intro → room hero (4 scenes) → stone sections → footer. There are no seams between intro and hero, or between hero and stone, and no console errors.
- [ ] **Step 3:** Repeat at 375×812, and again with reduced motion emulated.
- [ ] **Step 4:** Confirm `HeroScene` is no longer imported anywhere on the home page (`grep -n HeroScene src/app/page.tsx` returns nothing).
- [ ] **Step 5:** Commit any fixes: `git commit -am "fix(home): final polish"`.
