@AGENTS.md

# Worklit

## What this is

Lightweight scope-and-approval tool for solo freelancers. Turns messy email threads about "what was agreed" into a documented paper trail — without making clients sign up for anything.

## The problem we're solving

Freelancers lose money to scope creep. Work quietly expands beyond what was agreed, clients push back on invoices, and there's no clean record of what was actually approved. Existing tools (HoneyBook, Dubsado, Bonsai) are too broad, too expensive, or stop being useful the moment the contract is signed.

The gap isn't a better all-in-one platform. It's a focused tool that nails the **scope → approval → invoice** loop and does nothing else.

## Who it's for

Solo freelancers — designers, devs, copywriters, marketers, video editors, consultants. Project-based work, 3–10 active clients, billing €500–€10,000 per project. They currently juggle email + Notion + spreadsheets + PayPal and lose track of what was agreed.

Secondary (Phase 2): micro-agencies of 2–5 people.

## Core flow

**Freelancer:** creates project → adds scope items with prices → sends magic link to client → gets notified of responses → generates PDF invoice from approved items in one click.

**Client:** receives email → clicks link → approves/defers/rejects each item individually → signs off with name. No account, no signup, nothing to install.

## Design principles

- **Setup-to-first-scope-sent under 10 minutes.** If onboarding feels like Dubsado, we've failed.
- **The client never logs in.** Magic link is the entire client experience. Mobile-responsive is non-negotiable — clients open these on their phones.
- **Audit trail is the product.** Every status change is logged. "I never agreed to that" must always have an answer.
- **Approved items are locked.** Once a client approves something, the freelancer can't quietly edit it.
- **Do one thing well.** Not a CRM, not a scheduler, not a project manager. Scope → approval → invoice. That's it.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React Compiler)
- **DB:** Supabase Postgres
- **ORM:** Prisma 7 (config in `prisma.config.ts`, NOT in schema)
- **Auth:** Supabase Auth (email/password + Google + GitHub OAuth) — freelancer-side only
- **Email:** Resend
- **PDF:** @react-pdf/renderer
- **UI:** Tailwind + shadcn/ui
- **Validation:** Zod
- **Hosting:** Vercel

## Architecture decisions

- **No Supabase RLS.** Authorization is enforced in app code — every Prisma query MUST filter by `userId` from the authenticated session. Service role key never used in user-facing code.
- **Server Actions** preferred over API Routes for mutations.
- **Public client pages** (`/review/[token]`) are unauthenticated — access controlled by UUID token + expiry check.
- **No client accounts ever.** Clients only interact via magic links.
- Snake_case in DB, camelCase in code (handled via Prisma `@@map`).

## Data model

- `Project` — owned by `userId` (Supabase auth user); has many scope items
- `ScopeItem` — belongs to project; status: PENDING/APPROVED/DEFERRED/REJECTED; price as `Decimal(10,2)`
- `ChangelogEntry` — audit trail; tracks who (FREELANCER/CLIENT) changed what and when
- `ClientToken` — UUID + expiry, grants public access to `/review/[token]`

Approved items lock from editing. New items mid-project default to PENDING and trigger a fresh email to the client.

## Next.js 16 gotchas

- `params` and `searchParams` in pages are async — always `await` them
- `middleware.ts` is now `proxy.ts`
- Caching is fully opt-in
- React Compiler stable — skip manual `useMemo`/`useCallback`

## Prisma 7 gotchas

- Connection URLs live in `prisma.config.ts`, NOT `schema.prisma`
- `directUrl` removed — single `url` in config
- `DATABASE_URL` (pooler, port 6543) → Prisma Client at runtime
- `DIRECT_URL` (direct/session pooler, port 5432) → `prisma.config.ts` for migrations

## Conventions

- Branches: `feat/...`, `fix/...`, `chore/...`. Never push directly to `main`.
- Currency always `Decimal(10,2)`, never `Float`.
- Server-side: `lib/supabase/server.ts` (cookie-aware) + `lib/prisma.ts` (singleton).
- Every protected query/action calls `requireAuth()` first.
- Emails validated with Zod before any auth call.

## Out of scope (do not suggest, even if asked indirectly)

CRM, scheduling, time tracking, contract builder, in-app payments, client login, native mobile app, white-labeling, team accounts. All of these are Phase 2 or never. The MVP is the scope-approval-invoice loop and nothing else.