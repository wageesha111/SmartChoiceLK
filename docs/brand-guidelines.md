# Smart Choice LK — Brand Guidelines

Source of truth for the website's look and voice. Tokens live in `tailwind.config.ts` (Tailwind theme) and `src/app/globals.css` (CSS variables).

## Identity
- **Name:** Smart Choice LK
- **Tagline:** Choose Smart. Live Better.
- **Location:** Raddoluwa, Seeduwa, Sri Lanka — open 7 days
- **Contact:** 076 646 7854 (call / WhatsApp) · thesmartchoicelanka@gmail.com
- **Business details live in:** `src/lib/site.ts`

## Logo
- Mark: chrome "SC" monogram. Website files: `public/brand/sc-mark-white.png`, `sc-mark-navy.png`, `sc-logo-full-white.png`, `sc-logo-full-navy.png` (transparent PNGs).
- Use the white mark on Ink / Electric backgrounds, the navy mark on white / Mist.
- Keep clear space of at least half the mark's height. Don't recolour, stretch or add effects other than the electric glow.

## Colour
| Role | Token | Hex | Use |
|---|---|---|---|
| Ink (primary dark) | `ink` | #050B1A | Hero, footer, dark bands, primary buttons on light |
| Navy | `ink-700` | #0E1F44 | Logo navy, depth layers |
| Electric (brand accent) | `electric` | #2F6BFF | CTAs, links, highlights, glow |
| Glow | `glow` | #38BDF8 | Secondary light accents in 3D/gradients only |
| Mist | `mist` | #F3F5FA | Light section backgrounds, cards |
| White | — | #FFFFFF | Base background |
| WhatsApp | — | #25D366 | WhatsApp buttons only |

Text contrast: body text ≥ 4.5:1 (white/60+ on Ink, slate-500+ on white). Electric is never used for body text on Ink.

## Typography
- **Display:** Sora 600–800, tight tracking (-0.02 to -0.035em). Headlines, prices, numbers.
- **Body:** Plus Jakarta Sans 400–700, 15–18px, line-height 1.6.
- Eyebrows: 11px uppercase, tracking 0.2em, Electric.

## Shape & surface
- Radius: 26–28px for cards and bento tiles, full pills for buttons and chips.
- Glass: `bg-white/[0.06]` + `backdrop-blur` + `border-white/10` on dark only.
- Shadows: soft, long, ink-tinted (`0 30px 60px -30px rgba(14,31,68,.35)`).

## Motion & 3D
- 3D: one Three.js scene per page (hero), DPR capped at 1.75, paused off-screen, static fallback for reduced motion.
- Tilt: max 8°, desktop pointer devices only.
- Scroll: GSAP ScrollTrigger for parallax and scrubbed reveals; no scroll-jacking; at most one pinned section per page.
- UI motion: Motion springs (stiffness 300–400), 200–700ms, `once: true` reveals.
- Everything respects `prefers-reduced-motion`.

## Voice
- Friendly local expert, plain English, short sentences. Honest — no invented reviews, stats or "official dealer" claims unless verified.
- Lead with what helps the customer: right size, lower bills, delivery, installation, after-sales help.
- Primary CTA: "Shop all products". Conversational CTA: "WhatsApp us" / "Get a price on WhatsApp".
