# LinkingLink

A student-focused collaborative study and social learning platform built with React (Vite + Tailwind) and Supabase (PostgreSQL + Auth + Realtime).

## Tech Stack
- React 18 + Vite + TypeScript
- TailwindCSS
- Supabase (Auth, Postgres, Realtime, Storage)
- Recharts (analytics charts)
- Netlify (deployment)

## Features (Planned)
- Auth (email/password via Supabase)
- Landing page & marketing copy
- Dashboard with study streak, progress line chart, topic distribution pie, leaderboard
- Friends (requests, acceptance, listing)
- Newsfeed (posts, likes, comments, realtime updates)
- Notes repository (upload/download; file URLs stored in DB or Supabase Storage bucket)
- Chat (1:1 realtime, typing indicator)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file (see `.env.example`).

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_public_anon_key
```

### 3. Run Dev Server
```bash
npm run dev
```

### 4. Build
```bash
npm run build && npm run preview
```

### 5. Deploy (Netlify)
- Connect repository
- Set environment variables in Netlify dashboard
- Build command: `npm run build`
- Publish directory: `dist`

## Database Schema
See `sql/schema.sql` for base tables. You may rely on Supabase's built-in `auth.users` instead of a custom `Users` table; if you keep a shadow profile table, omit password fields to avoid redundancy.

## Suggested Improvements
- Replace passwordHash with Supabase Auth (remove from schema; map `auth.user().id` to profile row)
- Add RLS (Row Level Security) policies for each table
- Add indexes for foreign keys and frequent joins (e.g. `Posts(uid)`, `Progress(uid,date)`, `Messages(sender_uid,receiver_uid,timestamp)`)

## License
Educational / course project.
