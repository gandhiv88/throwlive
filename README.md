# ThrowLive: Throwball Score Tracker

ThrowLive is a modern, mobile-first, real-time score tracking app for throwball matches. Built with Next.js, Supabase, and Tailwind CSS, it supports live scoring, admin and viewer modes, and robust game automation.

## Features
- Mobile-first, PWA-ready UI
- Real-time updates for viewers and admins
- Automated set/match logic (auto end set, auto next set, auto end match)
- Admin and viewer links with secure token handling
- Dark mode and theme toggle
- Match creation, sharing, and history
- Supabase backend with RLS and RPC for all writes
- Roadmap for advanced features (see `ideas.md`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Supabase:**
   - Copy `.env.example` to `.env.local` and set your Supabase URL and anon key.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/` - Next.js App Router pages (admin, viewer, share, new match, etc.)
- `lib/` - Supabase client, API helpers, realtime helpers
- `components/` - ThemeProvider, ThemeToggle, Header, etc.
- `types/` - TypeScript types for DB
- `ideas.md` - Product roadmap and backlog

## Roadmap
See [`ideas.md`](./ideas.md) for a living backlog of planned features and improvements.

## Deployment
You can deploy ThrowLive to Vercel, Netlify, or any platform supporting Next.js App Router. Configure your Supabase environment variables in the deployment settings.

## License
MIT
