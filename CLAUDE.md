# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build (also runs TypeScript check)
pnpm lint       # eslint
```

## Architecture

### Player Identity & Session

Player state (`id`, `username`) lives in **Zustand** (`src/store/player-store.ts`) — in-memory only, no persistence. Refreshing the page clears the store and redirects to `/` (landing). This is intentional: multiple users can play on the same device.

All pages are `"use client"` because they depend on the Zustand store. Guard pattern used everywhere:

```ts
useEffect(() => {
  if (!playerId) router.replace("/");
}, [playerId, router]);
```

### Data Fetching

**TanStack Query** handles all client-side data fetching and mutation.

- `useQuery` for reads (profile, history)
- `useMutation` + `invalidateQueries` for writes (spin, claim reward) — this is how the score updates after a spin without a page reload

All API calls go through `src/services/player-service.ts` — never write `fetch()` directly in components.

### API Layer

Backend is called **directly from the client** (`NEXT_PUBLIC_API_URL`) — no Next.js API proxy routes. This works because the backend has CORS enabled and there are no secrets to hide.

`src/lib/api.ts` (`apiGet`/`apiPost`) exists for **server-side only** use cases (e.g., future Server Actions or Route Handlers that need to call backend with a secret token).

### Response Types

`ApiResponse<T>` is a **discriminated union**:

```ts
| { success: true; data: T; meta?: M }
| { success: false; error: ApiError }
```

Always use `unwrap<T>()` from `player-service.ts` or check `success` before accessing `data`. Never use `as` to cast `res.json()`.

### Game Logic

Spin result is determined **on the frontend** from the wheel's rotation angle, then sent to the backend:

```
gดหยุด → getPointsFromRotation(rotation) → POST /api/v1/players/{id}/spins { points }
```

`getPointsFromRotation` maps degrees → `WHEEL_SEGMENTS` index. Segment size = `360 / WHEEL_SEGMENTS.length`.

### Key Files

| File | Purpose |
|---|---|
| `src/services/player-service.ts` | All API calls — add new endpoints here |
| `src/store/player-store.ts` | Player identity (id, username) |
| `src/lib/constants.ts` | `WHEEL_SEGMENTS`, `CHECKPOINTS`, `MAX_SCORE` |
| `src/types/index.ts` | All shared types + `ApiResponse<T>` |
| `src/components/providers.tsx` | `QueryClientProvider` wrapper (mounted in layout) |

### Environment Variables

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_API_URL` | client — `player-service.ts` |
| `API_URL` | server — `lib/api.ts` |

## Conventions

- **Named exports** for all components and functions
- **`const` arrow functions** for components
- **kebab-case** filenames, **PascalCase** component names
- Add new API response types as `export type XxxResponse = ApiResponse<XxxData>` in `src/types/index.ts`
- All game config (segments, checkpoints, max score) lives in `src/lib/constants.ts` — never hardcode in components
