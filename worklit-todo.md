# ✅ Worklit — Development To-Do List

> **Stack:** Next.js 16.2 · Supabase (Postgres + Auth) · Resend · Vercel · Tailwind CSS · shadcn/ui · @react-pdf/renderer
> **Team:** 2 people · ~30–60 min/day · ~10–13 weeks realistically

---

## 🔵 Phase 0 — Alignment (Week 1)
*Get on the same page before touching code. Do this together.*

- [ ] Agree on final tech stack — **~1hr**
- [ ] Set up shared GitHub repo, agree on branching strategy (main + feature branches) — **~30 min**
- [ ] Set up Supabase project, get connection strings — **~30 min**
- [ ] Set up Vercel deployment connected to GitHub repo — **~30 min**
- [ ] Set up Resend account, verify a sending domain — **~30 min**
- [ ] Agree on loose ownership split (e.g. one leads DB/API, other leads UI) — **~15 min**

---

## 🟢 Phase 1 — Foundation (Weeks 2–3)
*Get the skeleton running. Nothing fancy.*

### Project setup
- [ ] Init Next.js 16 project with App Router and Tailwind — **~30 min**
- [ ] Install and configure shadcn/ui — **~30 min**
- [ ] Set up Supabase client in Next.js — **~30 min**
- [ ] Set up environment variables (`.env.local`) — **~15 min**

### Auth
- [ ] Implement Supabase Auth (email + password, freelancer only) — **~1–2 hrs**
- [ ] Build signup page — **~45 min**
- [ ] Build login page — **~45 min**
- [ ] Build auth middleware (protect routes) — **~30 min**
- [ ] Basic profile page (name, business name) — **~45 min**

---

## 🟡 Phase 2 — Projects & Scope Items (Weeks 4–6)
*The core of the app. This is where you'll spend the most time.*

### Database
- [ ] Design and create Supabase tables: `projects`, `scope_items`, `changelog`, `client_tokens` — **~1 hr**
- [ ] Set up Row Level Security (RLS) policies so freelancers only see their own data — **~1 hr**

### Projects
- [ ] Dashboard page — list all projects with status badges — **~1.5 hrs**
- [ ] Create project form (client name, email, title) — **~1 hr**
- [ ] Project detail page (shows scope items) — **~1.5 hrs**
- [ ] Edit / archive / delete project — **~1 hr**
- [ ] Auto-update project status to Active when all items approved — **~45 min**

### Scope Items
- [ ] Add scope item form (title, description, price) — **~1 hr**
- [ ] Edit / delete scope items (only if pending or deferred) — **~45 min**
- [ ] Per-item status badges (Pending / Approved / Deferred / Rejected) — **~30 min**
- [ ] Lock approved items from editing — **~30 min**
- [ ] Subtotal calculated from approved items — **~30 min**
- [ ] Changelog: write a row on every status change — **~45 min**
- [ ] Changelog view per project — **~45 min**

---

## 🟠 Phase 3 — Client Flow (Weeks 7–8)
*The magic link experience. This is what makes the app unique.*

- [ ] Generate UUID token and store in `client_tokens` table — **~30 min**
- [ ] Build "Send to client" button — generates token, sends email via Resend — **~1.5 hrs**
- [ ] Build client review page `/review/[token]` (no auth, public) — **~2 hrs**
- [ ] Approve / Defer / Reject per item on client page — **~1.5 hrs**
- [ ] Client name sign-off on submit — **~30 min**
- [ ] Token expiry logic (7 days), re-sendable by freelancer — **~45 min**
- [ ] Email notification to freelancer when client responds — **~1 hr**
- [ ] New scope items added mid-project trigger new email to client — **~45 min**
- [ ] Make client review page mobile-responsive (critical — clients open this on phone) — **~1.5 hrs**

---

## 🔴 Phase 4 — Invoice & Polish (Weeks 9–10)
*Make it feel real.*

- [ ] Install `@react-pdf/renderer` — **~15 min**
- [ ] Build invoice PDF (freelancer name, client, itemized list, subtotal, date) — **~2 hrs**
- [ ] "Generate invoice" button on project page, triggers PDF download — **~45 min**
- [ ] Basic empty states (no projects, no scope items, all approved) — **~1 hr**
- [ ] Basic error handling throughout — **~1 hr**
- [ ] Deploy to Vercel on custom domain (worklit.app) — **~45 min**
- [ ] End-to-end test: create project → add items → send to client → approve → generate invoice — **~1 hr**

---

## 📊 Summary

| Phase | What | Timeline |
|---|---|---|
| 0 | Alignment & setup | Week 1 |
| 1 | Foundation & auth | Weeks 2–3 |
| 2 | Projects & scope items | Weeks 4–6 |
| 3 | Client flow & magic link | Weeks 7–8 |
| 4 | Invoice & polish | Weeks 9–10 |

**Realistic total: 12–13 weeks** accounting for life, minishell, and interruptions.

---

## ⚠️ Next.js 16 gotchas to know before starting

- `params` and `searchParams` in page components are now **async** — always `await` them
- Turbopack is the default bundler — no config needed, just faster
- React Compiler is stable — no need for manual `useMemo` / `useCallback`
- Caching is now **fully opt-in** — simpler than previous versions
- `middleware.ts` replaced by `proxy.ts` for network boundary logic

---

## 🎯 Key milestone

> The real validation moment is the **end of Phase 3** — the moment you can send a magic link to a real freelancer friend and watch them approve scope items on their phone. Everything after that is polish. If it feels right at that point, keep going. If not, you've lost nothing.
