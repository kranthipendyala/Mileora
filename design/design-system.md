# Mileora — Design System

The single source of truth for brand visuals. Tokens live in [`web/src/styles/globals.css`](../web/src/styles/globals.css) (Tailwind v4 `@theme`) and the mobile [`tailwind.config.js`](../mobile/tailwind.config.js).

When you change a token, update **both**.

---

## Brand voice

> **Premium spiritual.** Cosmic. Warm. Quietly authoritative. Never garish.

Inspired by: temple gold-leaf manuscripts, midnight monsoon skies, a Diwali diya at dusk.

Avoid: stock saffron-on-orange, bouncy emoji-heavy "fun astrology" aesthetic, anything that looks like a daily-horoscope spam app.

---

## Color tokens

### Backgrounds

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#0b0a14` | Page background — deep cosmic midnight |
| `--color-bg-elev` | `#14132a` | Elevated surfaces (header strip, sub-nav) |
| `--color-surface` | `#1a1830` | Cards, modals, sidebars |
| `--color-border` | `#2a2745` | All hairlines + card outlines |

### Foreground

| Token | Hex | Use |
|---|---|---|
| `--color-text` | `#f5f1e8` | Primary body text — warm cream, never pure white |
| `--color-text-muted` | `#a9a3b8` | Secondary text, captions, labels |

### Gold accent (primary)

| Token | Hex | Use |
|---|---|---|
| `--color-gold-50` | `#fdf8e7` | Backgrounds for celebratory states |
| `--color-gold-100` | `#fbeec0` | Interactive text on dark, accent links |
| `--color-gold-300` | `#f1cb5b` | Icon strokes, active stars, dividers |
| `--color-gold-500` | `#d4a017` | **Primary CTAs**, focus rings, "active" portal nav |
| `--color-gold-700` | `#9b7000` | Hover states for inverse buttons |

### Secondary accents

| Token | Hex | Use |
|---|---|---|
| `--color-saffron` | `#ff7a00` | Warm spiritual accent — puja-related sections |
| `--color-rose` | `#d4476a` | Compatibility, love-themed sections, admin destructive (`bg-rose-400` etc. via Tailwind) |
| `--color-vedic-violet` | `#5b3aa0` | Hero gradient backgrounds, "cosmos" branding |

### Status colors (use Tailwind utilities)

| State | Tailwind |
|---|---|
| Success | `text-emerald-200`, `bg-emerald-400/10`, `border-emerald-400/30` |
| Warning | `text-[color:var(--color-gold-100)]`, `bg-[color:var(--color-gold-500)]/10` |
| Error / destructive | `text-rose-200`, `bg-rose-400/10`, `border-rose-400/30` |

### Portal accent overrides

The admin portal uses **rose** as its accent (instead of gold) to visually signal "this is operator console, not customer-facing." See [`web/src/app/admin/layout.tsx`](../web/src/app/admin/layout.tsx).

---

## Typography

### Font families

| Token | Family | Use |
|---|---|---|
| `--font-sans` | `Inter` | All body, UI labels, buttons |
| `--font-display` / `--font-serif` | `Cormorant Garamond` | Headings, all H1–H3, pricing numbers |
| `--font-cormorant` | Same as above | The actual CSS variable Next.js generates |

Both are self-hosted via `next/font/google` in [`web/src/app/layout.tsx`](../web/src/app/layout.tsx). No external font requests in production.

### Type scale

| Element | Class |
|---|---|
| Hero H1 | `font-[family-name:var(--font-cormorant)] text-5xl sm:text-6xl tracking-tight` |
| Page H1 | `font-[family-name:var(--font-cormorant)] text-4xl tracking-tight` |
| Section H2 | `font-[family-name:var(--font-cormorant)] text-3xl tracking-tight` |
| Card H3 | `font-[family-name:var(--font-cormorant)] text-2xl` |
| Body | default — Inter, 1rem |
| Caption / label | `text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]` (eyebrow) or `text-xs text-[color:var(--color-text-muted)]` |

### The "eyebrow" pattern

Every section header has a small uppercase tracked label above it in gold. This is core to the brand:

```tsx
<p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">
  Our story
</p>
<h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
  Bridging <span className="text-gradient-gold">5,000-year wisdom</span> and modern lives
</h2>
```

---

## Surfaces

### Card

```html
<div class="rounded-2xl border border-[color:var(--color-border)]
            bg-[color:var(--color-surface)]/60 p-6
            shadow-[var(--shadow-card)]" />
```

### Highlight card (gold-glow)

```html
<div class="rounded-2xl border border-[color:var(--color-gold-500)]/30
            bg-[color:var(--color-surface)]/70 p-6
            shadow-[var(--shadow-glow)]" />
```

Used for: booking sidebar, lead-form box, primary CTAs.

### Cosmic background

```html
<body class="bg-cosmic">           <!-- gradient mesh -->
<section class="bg-grain">          <!-- adds noise grain -->
```

Both are defined in [`globals.css`](../web/src/styles/globals.css). Hero sections always layer `bg-grain` over `bg-cosmic`.

---

## Buttons

| Type | Class |
|---|---|
| **Primary CTA** | `bg-[color:var(--color-gold-500)] text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]` |
| **Secondary** | `border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 hover:border-[color:var(--color-gold-500)]` |
| **Destructive (admin)** | `bg-rose-500 text-white hover:bg-rose-400` |
| **Ghost** | `text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold-100)]` |

Standard size: `px-4 py-2 text-sm` (compact), `px-6 py-3 text-base` (default CTA).

Always include `rounded-md` (small) or `rounded-lg` (medium) — never `rounded-full` for CTAs (looks consumer-y, not premium).

---

## Form inputs

```html
<input class="rounded-md border border-[color:var(--color-border)]
              bg-[color:var(--color-bg)]/60 px-3 py-2.5
              text-sm text-[color:var(--color-text)]
              outline-none focus:border-[color:var(--color-gold-500)]" />
```

Focus ring is **gold border + 3px gold/15% box-shadow** — see `.input:focus` blocks across forms.

Labels are tiny tracked uppercase:

```html
<span class="text-xs font-medium uppercase tracking-wider
             text-[color:var(--color-text-muted)]">Mobile</span>
```

---

## Spacing

Standard rhythm uses Tailwind defaults:

| Use | Class |
|---|---|
| Section vertical padding | `py-24` (or `py-20` on smaller sections) |
| Container max-width | `max-w-7xl` (full marketing), `max-w-5xl` (legal), `max-w-3xl` (article reading), `max-w-md` (login) |
| Horizontal padding | `px-4 sm:px-6 lg:px-8` (every section) |
| Gap between cards in a grid | `gap-4` (compact), `gap-6` (default) |

---

## Iconography

- Library: **Lucide React** ([lucide.dev](https://lucide.dev))
- Standard size: `h-4 w-4` (inline), `h-5 w-5` (in section headers), `h-6 w-6` (in feature cards), `h-7 w-7` (in hero icons)
- Color: `text-[color:var(--color-gold-300)]` (default), `text-rose-300` (destructive), `text-emerald-300` (success)
- Always include `aria-hidden` if it's purely decorative

---

## Breakpoints

| Name | min-width | Tailwind |
|---|---|---|
| Mobile | 0 | (default) |
| sm | 640px | `sm:` |
| md | 768px | `md:` |
| lg | 1024px | `lg:` — desktop sidebar appears at this breakpoint |
| xl | 1280px | rarely needed |

The portal nav switches from bottom-tab-bar (mobile) → sidebar (`lg:`) at 1024px.

---

## Motion

- Use **Framer Motion** sparingly. Premium feel = restraint, not animation density.
- Standard easing: `transition-colors duration-200 ease-out`
- Hover lift: `transition-all hover:-translate-y-1` (cards only — never on text)
- Spring animations only for modals + first-load hero reveals

---

## Accessibility

- All interactive elements meet **WCAG AA contrast** against the dark background (text-on-bg ratios all > 7:1)
- Every icon-only button has `aria-label`
- Decorative icons have `aria-hidden`
- Focus rings are always visible (gold-500 border)
- Forms use `<label>` + `<input>` association — never placeholder-as-label

---

## Brand exports

Add these to the folder as you generate them:

- `logo-wordmark.svg` — "Mileora" in Cormorant Garamond + gold gradient (not yet exported)
- `logo-monogram.svg` — `✦M` mark for favicons + app icons
- `palette.ase` — Adobe Swatch Exchange for designers
- `figma-link.txt` — link to the canonical Figma file

---

## When in doubt

1. Use existing tokens. Don't introduce a new color unless absolutely necessary.
2. Pick the simpler, more restrained option. Premium ≠ ornate.
3. Test on a real phone — the dark theme can read differently on OLED vs cheap LCD.
4. Compare against the home page hero — does your new component feel like it belongs in the same world?
