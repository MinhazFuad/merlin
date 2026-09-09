# Merlin 🧙‍♂️

An open-source, self-hostable web app for writing, previewing, and exporting [Mermaid](https://mermaid.js.org/) diagrams. Think a faster, distraction-free Mermaid Live Editor with accounts, saved diagrams, and shareable links.

---

## Key Features

- **Live Preview with Debounce**: Renders diagram changes with a 300ms debounce. On syntax errors, the last valid render stays visible alongside a non-blocking error panel.
- **Client-Side Export**: Export to SVG, PNG, and JPG at 1×, 2×, or 3× resolution, with background color controls and a one-click "Copy to clipboard" option.
- **Zero Rendered Images on Server**: Supabase Postgres only stores diagram source code and metadata (titles, code, theme, timestamps). All rendering and rasterization occurs client-side in the user's browser.
- **Save & Dashboard**: Authenticated users can save, rename, duplicate, delete, and search their diagrams.
- **Public Sharing**: Toggle public sharing on any diagram to generate a short, unique URL (`/s/[slug]`). Viewers get a clean, read-only preview with export options and a "Duplicate to my account" button.
- **Keyboard Shortcuts**:
  - `⌘/Ctrl + S`: Save diagram (prompts sign in if logged out)
  - `⌘/Ctrl + Enter`: Force immediate re-render (bypasses debounce)
  - `⌘/Ctrl + /`: Toggle keyboard shortcuts cheat-sheet
- **Curated Templates**: Quick-start templates covering Flowchart, Sequence, Class, State, ER, Gantt, Pie, and Git-graph diagrams.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a restrained ink/paper design system
- **Editor**: [CodeMirror 6](https://codemirror.net/)
- **Diagram Rendering**: [Mermaid.js](https://mermaid.js.org/) (dynamically imported client-side only)
- **Authentication & Database**: [Supabase](https://supabase.com/) (`@supabase/ssr`) with Row Level Security (RLS)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) for editor state & [TanStack React Query](https://tanstack.com/query) for dashboard caching

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/MinhazFuad/merlin.git
cd merlin
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note**: The core editor works locally without Supabase configured. Supabase credentials are required for account creation, saving diagrams, and generating share links.

### 3. Database Migration

Run `supabase/migrations/0001_init.sql` in your Supabase SQL Editor. This sets up the `diagrams` table with Row Level Security (RLS) policies and automatic `updated_at` triggers.

For full setup instructions (Google OAuth, Vercel deployment), see [MANUAL_SETUP.md](./MANUAL_SETUP.md).

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open Merlin.

---

## Production Build

```bash
npm run build
npm run start
```
