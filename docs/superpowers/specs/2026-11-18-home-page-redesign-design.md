# Home page redesign — design

Date: 2026-11-18 · Status: ready for owner approval

## Intent

The owner wants the home page to feel like a "next level" landing page that lives up to the new Mirror Hall card intro. The current page has the right features but looks template-like, and the products are shown badly: cut-out AC and washer PNGs floating inside 3D orbit rings (`HeroScene`). The products should be shown in real, believable rooms. All existing features stay.

Who it's for: people in and around Seeduwa (and islandwide) shopping for ACs, fridges, washers and TVs, who usually finish by calling or WhatsApping the shop.

Success: after the intro, the page feels like one premium, continuous experience; every product is seen in a real room; the paths to "Shop all products" and "WhatsApp us" are always obvious.

## Goals

- A full-screen, cinematic room hero that continues straight out of the intro's dark.
- Products always shown in real room photography, never floating cut-outs.
- Light "warm stone" shopping sections below the hero with a premium-home feel.
- Keep every existing home-page feature (listed under Section map).
- Fast and readable on phones.

## Non-goals

- No change to the Mirror Hall intro itself (it already hands off by opening a hole in the middle; it will now reveal the new hero).
- No change to other pages (shop, product, cart, about, contact), the navbar or the footer beyond colour tweaks so they sit well next to the new sections.
- No new backend, CMS or checkout work.

## Anti-goals (a failure even if it works)

- Looking like a generic template again, or like a second copy of the intro.
- Invented reviews, stats, ratings or "official dealer" claims (brand voice rule).
- Heavy pages that stutter on mid-range Android phones.
- Scroll that feels trapped (long pinned stretches with nothing happening).

## Constraints

- Next.js 14 App Router, Tailwind 3, framer-motion and GSAP already installed; Three.js already used by the intro.
- Brand guidelines (`docs/brand-guidelines.md`): one Three.js scene per page, at most one pinned section per page, everything respects `prefers-reduced-motion`, WhatsApp green only on WhatsApp buttons.
- Photography on hand: four room photos in `public/appliances/` (AC living room, washer laundry, fridge kitchen, TV lounge), two product cut-outs in `public/antigravity/`. Product data uses these plus some Unsplash URLs.

## Approaches considered

1. **Bright showroom.** Light page straight after the intro, big room photos, editorial type. Loses the continuous "wow" from the dark intro.
2. **Dark cinematic stage.** Whole page dark, a spotlight scroll scene per category. Needs studio renders of every product, heavy on phones, risks feeling like more intro.
3. **Hybrid (picked by the owner).** Dark cinematic hero carrying on from the intro, then the page eases into light sections for shopping. Keeps the wow, fixes the photos, keeps shopping readable and fast.

Within the hybrid, three hero layouts were mocked up: photo window, full-screen room, and expanding room panels. **The owner picked the full-screen room.** Two moods were mocked up for the light part: cool white + electric blue, or warm stone + ink. **The owner picked warm stone.**

## The design

### Overall flow

Intro (unchanged) → **Room hero** (dark → room) → fade into warm stone → shopping sections → ink footer.

### Room hero (the owner's pick: full-screen room)

- The whole viewport is a room photo. The top fades from ink `#050B1A` (so the intro's opening hole shows a seamless dark top) down into the photo, and the bottom fades into warm stone.
- Four scenes, one per category: **AC** (living room) → **Washer** (laundry) → **Fridge** (kitchen) → **TV** (lounge). Each scene has:
  - an eyebrow (category), a big two-part headline in the "Choose smart. Live better." style (e.g. "Cool rooms. **Lower bills.**"), one line of supporting text,
  - two CTAs: primary to that category ("See inverter ACs →"), secondary "Get a price on WhatsApp",
  - one or two glowing hotspots on the product that open a small glass chip with a real spec taken from `src/data/products.ts` (no invented numbers),
  - a slow Ken Burns push-in on the photo.
- **Scenes change by scrolling (owner's decision).** The hero is pinned for about three screen-heights of scroll (roughly one screen per scene change); a progress rail on the right shows which scene you're on and lets you jump. This is the home page's second pinned section after the intro, so the brand guideline's "at most one pinned section per page" rule is updated to allow the intro plus the room hero on the home page only. The owner accepted that products come a little later in exchange for the cinematic feel.
- To keep scroll from feeling trapped: each scene snaps gently into place, something visibly moves on every scroll tick (photo push-in, headline words), and the rail's jump plus a "Skip to shop ↓" link let people leave early.
- Transition between scenes: cross-fade plus a slight scale, with the headline words sliding up.
- The trust points (delivery, warranty, installation, easy payments) sit as a thin glass strip along the bottom of the hero, replacing the separate `TrustRibbon` band.
- `HeroScene` (the orbit-ring Three.js scene) and the floating cut-outs are removed. That also keeps the page to one 3D scene (the intro).

### Warm stone palette (the owner's pick)

| Role | Value | Use |
|---|---|---|
| Stone | `#F4F0EA` | main light background |
| Sand | `#EBE5DC` | alternate section background |
| Linen | `#FBF9F6` | cards and tiles on stone |
| Ink | `#050B1A` | text, dark bands, offer banners, footer |
| Electric | `#2F6BFF` | buttons, links, eyebrows only |

- Headings in the light part use an elegant serif (my call: **Fraunces**, loaded with `next/font`), body stays Plus Jakarta Sans, and prices/numbers stay in Sora.
- `mist` stays defined for other pages; the home page uses the stone set.
- The brand guidelines get a short "Warm stone (home page)" addition so the new palette and serif are documented, plus the pinned-section exception above.

### Section map (every current feature kept)

| Today | New version |
|---|---|
| Hero (rotating cut-outs + orbit rings) | Room hero, above |
| Trust ribbon | Glass strip at the bottom of the room hero |
| Categories bento | "Shop by room" bento of room photos on stone, big AC tile, hover zoom and caption slide-up |
| Featured products (tabs) | Same tabs on sand; product cards on linen with the room photo on top, a blue benefit pill, price in Sora |
| Energy band + calculator | Stays an ink band (the one dark break in the light part) with the calculator, styled to match |
| Offers | Ink offer banners with serif headings and electric CTA, as in the mockup |
| Features section | Restyled on stone with simple line icons, no glow |
| Community / visit (Facebook + shop visit) | Restyled: shop photo or map card plus the Facebook recommendation; WhatsApp button stays green |
| Guides (blog) | Editorial cards on stone with serif titles |
| Footer | Unchanged ink footer |

### Motion

- GSAP ScrollTrigger drives the room hero scenes; framer-motion `once` reveals for the light sections (fade + 24px rise, staggered).
- Subtle image parallax on bento tiles and guide cards (desktop only).
- Reduced motion: the hero shows the AC scene with the others as a simple tap-to-switch row, no Ken Burns, and sections appear without animation.

### Photography

- Start with the four room photos we have (one per scene, also used in the bento and as product-card fallbacks).
- Replace Unsplash product images whose rooms don't match the warm palette with matching room shots, from free-licence stock (Unsplash/Pexels) or AI-generated room scenes. The owner offered to give access to sites if needed.
- All images via `next/image` with proper sizes; hero images preloaded.

## Left to the builder

- Exact headline and one-liner copy per scene (in the brand voice), and which spec each hotspot shows.
- Exact spacing, type scale and breakpoints, following the brand radius and shadow rules.
- Component split (suggested: `RoomHero`, `ShopByRoom`, restyled existing sections).

## Calls I made (owner to check)

- Serif for light-section headings: Fraunces.
- Trust points move into a glass strip on the hero instead of their own band.
- The energy calculator stays an ink band, the one dark break in the light part.
- Hero pin length: about three screen-heights, with gentle snapping and a "Skip to shop" link.
