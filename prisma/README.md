# Prisma — Worklit

This project uses Prisma against a Supabase Postgres instance.

## Connection strings

Two URLs are required, both gitignored in `.env.local`:

- **`DATABASE_URL`** — pooled connection (PgBouncer, port **6543**, with `?pgbouncer=true`).
  Used by Prisma Client at runtime in serverless / edge-friendly contexts.
- **`DIRECT_URL`** — direct connection (port **5432**).
  Used by `prisma migrate` and `prisma db push`. Migrations require a session-mode
  connection and cannot run through PgBouncer.

### Where to find them

Supabase Dashboard → **Project Settings → Database → Connection string**.

- Pick the **Connection pooler** string (Transaction mode) for `DATABASE_URL`,
  and append `?pgbouncer=true`.
- Pick the **Direct connection** string for `DIRECT_URL`.

The password is the database password set when the project was created (or rotated
via Settings → Database → Reset database password).

## First migration

After reviewing `schema.prisma`, run:

```bash
npm run db:migrate -- --name init
```

This creates the SQL migration in `prisma/migrations/` **and** applies it through
`DIRECT_URL`. Re-run `npm run db:migrate` after every schema change.

For local prototyping without committing a migration, `npm run db:push` syncs the
schema directly. Don't use it in shared environments.

## Other scripts

- `npm run db:generate` — regenerate the Prisma Client (runs automatically via
  `postinstall` so Vercel deploys pick up the latest types).
- `npm run db:studio` — open Prisma Studio (browser GUI, hits `DATABASE_URL`).

## ⚠️ Authorization note — no RLS

We are **not using Supabase Row-Level Security**. Every query goes through Prisma
using the database role's full privileges, which means the database will not stop
one user from reading another user's rows.

**Authorization is the application's job.** Every query that touches a
user-scoped table (`projects`, `scope_items`, `changelog`, `client_tokens`) MUST
be filtered by the authenticated `userId` — either directly or transitively
through `Project.userId`. Treat any query without that filter as a bug.

The `auth.users` table is managed by Supabase Auth and is intentionally **not**
referenced by a Prisma relation; we only store its `uuid` as `Project.userId`.
