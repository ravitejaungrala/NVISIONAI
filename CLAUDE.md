# NvisionAI — Project Design System

This file is the source of truth for visual styling on this project. Any UI work, new components, edits, or copy-paste from external snippets MUST conform to these rules.

## Color palette (only these — nothing else)

| Token        | Hex / value | Where it is allowed                                  |
|--------------|-------------|------------------------------------------------------|
| White        | `#ffffff`   | Page background. Cards. Buttons. Anywhere a fill is needed. |
| Brand orange | `#ff4500`   | Text, borders, box edges, accents, primary CTAs.     |
| Green        | `#16a34a`   | Text, borders, box edges, success/positive accents, secondary CTAs. |
| Black        | `#000000`   | Text, borders, box edges. Use sparingly — primary text only. |

**Hard rules:**

1. **Background is always white (`#ffffff`).** Never apply colored fills to large surfaces (sections, hero, footer, cards). Single exception: a small intentional dark element like the "Most Popular" pricing card or a TAM header band, where black is used deliberately as a focal point.
2. **No tinted color washes.** Do not use values like `rgba(255, 69, 0, 0.08)` or any low-opacity colored fill as a box background. The user has explicitly rejected this. The competitor table is the only allowed exception, and only at very low opacity (≤ 0.03) used as alternating row stripes.
3. **No grays.** Do not use `#94a3b8`, `#64748b`, `#475569`, `#334155`, `slate`, `gray-500`, `text-muted-foreground`, etc. Secondary / muted text is solid black or `var(--ink)` (near-black) — never gray.
4. **Borders, dividers, accents, edges**: orange (`#ff4500`), green (`#16a34a`), or black. Pick one. No gray borders.
5. **Text colors**: black for body, orange (`#ff4500`) for brand emphasis / metrics / eyebrows, green for positive/success states.
6. **No other hex values are permitted in CSS** without first updating this file.

## CSS variables (use these, do not hardcode hex)

These are defined at the top of `src/pages/NvisionAI.css`:

```css
--bg: #ffffff;
--orange: #ff4500;
--green: #16a34a;
--black: #000000;
--ink: #0a0a0a;        /* near-black for body text */
--orange-mid: rgba(255, 69, 0, 0.35);   /* allowed only for borders */
--orange-soft: rgba(255, 69, 0, 0.08);  /* allowed only for thin dividers */
--green-mid: rgba(22, 163, 74, 0.4);    /* allowed only for borders */
```

When you add new components, reuse these variables. If a color need can't be expressed with the variables above, the design is wrong — adjust the design.

## Component patterns

- **Buttons (primary)**: orange background, white text, orange shadow.
- **Buttons (secondary / outline)**: silver glassmorphism (translucent gradient + backdrop-filter blur). Text stays black.
- **Cards**: white background, orange border (`var(--orange-mid)` resting, `var(--orange)` on hover), 16–20px radius. Hover lifts 3–6px with orange-tinted shadow.
- **Eyebrows / tags**: small uppercase mono (`DM Mono`), 9–11px, with letter-spacing. Solid green pill with white text, OR solid black pill with white text. No outlined-only chips.
- **Tables**: white headers, per-column colored 3px underlines (black/orange/black/green by default), borders in `--orange-soft`, optional very-light row stripes (≤ 0.03 opacity) cycling through orange / green / black / white.
- **Pricing — Most Popular card**: black background, white text, green check icons, orange CTA button. This is intentional; do not remove.
- **TAM cards header band**: black background, white text. Footer total bar: white background, themed colored border + 4px left accent strip.

## Typography

- Body: `DM Sans`
- Display headings (`.serif`): `DM Serif Display`
- Code-ish / metrics / eyebrows: `DM Mono`

Body text is at least weight 500. Metric labels and eyebrows are weight 800–900 with letter-spacing 0.10–0.18em uppercase.

## Animations

- Page-level callouts (final CTA + footer): orange `pulse-orange` glow keyframe, 2.5s infinite.
- Card hovers: 0.3s ease translateY(-3 to -6px), border tint to `--orange`, soft orange box-shadow.
- Button hovers: never invert to plain black/white. Keep the orange brand language.

## Files of record

- `src/pages/NvisionAI.css` — single stylesheet, design system at top under `:root`.
- `src/pages/NvisionAI.jsx` — page structure.

## Forbidden

- Tailwind utility classes (project uses plain CSS).
- New color values outside this palette.
- Gray text or borders.
- Colored section backgrounds.
- Bullet markers other than green dots, orange dots, or a green ✓ icon.
- Decorative ✕ / negative markers in copy that lists weaknesses (already removed from competitor table).
