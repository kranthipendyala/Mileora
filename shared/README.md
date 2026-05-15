# @mileora/shared

Shared TypeScript types and zod schemas. Consumed by both `web/` (Next.js) and `mobile/` (React Native + Expo).

## Why a shared package?

- Single source of truth for API request/response shapes.
- One zod schema for validation that runs in both browser and React Native.
- TypeScript catches drift the moment the API contract changes (since CI3 endpoints are hand-written).

## How web + mobile import it

Both apps reference this folder via path aliases (no publishing needed):

- `web/tsconfig.json` → `"@shared/*": ["../shared/src/*"]`
- `mobile/tsconfig.json` → same alias

```ts
import { LeadInputSchema, type Astrologer } from "@shared/index";
```
