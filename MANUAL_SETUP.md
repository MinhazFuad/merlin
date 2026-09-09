
# Merlin — Manual Setup Guide

This document describes all the manual steps the owner must complete in external dashboards before the app runs end-to-end. The agentic build has already created all the code; you just need to wire up the services.

---

## 1. Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. From **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

3. In the **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql` and run it.

---

## 2. Supabase Auth

### Email/Password
- In **Authentication → Providers**, ensure **Email** is enabled.
- You may want to disable **Confirm email** during development for faster testing.

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create an OAuth 2.0 client ID (Web application).
3. Add `https://<your-supabase-project>.supabase.co/auth/v1/callback` as an authorized redirect URI.
4. Copy the **Client ID** and **Client Secret**.
5. In Supabase **Authentication → Providers → Google**, paste the Client ID and Client Secret.

---

## 3. Environment Variables

Create a `.env.local` file at the root of the project:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production (Vercel), add these as **Environment Variables** in the Vercel dashboard and set `NEXT_PUBLIC_SITE_URL` to your production domain.

---

## 4. Vercel Deployment

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), create a new project and import the GitHub repo.
3. Add all four env vars from §3 to Vercel's environment variables.
4. Set the **Root Directory** to the repo root (default).
5. Framework preset: **Next.js** (auto-detected).
6. Deploy.

---

## 5. Open Product Decisions (answer before shipping)

| Question | Default assumed | Your choice |
|---|---|---|
| License for the open-source repo | MIT | |
| Anonymous user drafts persist across sessions via `localStorage`? | No (reset on refresh) | |
| Re-sharing after unsharing reuses old slug? | Yes (keep slug) | |
| Diagram count / size limits per free account? | None (v1) | |

---

## 6. After Setup

Run the dev server:

```bash
npm run dev
# or
pnpm dev
```

Visit `http://localhost:3000`. The editor works immediately without env vars — you only need them for saving, login, and sharing.
