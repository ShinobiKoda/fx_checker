# FX Checker

FX Checker is a modern foreign-exchange reference app built with Next.js and TypeScript. It focuses on fast conversions, clear UX, and educational transparency about where rates come from.

## Live Demo

[Open the live app](https://fx-checker-pied.vercel.app)

## Frontend Mentor

Frontend Mentor challenge: https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter

## Screenshots

### Desktop View

![Desktop View](./public/images/desktop-screenshot.png)

### Mobile View

![Mobile View](./public/images/mobile-screenshot.png)

## Built With

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Supabase (auth + data)
- Resend (email)

## Feature Status

Implemented

- Live exchange rates (Frankfurter / ECB reference data)
- Searchable currency pickers and flag display
- Swap / Reverse / Keyboard shortcuts
- URL-synced conversions (shareable links)
- Offline fallback with cached rates
- Shortcuts modal and floating help icon
- Web Share API with clipboard fallback (share button)
- Dismissible rate-source banner + restore control
- Favorites, basic auth, and conversion logs
- Embed modal and tabbed views

Partial / Planned

- CSV export (partial)
- Advanced alerts and live broker feeds (planned)
- More robust multi-provider broker switching (planned)

If you want to test specific features, check the implemented list above — anything not listed there may be incomplete or planned.

## Keyboard Shortcuts

Press `?` in the app to open the shortcuts modal.

- `/` focuses the amount input
- `S` swaps the currencies
- `X` clears the amount
- `R` toggles reverse mode
- `1` through `6` switch chart ranges

## Local Setup

1. Clone the repository.

```bash
git clone https://github.com/yourusername/fx-checker.git
cd fx-checker
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env.local` file in the project root with the required keys.

Example `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

Optional (welcome email rate limiting):

```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

4. Start the development server.

```bash
npm run dev
```

5. Open the app at http://localhost:3000.

## Available Scripts

- `npm run dev` — starts the local development server
- `npm run build` — creates a production build
- `npm run start` — runs the production server
- `npm run lint` — runs ESLint

## Notes on Data & Deployment

- Rates are pulled from Frankfurter (ECB reference rates). This is a reference data source; broker quotes may differ due to spreads, fees, execution timing, liquidity, and market volatility.
- The project is deployed on Vercel; ensure required environment variables are added in your deployment target.

## Learning Journal — Frontend Mentor scope

What I implemented for the Frontend Mentor requirements

- Core conversion UI with keyboard shortcuts, swap/reverse, and URL-synced state.
- Rate display and offline fallback using cached Frankfurter rates.
- A compact, dismissible banner that explains the rate source and why broker quotes may differ.
- Share flow using the Web Share API with a clipboard fallback for safety.

What I learned while building this

- UX matters: small touches (dismissible info, accessible buttons, keyboard shortcuts) significantly improve perceived polish.
- Progressive enhancement: using `navigator.share()` with a clipboard fallback keeps the share feature robust across devices.
- Theming and contrast need iteration — ensuring buttons and banners are accessible in both light and dark modes required a couple of styling passes.

What I would change next / continued development

- Extract common UI bits (info banner, small utility buttons) into shared components to avoid duplication and speed future styling changes.
- Add a small visual test or storybook to validate light/dark contrasts automatically.
- Implement a provider abstraction so the app can swap between Frankfurter, other public APIs, and broker feeds with clear fallbacks and feature flags.

## Contributing

PRs and issues are welcome. If you make visual or theme changes, please include screenshots for both light and dark mode.

## License

MIT
