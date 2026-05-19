# Mileora — Design assets

| File | Purpose |
|---|---|
| [`design-system.md`](design-system.md) | Brand voice, color tokens, typography, components, breakpoints — the source of truth for visual design |

## What's missing (todo)

- `logo-wordmark.svg` — full "Mileora" wordmark with gold gradient
- `logo-monogram.svg` — `✦M` for favicons + app icons (~512×512 source)
- `icons/` — PWA icons (192, 512), Apple touch icon (180), favicon.ico — pipe through https://realfavicongenerator.net
- `og-template.fig` — Figma source for `web/src/app/opengraph-image.tsx`
- `figma-link.txt` — link to the canonical design Figma when one exists
- `screenshots/` — App store screenshots (iOS + Android) at required sizes
- `mockups/` — Static page mockups for stakeholder previews

## Where the tokens actually live

Code source of truth:
- **Web**: [`web/src/styles/globals.css`](../web/src/styles/globals.css) — Tailwind v4 `@theme` block
- **Mobile**: [`mobile/tailwind.config.js`](../mobile/tailwind.config.js) — NativeWind theme

When you change a token here, update **both** code locations. The `design-system.md` doc tracks what they should be.
