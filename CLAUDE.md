# NvisionAI — Project Design System

This file is the source of truth for visual styling. Any UI work MUST conform to these rules.

> **Note:** The project was redesigned into a premium, futuristic SaaS landing page.
> It now uses **Tailwind CSS v4 + Framer Motion + Lenis + GSAP + Three.js**.
> The previous "plain-CSS only, no gradients, no glass" rules have been superseded.

## Stack

- **Tailwind CSS v4** via `@tailwindcss/vite` (configured in `vite.config.js`).
  Design tokens live in the `@theme` block of `src/index.css`. Use Tailwind
  utility classes for all styling — do not add component stylesheets.
- **Framer Motion** — scroll reveals, stagger, counters, hover micro-interactions.
- **Lenis** — momentum smooth scroll (`useLenis` hook in `NvisionAI.jsx`).
- **GSAP + ScrollTrigger** — scroll-progress bar; synced to Lenis via `gsap.ticker`.
- **Three.js / @react-three/fiber / drei** — the floating distorted hero orb.

## Color palette

| Token        | Value     | Usage                                                 |
|--------------|-----------|-------------------------------------------------------|
| White        | `#ffffff` | Page background (always white/soft white).            |
| Ink          | `#0a0a0a` | Body + heading text (use `text-ink`, `/70` opacity for muted). |
| Brand orange | `#ff4500` | Primary accent, CTAs, metrics, borders, glows.        |
| Orange soft  | `#fff1ec` | Tinted pill/card backgrounds, accent fills.           |
| Green        | `#16a34a` | Secondary accent, success, banking vertical.          |
| Green soft   | `#effaf3` | Tinted green backgrounds.                              |

**Rules:**
1. Background stays white/soft-white. Large dark surfaces are allowed only as
   intentional focal elements via the `.glass-dark` utility (popular pricing
   card, bento hero card, TAM header band).
2. **No gray text.** Muted text = `text-ink/70`, `/65`, `/55` (ink at opacity).
   Never `text-gray-*`, `slate`, etc.
3. Subtle orange/green gradients and glassmorphism are encouraged — use the
   `.glass`, `.glass-dark`, `.text-gradient`, `.mesh-bg` utilities in `index.css`.
   Keep washes subtle; the page must still read as white + clean.
4. New colors require updating the `@theme` tokens here and in `index.css` first.

## Utilities (defined in `src/index.css`)

- `.glass` — translucent white glass card (blur + orange-tinted shadow).
- `.glass-dark` — near-black glass for focal elements.
- `.text-gradient` — orange→green text clip.
- `.mesh-bg` — subtle multi-radial orange/green ambient background.
- Animations via `@theme`: `animate-marquee`, `animate-float-slow`,
  `animate-pulse-glow`, `animate-shimmer`.
- `prefers-reduced-motion` is respected globally.

## Typography

- Body: `font-sans` (DM Sans, weight ≥ 500 for body).
- Display: `font-serif` (DM Serif Display) — headings, prices, metrics.
- Mono / eyebrows / tags: `font-mono` (DM Mono), uppercase, wide tracking.

## Component patterns

- **Buttons (primary):** `bg-orange text-white` + orange drop shadow,
  `whileHover scale 1.04`.
- **Buttons (secondary):** `.glass` or white + `ring-1 ring-ink/10`.
- **Cards:** `.glass`, ~24px radius, `whileHover={{ y: -6/-10 }}`,
  orange blur accent on hover.
- **Eyebrows/tags:** mono 10–11px uppercase, `bg-orange-soft`/`bg-green-soft` pills.
- **Pricing — popular card:** `.glass-dark`, `ring-2 ring-orange`, green checks,
  orange CTA. Keep it.
- **Sections:** wrapped in `<Reveal>` for scroll fade-up; headings via `<SectionHead>`.

## Files of record

- `src/index.css` — Tailwind import, `@theme` tokens, keyframes, glass utilities.
- `src/pages/NvisionAI.jsx` — full page, all components and section data.
- `vite.config.js` — React + Tailwind plugins.

## Forbidden

- Gray text/borders (use `ink` at opacity).
- Hardcoded hex outside the `@theme` tokens.
- Heavy/clashing color washes that break the clean white feel.
- Component CSS files / global non-Tailwind styles (except `index.css` utilities).
