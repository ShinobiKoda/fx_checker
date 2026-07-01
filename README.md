# FX Checker

FX Checker is a hackathon ready foreign exchange platform built to impress judges in the first demo pass. It combines live currency conversion, market intelligence, analytics, user accounts, offline resilience, and a polished UI into one fast experience.

## Live Demo

[Open the live app](https://fx-checker-pied.vercel.app)

## Screenshots

Add your project images here to give judges a fast visual overview of the experience.

### Main Converter

![Main Converter](./public/images/screenshot-converter.png)

### Analytics View

![Analytics View](./public/images/screenshot-analytics.png)

### Mobile View

![Mobile View](./public/images/screenshot-mobile.png)

## Why It Stands Out

FX Checker was designed to feel like a product that ships, not just a prototype. It gives judges clear signals of depth, polish, and technical ambition.

- Real financial utility with live exchange rates and historical data
- Strong visual presentation with motion, theming, and responsive layouts
- Meaningful feature breadth, including compare mode, alerts, logs, favorites, and analytics
- Offline caching so the app remains useful even when connectivity drops
- Authentication and persistence through Supabase
- An embeddable widget that turns the project into a reusable product

## Feature Overview

### Conversion Experience

- Live exchange rates powered by Frankfurter data
- Searchable currency pickers with grouped currency lists
- Swap, reverse, and quick keyboard controls for fast input
- URL synced state for shareable conversion links
- Offline fallback using cached rate data

### Market Intelligence

- Live markets ticker for major pairs and performance context
- Historical charts with selectable ranges from short term to long term
- Compare mode for multi currency benchmarking
- Analytics views for strength, correlation, recurring conversion trends, and Big Mac Index context

### User Features

- Supabase authentication with email and password sign in
- Favorites for frequently used pairs
- Conversion logs and alert tracking
- CSV export support for stored data
- Welcome email flow powered by Resend

### Product Extras

- Embeddable widget for external sites
- Mobile friendly tab navigation
- Light and dark themes with a consistent design system
- Smooth transitions and micro interactions powered by Framer Motion

## Keyboard Shortcuts

Press ? in the app to open the shortcuts modal.

- / focuses the amount input
- S swaps the currencies
- X clears the amount
- R toggles reverse mode
- 1 through 6 switch chart ranges from 1D to 5Y

## App Sections

- History for historical performance and chart exploration
- Compare for side by side currency benchmarking
- Dashboard for a high level overview
- Units for conversion utilities
- Invoice for invoice oriented conversion workflows
- Favorites for saved currency pairs
- Logs for conversion history
- Alerts for rate monitoring
- Analytics for deeper market context

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS and CSS variables
- Framer Motion
- Recharts
- Supabase
- Resend
- Vercel Analytics
- React Icons and Lucide Icons

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

3. Create a `.env.local` file in the project root.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   ```

   If you use the welcome email rate limiting path in production, configure Upstash as well.

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

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run start` runs the production server
- `npm run lint` checks the code with ESLint

## Environment Notes

- The app pulls rates from Frankfurter endpoints.
- Supabase is used for authentication and user specific data.
- Resend powers the welcome email flow.
- Upstash is used for optional rate limiting in the welcome email route.

## Deployment

This project is optimized for Vercel deployment. Make sure the environment variables above are set in your deployment target, then build and deploy normally.

## Design Choices

- State is lifted at the page level so the converter, URL, and tabs stay synchronized.
- CSS variables drive theming, which keeps dark mode and light mode consistent without duplicated styling.
- The UI favors fast feedback, with optimistic interactions and cached data wherever possible.

## License

MIT
