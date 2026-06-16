Smart. Here it is:

```md
# FX Checker — CLAUDE.md

## Project overview
Currency exchange web app built for the Frontend Mentor hackathon.
Live rates, history charts, favorites, conversion log, rate alerts, and a travel budget calculator.

## Tech stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- TailwindCSS v4
- Framer Motion
- React Query (TanStack Query v5)
- Supabase (Postgres + Auth + RLS)
- Recharts
- Zod (validation)
- Sonner (toasts)

## Project structure
```
/app
  /api
    /rates/route.ts          → current rates from Frankfurter
    /history/route.ts        → historical rates for charts
    /user
      /favorites/route.ts
      /log/route.ts
      /alerts/route.ts
  /(auth)
    /login/page.tsx
    /signup/page.tsx
  /(app)
    /page.tsx                → converter (home)
    /dashboard/page.tsx      → multi-currency watchlist
    /history/page.tsx        → rate history chart
    /favorites/page.tsx
    /log/page.tsx
    /alerts/page.tsx
    /travel/page.tsx         → travel budget calculator
  /layout.tsx
/components
  /ui                        → primitives (Button, Input, Select, Badge, Skeleton)
  /converter                 → ConverterCard, SwapButton, CurrencySelect
  /charts                    → HistoryChart, ComparisonChart
  /dashboard                 → RateGrid, TrendBadge
  /alerts                    → AlertForm, AlertList
  /shared                    → Navbar, ThemeToggle, OfflineBanner, CurrencyFlag
/lib
  /api
    frankfurter.ts           → typed fetch helpers
    supabase.ts              → server + client instances
  /hooks
    useRates.ts
    useHistory.ts
    useFavorites.ts
    useConversionLog.ts
    useAlerts.ts
    useOfflineFallback.ts
  /utils
    currency.ts              → formatting, rounding, allowlist
    date.ts                  → range helpers
    storage.ts               → localStorage read/write with timestamps
  /validators
    rates.ts                 → Zod schemas for route handler inputs
    user.ts
  /constants
    currencies.ts            → allowed currency codes, names, flags
/types
  index.ts                   → CurrencyCode, RateMap, HistoryPoint, FavoritePair, ConversionLog, RateAlert
```

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # server only, never exposed to client
```

## Database schema (Supabase)
```sql
-- favorite_pairs
create table favorite_pairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  from_currency text not null,
  to_currency text not null,
  created_at timestamptz default now()
);

-- conversion_log
create table conversion_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  from_currency text not null,
  to_currency text not null,
  from_amount numeric not null,
  to_amount numeric not null,
  rate numeric not null,
  converted_at timestamptz default now()
);

-- rate_alerts
create table rate_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  from_currency text not null,
  to_currency text not null,
  target_rate numeric not null,
  direction text check (direction in ('above', 'below')) not null,
  active boolean default true,
  created_at timestamptz default now()
);
```

## RLS policies (apply to all three tables)
```sql
alter table favorite_pairs enable row level security;
create policy "Users own their favorites"
  on favorite_pairs for all using (auth.uid() = user_id);

alter table conversion_log enable row level security;
create policy "Users own their log"
  on conversion_log for all using (auth.uid() = user_id);

alter table rate_alerts enable row level security;
create policy "Users own their alerts"
  on rate_alerts for all using (auth.uid() = user_id);
```

## API routes — rules
- All Frankfurter calls go through `/app/api` — never fetch directly from client
- Every route validates input with Zod before touching any external service
- Currency codes validated against ALLOWED_CURRENCIES allowlist in `/lib/constants/currencies.ts`
- Date ranges capped at 365 days
- User routes verify session with `supabase.auth.getUser()` before any DB operation
- Frankfurter routes return `Cache-Control: public, s-maxage=3600`

## Data fetching — rules
- All client fetches use React Query
- Page-level data: fetch rates + history in parallel with `Promise.all` or `useQueries`
- Never chain dependent fetches unless data truly depends on previous result
- Stale time: 1 hour for rates, 24 hours for history
- On fetch failure: fall back to localStorage cache, show OfflineBanner with cache age

## TypeScript rules
- Strict mode always on
- No `any` — use `unknown` and narrow
- All API responses typed via Zod schemas, infer types from schemas
- `CurrencyCode` is a union type derived from the allowlist, not a plain `string`

## HTML & accessibility
- Semantic elements always — `<main>`, `<nav>`, `<section>`, `<article>` where appropriate
- Every interactive element reachable and operable by keyboard
- Currency selects use `<select>` or a properly labelled combobox with ARIA if custom
- All form inputs have visible labels — no placeholder-only labels
- Color is never the only indicator (trend badges use icon + color, not color alone)
- Focus ring never removed — style it, don't kill it
- Modals trap focus and restore it on close
- WCAG AA as the floor — check contrast on all text, especially rate numbers

## CSS & theming
- Tailwind utility-first — no custom CSS unless Tailwind genuinely can't do it
- Dark mode via `class` strategy — `dark:` variants throughout
- CSS custom properties for brand tokens (defined in `globals.css`)
- Animations wrapped in `@media (prefers-reduced-motion: reduce)` — respect the OS setting
- No layout shift on rate updates — reserve space for numbers before they load with skeletons

## Components — rules
- UI primitives in `/components/ui` are unstyled building blocks — no business logic
- Feature components own their own React Query hooks
- Skeleton loaders for every component that fetches data — no blank states
- Error boundaries around chart components — a broken chart should not crash the page

## Animations (Framer Motion)
- Swap button: flip animation on currency swap
- Converted amount: number tick animation when value changes
- Page transitions: fade + slide on route change
- Favorites: spring animation on add/remove
- All animations respect `prefers-reduced-motion`

## Performance
- Images: use `next/image` for all flag images
- Fonts: `next/font` with `display: swap`
- Bundle: no direct lodash imports — use individual functions or native equivalents
- Charts: lazy load Recharts with `dynamic(() => import(...), { ssr: false })`
- Rate polling for alerts: only active when tab is visible (`document.visibilityState`)

## Security checklist
- [ ] ALLOWED_CURRENCIES allowlist enforced on every rate/history route
- [ ] Date range capped at 365 days on history route
- [ ] JWT verified server-side on all `/api/user/*` routes
- [ ] RLS enabled on all three Supabase tables
- [ ] SUPABASE_SERVICE_ROLE_KEY never imported in client components
- [ ] No raw SQL anywhere — Supabase SDK only
- [ ] `NEXT_PUBLIC_` prefix only on variables safe to expose to the browser

## Offline fallback
- On successful rate fetch: write to `localStorage` with timestamp
- On failed fetch: read from cache, surface age to user via `OfflineBanner`
- Cache key: `fx_rates_cache` — shape `{ data: RateMap, ts: number }`

## Keyboard shortcuts
- `S` — swap currencies
- `F` — focus amount input
- `C` — clear amount
- `?` — open shortcuts modal
- All shortcuts disabled when focus is inside an input

## Code style
- Named exports only — no default exports except page and layout files (Next.js requirement)
- Hooks in `/lib/hooks` — one file per hook
- Util functions pure and unit-testable
- No inline styles — Tailwind only
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`)
```
