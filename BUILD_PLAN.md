# Merlin — Build Plan

**Handover document for: Antigravity (agentic build)**
**Owner-managed pieces (Vercel/GCP/Supabase dashboards) are documented separately in `MANUAL_SETUP.md` — do not attempt to create cloud accounts, projects, or OAuth clients. Assume the owner will paste in `.env` values you request.**

---

## 1. Project Summary

An open-source, self-hostable web app for writing, previewing, and exporting [Mermaid](https://mermaid.js.org/) diagrams. Think "a nicer, faster, open Mermaid Live Editor" with real accounts, saved diagrams, and shareable links.

**Non-negotiable architectural rule:** the backend (Supabase Postgres) stores **diagram source code and metadata only** — titles, mermaid text, theme choice, visibility, timestamps. It never stores or caches a rendered image. All rendering (SVG generation via the Mermaid library, and SVG→PNG/JPG conversion) happens **in the browser**, on demand, when the user clicks "Export" or "Copy image." This keeps the backend tiny, cheap, and privacy-friendly, and it must not be "optimized away" later by caching rendered images server-side.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router, TypeScript)** | Best-in-class Vercel deployment story, RSC for fast dashboard pages, API routes only where truly needed |
| Styling | **Tailwind CSS** + a small custom design system (see §7) | Fast iteration without looking like default shadcn/Tailwind template |
| UI primitives | **shadcn/ui** (Radix under the hood), heavily re-skinned | Accessible primitives (dialogs, dropdowns, popovers, tooltips) without reinventing them |
| Code editor | **CodeMirror 6** | Lightweight vs. Monaco, has a maintained Mermaid/markdown-adjacent language mode ecosystem, better mobile support |
| Diagram rendering | **mermaid** npm package, dynamically imported client-side only | It's a heavy, DOM-dependent library — never import it in a server component |
| Auth + DB | **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) | Handles Postgres, Row Level Security, and both Google OAuth + email/password auth out of the box |
| State | **Zustand** for editor/session state; React Query (`@tanstack/react-query`) for server data (diagram list, etc.) | Simple, avoids prop drilling, good caching for the dashboard |
| Export pipeline | Native `XMLSerializer` for SVG export; `<canvas>` + `Image` for PNG/JPG rasterization | No server round-trip required |
| Hosting | **Vercel** | Requested by owner; Next.js-native |
| Package manager | **pnpm** | Fast installs, good monorepo story if this ever splits |

Do not introduce a separate backend server (Express/Fastify/etc.). Everything server-side that isn't a static Next.js page should be either a thin Next.js Route Handler (for things Supabase's client SDK can't do directly, e.g. generating a share slug) or handled directly by Supabase (Postgres + RLS + Auth).

---

## 3. Repository Structure

```
merlin/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                 # Public landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── auth/callback/route.ts   # Supabase OAuth callback handler
│   ├── editor/
│   │   ├── page.tsx                 # New/anonymous diagram editor
│   │   └── [diagramId]/page.tsx     # Editing a saved diagram
│   ├── dashboard/
│   │   └── page.tsx                 # "My diagrams" grid/list
│   ├── s/
│   │   └── [slug]/page.tsx          # Public read-only shared view
│   ├── api/
│   │   └── diagrams/
│   │       └── share/route.ts       # Generates a unique public slug (server-side, avoids collisions)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx           # CodeMirror wrapper
│   │   ├── PreviewPane.tsx          # Renders mermaid SVG, handles pan/zoom
│   │   ├── ExportMenu.tsx           # PNG/SVG/JPG + background toggle
│   │   ├── ThemeSwitcher.tsx
│   │   └── Toolbar.tsx
│   ├── dashboard/
│   │   ├── DiagramCard.tsx
│   │   └── DiagramGrid.tsx
│   ├── auth/
│   │   ├── GoogleButton.tsx
│   │   ├── EmailPasswordForm.tsx
│   │   └── AuthGuard.tsx
│   └── ui/                          # shadcn primitives, re-skinned
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client
│   │   ├── server.ts                # server component / route handler client
│   │   └── middleware.ts            # session refresh helper
│   ├── mermaid/
│   │   ├── render.ts                # loadMermaid(), renderToSvg()
│   │   └── export.ts                # svgToPng(), svgToJpg(), downloadFile()
│   ├── validators/
│   │   └── diagram.ts               # zod schemas for diagram payloads
│   └── constants.ts                 # size limits, default templates, theme list
├── store/
│   └── editorStore.ts               # Zustand store: code, dirty state, active theme
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql            # schema + RLS policies (see §5)
│   └── seed.sql                     # example public diagrams for empty dashboards
├── middleware.ts                    # Next.js middleware — refresh Supabase session on every request
├── .env.example
└── README.md
```

---

## 4. Environment Variables

Create `.env.local` (never commit) with keys the owner will provide after following `MANUAL_SETUP.md`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-only, used solely in the share-slug route handler if needed
NEXT_PUBLIC_SITE_URL=           # e.g. http://localhost:3000 or the Vercel prod URL, used for OAuth redirect + share links
```

Do not use the service role key in any client component or expose it via `NEXT_PUBLIC_*`. Google OAuth client ID/secret are configured inside the Supabase Auth dashboard, not as app env vars — the app never talks to Google directly.

---

## 5. Data Model (Supabase / Postgres)

Supabase's built-in `auth.users` table handles accounts (created automatically for both Google OAuth and email/password sign-ups). Only one app table is needed to start:

```sql
create table public.diagrams (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled diagram',
  code        text not null default '',
  theme       text not null default 'default',
  is_public   boolean not null default false,
  share_slug  text unique,               -- nullable; generated only when first shared
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index diagrams_user_id_idx on public.diagrams(user_id);
create unique index diagrams_share_slug_idx on public.diagrams(share_slug) where share_slug is not null;

-- Row Level Security
alter table public.diagrams enable row level security;

create policy "Users can CRUD their own diagrams"
  on public.diagrams for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Anyone can read a publicly shared diagram"
  on public.diagrams for select
  using (is_public = true);

-- keep updated_at fresh
create function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger diagrams_set_updated_at
  before update on public.diagrams
  for each row execute procedure public.set_updated_at();
```

Notes for the implementer:
- No `image_url` or `rendered_svg` column, ever — this is the storage boundary described in §1.
- `share_slug` should be a short, URL-safe random string (e.g. nanoid, 8–10 chars), generated in the `api/diagrams/share` route handler using the service role client so a uniqueness collision can be retried server-side rather than leaking that logic to the browser.
- Anonymous (logged-out) users can still use `/editor` fully — code lives only in memory + optionally `localStorage` as a draft. Saving to the cloud requires auth; prompt sign-in only at the "Save" action, not on page load.

---

## 6. Feature List & Acceptance Criteria

### 6.1 Editor + live preview
- Split-pane layout (resizable divider), code on one side, rendered diagram on the other.
- Debounce re-render ~300ms after typing stops; show a subtle loading state, never a flash of blank canvas.
- On invalid Mermaid syntax, keep showing the last valid render and surface a small non-blocking error panel with the parser's message — never a blank white pane or an uncaught exception.
- Zoom (scroll/pinch) and pan (drag) on the preview; a "fit to screen" and "100%" reset button.
- Mobile: stack the panes vertically with a toggle, since side-by-side doesn't work under ~768px.

### 6.2 Export
- Formats: SVG, PNG, JPG.
- Background toggle: "Transparent" vs "White" vs a custom color swatch (PNG/JPG can't truly be transparent as JPG, so JPG always forces a background color — disable "transparent" when JPG is selected and explain why in a tooltip).
- Export at the diagram's native resolution by default, plus a "2x/3x" scale option for crisper PNG/JPG rasterization.
- All exports happen client-side: serialize the rendered `<svg>`, and for raster formats draw it onto an off-screen `<canvas>` via an `Image` element, then trigger a download via a Blob URL. No network call.
- "Copy to clipboard" as PNG, where the Clipboard API is supported, as a bonus convenience action.

### 6.3 Auth
- Supabase Auth, two methods enabled: Google OAuth and email/password.
- Email/password flow includes: sign up, log in, forgot-password (Supabase magic link), and email verification handling (Supabase sends the email; app just needs a `/auth/callback` route and a "check your email" state).
- Session persisted via Supabase's SSR cookie helpers so server components can read the logged-in user without a client-side flash of "logged out."
- Logged-out users can fully use the editor (see §5); the only gated actions are "Save," "My diagrams," and "Share."

### 6.4 Dashboard ("My diagrams")
- Grid of cards: title, small static preview (rendered client-side on mount, not stored), last-updated date, quick actions (open, rename, duplicate, delete, share/unshare).
- Search/filter by title.
- Empty state with a couple of example templates ("Flowchart," "Sequence diagram," "Gantt chart") that create a new diagram pre-filled with sample code.

### 6.5 Sharing
- Toggling "Make public" generates (or reuses) a `share_slug` and shows a copyable URL like `https://<domain>/s/<slug>`.
- `/s/[slug]` is a read-only page: renders the diagram, shows the title, offers the same export menu, but no editor — plus a "Duplicate to my account" button for logged-in viewers who want to remix it.
- Turning sharing off should make the slug 404 for others, but the app can keep the slug value in the DB to reuse the same URL if re-enabled (only flip `is_public`, don't null out `share_slug` on toggle-off, unless the owner wants slugs to change on every re-share — flag this as a small product decision if unclear, default to "keep slug").

### 6.6 Diagram templates / examples
- A small curated set (6–10) covering flowchart, sequence, class, state, ER, Gantt, pie, and git-graph diagram types, available from a "New from template" picker.

### 6.7 Keyboard shortcuts
- Cmd/Ctrl+S → save (or prompt login if logged out).
- Cmd/Ctrl+Enter → force re-render immediately (bypass debounce).
- Cmd/Ctrl+/ → toggle a small syntax cheat-sheet panel.

---

## 7. Visual Design Direction (explicitly avoid the "vibecoded" look)

The owner has explicitly asked this not to look like a generic AI-scaffolded app. Concretely avoid: purple-to-blue gradients on every button, glassmorphism cards with heavy blur, Inter font at default weight everywhere, emoji as icons, and a hero section with a centered gradient headline + two pill buttons. Instead:

- **Typography:** pick one distinctive but legible sans for UI (e.g. a grotesk like *General Sans* or *Geist*) and a monospace for the code editor (e.g. *JetBrains Mono* or *IBM Plex Mono*) — load via `next/font` for zero layout shift.
- **Color:** a restrained palette — one ink/near-black, one paper/off-white, one accent color used sparingly (buttons, active states, the diagram-type icons), not gradients. Support light and dark mode from day one, driven by the same CSS variables Tailwind reads.
- **Layout:** editor-first, not marketing-first. The app should feel like a tool (think Linear, Excalidraw, Raycast) — tight spacing, real borders instead of only shadows, few but purposeful animations (e.g. the split-pane divider, panel open/close), and no decorative illustrations.
- **Iconography:** a single consistent icon set (e.g. `lucide-react`) at one stroke weight throughout — never mix icon styles.
- Consult `/mnt/skills/public/frontend-design/SKILL.md`-equivalent principles if the build agent has access to a frontend-design skill/guide — follow its constraints on avoiding templated defaults.

---

## 8. Build Phases (suggested order for Antigravity)

Each phase should end in a working, deployable state — don't leave the app broken between phases.

**Phase 0 — Scaffold**
- `pnpm create next-app` (TypeScript, App Router, Tailwind).
- Install shadcn/ui, lucide-react, zustand, @tanstack/react-query, @supabase/supabase-js, @supabase/ssr, mermaid, codemirror deps (`@codemirror/lang-*`, `@uiw/react-codemirror` or hand-rolled setup), nanoid.
- Set up `.env.example`, ESLint, Prettier, base `globals.css` with the design tokens from §7.
- Push to GitHub, connect the repo to Vercel for preview deployments (owner does the Vercel-side click-through per `MANUAL_SETUP.md`, but the repo should be Vercel-ready — a valid `next.config.js`, no server-only imports leaking into client bundles).

**Phase 1 — Supabase wiring**
- Implement `lib/supabase/client.ts`, `server.ts`, and the session-refresh `middleware.ts` per Supabase's official Next.js App Router SSR pattern.
- Run the `0001_init.sql` migration against the owner's Supabase project (owner provides project ref/connection per `MANUAL_SETUP.md`; migration can also just be pasted into the Supabase SQL editor as a manual step if the CLI isn't linked).

**Phase 2 — Auth**
- `/login`, `/signup`, `/forgot-password` pages with the email/password form and a "Continue with Google" button.
- `/auth/callback/route.ts` to complete the OAuth code exchange.
- `AuthGuard` component / server-side check for protected routes (`/dashboard`, saving from `/editor`).

**Phase 3 — Core editor + live preview**
- `CodeEditor` (CodeMirror) + `PreviewPane` (dynamic-imported `mermaid`, debounced render, error panel, pan/zoom).
- Local-only mode fully functional with no backend calls yet.

**Phase 4 — Export pipeline**
- `lib/mermaid/export.ts`: SVG serialization, canvas rasterization to PNG/JPG, background/transparency handling, scale option, download trigger.
- `ExportMenu` UI wired to it.

**Phase 5 — Persistence**
- Save/update/delete diagrams via the Supabase client from `/editor/[diagramId]`.
- `/dashboard` grid backed by React Query against Supabase.

**Phase 6 — Sharing**
- `api/diagrams/share/route.ts` slug generation.
- `/s/[slug]` public read-only viewer.

**Phase 7 — Templates + polish**
- Seed template library, empty states, keyboard shortcuts, cheat-sheet panel.
- Full design pass per §7, dark mode, responsive/mobile pass.

**Phase 8 — Hardening**
- Error boundaries around the mermaid render (a malformed diagram must never crash the whole page).
- Basic rate-limit/size-limit on diagram `code` length (e.g. reject/save-warn above ~100KB) via a zod validator before any Supabase write.
- Accessibility pass: focus states, keyboard navigation through the editor UI (not the code editor internals), color contrast.

**Phase 9 — Ship**
- Final `README.md` with setup instructions mirroring `MANUAL_SETUP.md`, a `LICENSE` file (owner should pick one — MIT is the common default for this kind of open tool, flag it rather than assuming), and confirm the Vercel production deployment builds cleanly with the real env vars.

---

## 9. Open Product Decisions (flag to owner, don't silently assume)

- License choice for the open-source repo (MIT/Apache-2.0/AGPL — matters more than usual since a hosted competitor could otherwise fork it freely; AGPL is worth at least presenting as an option).
- Whether anonymous users' in-browser drafts should persist across sessions via `localStorage`, or reset on refresh.
- Whether re-sharing after unsharing should reuse the old slug or mint a new one (default assumed: reuse).
- Any diagram size / diagram-count limits per free account, if the owner ever wants to add paid tiers later (not required for v1, but table schema above should not block adding a `plan` concept to `auth.users`-linked profile table later).
