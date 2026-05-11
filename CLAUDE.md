@AGENTS.md

# Worklit

Scope-approval SaaS for freelancers. Define deliverables, send magic links to clients, get per-item sign-off, generate invoices.

## Stack

- **Next.js 16.2** (App Router, Turbopack, React 19)
- **Supabase** — Auth (email/password) + Postgres
- **Prisma 7** — ORM with `@prisma/adapter-pg` for direct Postgres connection
- **Tailwind CSS v4** — utility classes, `@theme inline` for design tokens
- **shadcn/ui** — Button, Input, Card, Dialog, Badge, Select, Textarea, Label (Base UI primitives)
- **lucide-react** — icons (not heavily used; custom SVGs preferred)

## Project structure

```
app/
  layout.tsx              — Root layout, Instrument Serif + DM Sans fonts
  page.tsx                — Landing page (marketing)
  globals.css              — Design tokens, keyframes, Tailwind/shadcn setup
  (auth)/                  — Public auth routes
    layout.tsx             — Centered card layout for login/signup
    login/page.tsx         — Login form (useActionState)
    signup/page.tsx        — Signup form (useActionState)
  (app)/                   — Protected app routes (require auth)
    layout.tsx             — Server component, calls requireAuth()
    layout-client.tsx       — Client wrapper: grid layout, collapse state, breadcrumbs
    dashboard/
      page.tsx             — Dashboard home (greeting, attention strip, projects, activity, revenue)
      loading.tsx          — Skeleton loading state
      error.tsx            — Error boundary with retry
      projects/
        page.tsx           — Projects list with status filter tabs
        new/page.tsx       — Create project form
        [id]/page.tsx      — Project detail (scope items list)
        [id]/add-item-form.tsx — Expandable inline form for adding scope items
        [id]/edit-project.tsx  — Three-dot menu → inline edit or delete
      scopes/page.tsx      — Approval inbox (pending items + recently approved)
      invoices/page.tsx    — Invoice list with summary cards
      clients/page.tsx     — Client list (aggregated from projects)
      reports/page.tsx     — Revenue stats, project breakdown, monthly trend
      settings/page.tsx    — Profile + invoice defaults (two-column grid)
  actions/
    auth.ts                — signup, login (useActionState), logout
    projects.ts            — createProject, updateProject, deleteProject
    scope-items.ts         — addScopeItem
    waitlist.ts            — submitWaitlistSignup (landing page)

components/
  landing/                 — Marketing page components (Nav, Hero, Mockup, Features, etc.)
  dashboard/
    sidebar.tsx            — Collapsible sidebar with nav, brand, user section, mobile drawer
    icons.tsx              — SVG icon components (HomeIcon, FolderIcon, PlusIcon, etc.)
  ui/                      — shadcn UI components (Button, Input, Card, Dialog, Badge, etc.)

lib/
  prisma.ts                — PrismaClient singleton with PrismaPg adapter (uses DIRECT_URL)
  supabase/
    server.ts              — createServerClient (cookies-based)
    client.ts              — createBrowserClient
    session.ts             — requireAuth() helper, redirects to /login
  utils.ts                 — cn() classname merger

prisma/
  schema.prisma            — Project, ScopeItem, ChangelogEntry, ClientToken, WaitlistSignup
  migrations/              — SQL migrations
```

## Design system

Read `DESIGN.md` for the full spec. Quick reference:

- **Creative North Star**: "The Architect's Desk" — warm wood, clean blueprints, confident marks
- **Fonts**: Instrument Serif (headings, `--font-serif`), DM Sans (body, `--font-sans`)
- **Colors** (all OKLCH):
  - Background: `--bg: oklch(95% 0.008 100)` (warm stone)
  - Cards: `--bg-card: oklch(100% 0 0)` (white)
  - Green: `--green: oklch(50% 0.13 152)` (approval, primary actions, ≤10% surface)
  - Text: `--text: oklch(20% 0.012 60)` (warm charcoal)
  - Borders: `--border: oklch(90% 0.006 90)`
- **The Architect's Stamp Rule**: Green appears on ≤10% of any screen. Only for approval/action.
- **The No-Red Rule**: Rejected is neutral gray, never red.
- **The One Serif Rule**: Instrument Serif only in headings. Never in body, buttons, labels.
- **The Flat-By-Default Rule**: Cards use borders at rest, shadows only on hover.
- `rounded-[var(--radius)]` = 10px, `rounded-[var(--radius-lg)]` = 16px
- Card padding: 22px. Section gap: 18px.
- Eyebrow labels: `text-[11px] font-semibold tracking-[0.12em] uppercase text-green`
- Page titles: `font-heading text-[32px] tracking-[-0.02em] leading-none`
- Button: `bg-green text-white`, `rounded-[var(--radius)]`, `active:scale-[0.97]`, disabled uses explicit colors (never opacity alone)
- Input: 1.5px border-border-mid, focus → border-green + green ring

## Patterns to follow

- **Server components by default**, client only when needed (state, effects, event handlers)
- **Server actions** with `useActionState` for forms (see auth.ts, projects.ts pattern)
- **requireAuth()** in every protected page/layout
- **Prisma queries** filter by `userId` (no RLS — auth is app-level)
- **Tailwind arbitrary values** for one-off sizes: `text-[14px]`, `py-[11px]`, etc.
- **CSS variables** for all colors: `bg-bg-card`, `text-text-mid`, `border-border`
- **`cn()` from `@/lib/utils`** for conditional classes
- **`fmtMoney(n)`** — inline helper: `"$" + n.toLocaleString()`
- **`relativeTime(date)`** — inline helper: "2h ago", "3d ago"
- **Empty states**: centered card with icon, serif heading, description, green CTA

## Banned patterns

- No `transition: all` — specify exact properties
- No `scale(0)` in animations — start from `scale(0.3)` minimum
- No opacity-only disabled states — always change background explicitly
- No red for rejected states — use neutral gray
- No Inter, Roboto, system fonts — Instrument Serif + DM Sans only
- No `#000` or `#fff` — tint every neutral
- No nested cards, no side-stripe borders, no gradient text, no glassmorphism
- No `<Sidebar>` without thinking — sidebar is sticky, collapsible, 240px/60px, with mobile drawer

## Env vars

- `DIRECT_URL` — Postgres direct connection (port 5432, used by PrismaPg adapter)
- `DATABASE_URL` — Postgres pooled connection (port 6543, PgBouncer, not used by adapter)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key (newer Supabase projects use this name)

## Impeccable skill

This project uses `/impeccable` for design work. PRODUCT.md and DESIGN.md are at the project root. Always run `/impeccable` commands for design changes rather than ad-hoc styling.
