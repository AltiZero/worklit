# Worklit Design System
*A reference for AI models generating UI, copy, or code for the Worklit product.*

---

## Brand Essence

Worklit is a scope-approval tool for freelancers. The design communicates **calm authority** — the feeling of a well-drafted contract, not a flashy SaaS dashboard. Every decision should feel considered, unhurried, and trustworthy. The visual language is editorial and refined, with a single confident accent colour that means one thing: approval.

**Tone words:** Confident. Clear. Professional without being cold. Minimal without being sparse.

**Avoid:** Electric/neon accents. Aggressive gradients. Rounded-corner accent borders. Heavy iconography. Emoji (outside of success states). Dense feature grids. Startup purple.

---

## Colour System

All colours are defined in `oklch()`. The palette has two axes: a **warm stone neutral** base (all sharing hue ~70), and a **sage green** accent (hue ~148). Nothing else. There are no secondary accent colours.

### CSS Variables

```css
/* Backgrounds — warm stone, never pure white */
--bg:          oklch(98%  0.006 70);   /* page background */
--bg-alt:      oklch(96%  0.008 70);   /* section tint, input backgrounds */
--bg-card:     oklch(100% 0.000 70);   /* cards, modals, mockup surfaces */
--bg-dark:     oklch(22%  0.018 148);  /* dark sections — deep forest, ties to green */

/* Text — warm charcoal, never pure black */
--text:        oklch(22%  0.014 60);   /* primary text */
--text-mid:    oklch(46%  0.010 65);   /* secondary text, nav links */
--text-soft:   oklch(64%  0.007 65);   /* captions, metadata, placeholders */
--text-inv:    oklch(96%  0.006 70);   /* text on dark backgrounds */
--text-inv-mid:oklch(72%  0.010 148);  /* secondary text on dark backgrounds */

/* Green — sage, confident, not electric */
--green:       oklch(48%  0.120 148);  /* primary action, approved state */
--green-hover: oklch(42%  0.120 148);  /* hover state for green elements */
--green-light: oklch(95%  0.030 148);  /* approved tint backgrounds */
--green-mid:   oklch(88%  0.060 148);  /* borders on green tint areas */
--green-dark:  oklch(36%  0.110 148);  /* text on green-tint backgrounds */

/* Borders — single consistent system */
--border:      oklch(90%  0.008 70);   /* default border */
--border-mid:  oklch(84%  0.008 70);   /* emphasis border, input default */
--border-dark: oklch(32%  0.016 148);  /* borders on dark/forest sections */

/* Shadows — warm-tinted, layered */
--shadow-sm:  0 1px 4px oklch(22% 0.014 60 / 0.06);
--shadow-md:  0 4px 20px oklch(22% 0.014 60 / 0.08), 0 1px 4px oklch(22% 0.014 60 / 0.04);
--shadow-lg:  0 20px 60px oklch(22% 0.014 60 / 0.12), 0 4px 12px oklch(22% 0.014 60 / 0.06);
```

### Colour Usage Rules

- **Green = approval/action.** Use `--green` for: primary buttons, approved state borders, active states, progress indicators, the logo mark.
- **Green tint = positive context.** Use `--green-light` / `--green-mid` backgrounds for: approved line items, success confirmations, "after" comparison cards.
- **Neutral rejection.** Rejected/declined states use neutral grey (`--bg-alt`, `--border-mid`) at reduced opacity — never red or orange. This keeps green as the only meaningful signal.
- **Dark sections** use `--bg-dark` (deep forest, hue 148). This is not pure charcoal — it has a subtle green cast that unifies the palette. Use for: "How it works" panels, the footer.
- **Never invent new hues.** Stay within hue 60–70 (warm stone) and hue 148 (sage green). No blues, purples, oranges, or reds.

---

## Typography

### Fonts

| Role | Family | Weights used |
|------|--------|-------------|
| Display / Headlines | `DM Serif Display` | 400 (regular), 400 italic |
| Body / UI | `DM Sans` | 300, 400, 500, 600 |

```css
--font-serif: 'DM Serif Display', Georgia, serif;
--font-sans:  'DM Sans', system-ui, sans-serif;
```

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
```

### Type Scale

| Usage | Font | Size | Weight | Line-height | Letter-spacing |
|-------|------|------|--------|-------------|----------------|
| Hero H1 | Serif | `clamp(42px, 4.5vw, 66px)` | 400 | 1.08 | -0.02em |
| Section H2 | Serif | `clamp(32px, 3vw, 48px)` | 400 | 1.12 | -0.02em |
| Card title | Serif | 20–22px | 400 | 1.2 | -0.01em |
| UI heading | Sans | 18px | 600 | 1.3 | -0.01em |
| Body / sub | Sans | 16–18px | 400 | 1.6 | 0 |
| UI label | Sans | 14–15px | 400–500 | 1.4 | 0 |
| Caption / meta | Sans | 12–13px | 400 | 1.5 | 0 |
| Section eyebrow | Sans | 11px | 600 | 1 | 0.10–0.12em (uppercase) |

**Rules:**
- Headlines use `DM Serif Display`. Italic `<em>` in headlines is used to highlight the key emotional phrase, coloured `var(--green)`.
- Never use `Inter`, `Roboto`, or system-default sans-serif for UI text.
- Section eyebrows (e.g. "How it works", "The problem") are always `11px / 600 / uppercase / 0.10–0.12em tracking` in `var(--green)` or `var(--text-inv-mid)` on dark backgrounds.
- Minimum body text: 13px. Never smaller in any visible UI.
- Use `text-wrap: pretty` on paragraph elements.

---

## Spacing & Layout

### Radius
```css
--radius:    10px;   /* buttons, inputs, line items, small cards */
--radius-lg: 16px;   /* large cards, modals, section panels */
```
Pill shapes (badges, progress dots) use `border-radius: 100px`.

### Page Layout
- Max content width: **1280px**, centred.
- Desktop page padding: **80px** horizontal.
- Mobile page padding: **24px** horizontal.
- Section vertical padding: **96px** desktop, **64px** mobile.

### Grid System
- Hero: `grid-template-columns: 1fr 1fr`, `gap: 64px`
- Feature cards: `repeat(3, 1fr)`, `gap: 16px`
- Problem before/after: `1fr 1fr`, `gap: 24px`
- Steps (dark section): `repeat(3, 1fr)`, separated by `1px` gap on `--border-dark` background

### Spacing Scale (informal)
Use multiples of 4px. Common values: 4, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96.

---

## Component Patterns

### Buttons

**Primary (green, filled)**
```css
background: var(--green); color: #fff;
padding: 13px 26px; border-radius: var(--radius);
font: 500 15px var(--font-sans);
box-shadow: 0 1px 3px oklch(22% 0.014 60 / 0.12);
transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
```
Hover: `--green-hover`, `translateY(-1px)`, stronger shadow.

**Secondary (outlined)**
```css
background: transparent; color: var(--text-mid);
padding: 13px 22px; border-radius: var(--radius);
border: 1.5px solid var(--border-mid);
font: 400 15px var(--font-sans);
```
Hover: border to `--text-soft`, text to `--text`.

**Nav CTA (dark filled)**
```css
background: var(--text); color: var(--bg);
padding: 8px 20px; border-radius: 8px;
font: 500 14px var(--font-sans);
```
Hover: background to `--green`.

**Disabled state:** background `--border-mid`, text `--text-soft`, `cursor: default`. Never use opacity alone — change colour explicitly.

### Inputs

```css
padding: 13px 16px; border-radius: var(--radius);
border: 1.5px solid var(--border-mid);
font: 15px/1.4 var(--font-sans); color: var(--text);
background: var(--bg-card);
transition: border-color 0.18s, box-shadow 0.18s;
```
Focus: `border-color: var(--green)`, `box-shadow: 0 0 0 3px oklch(48% 0.120 148 / 0.10)`.

### Cards

Standard card:
```css
background: var(--bg-card);
border: 1px solid var(--border);
border-radius: var(--radius-lg);
padding: 28px;
transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
```
Hover: `border-color: var(--green-mid)`, `box-shadow: var(--shadow-md)`, `translateY(-2px)`.

Dark-background card (step cards):
```css
background: var(--bg-dark);
/* no border — gap between cards is the border-dark background showing through */
transition: background 0.2s;
```
Hover: `oklch(26% 0.020 148)`.

### Badges / Tags

**Eyebrow badge (status pill):**
```css
background: var(--green-light); color: var(--green-dark);
font: 600 12px var(--font-sans); letter-spacing: 0.08em; text-transform: uppercase;
padding: 5px 12px; border-radius: 100px;
```

**Approved state badge:**
```css
background: var(--green-light); color: var(--green-dark);
border: 1px solid var(--green-mid);
font: 500 11px var(--font-sans);
padding: 3px 8px; border-radius: 100px;
```

**Rejected/neutral state badge:**
```css
background: var(--bg-alt); color: var(--text-soft);
border: 1px solid var(--border-mid);
```
No red. Rejected is neutral, not punitive.

### Navigation

Fixed bar, height 64px:
```css
background: oklch(98% 0.006 70 / 0.90);
backdrop-filter: blur(16px) saturate(140%);
border-bottom: 1px solid var(--border);
```
Nav links: 14px / 400 / `--text-mid`. Hover: `--text`. CTA uses nav-CTA pattern above.

Mobile: hamburger appears at ≤960px. Drawer slides down from top with `translateY(-8px) → 0` + opacity transition (0.22s ease). Drawer background: `--bg`, same border system.

### Line Items (scope rows)

Default:
```css
border: 1.5px solid var(--border);
border-radius: var(--radius);
background: var(--bg-card);
padding: 14px 16px;
```

Approved:
```css
border-color: var(--green-mid);
background: var(--green-light);
```

Rejected:
```css
border-color: var(--border-mid);
background: var(--bg-alt);
opacity: 0.55;
```

---

## Motion & Animation

### Principles
- **One orchestrated entrance** (page load stagger) is better than scattered micro-interactions.
- Transitions feel spring-y, not linear. Use `cubic-bezier(0.22, 1, 0.36, 1)` for slide/enter motions.
- Durations: 150–180ms for micro (hover); 220–320ms for state changes; 500–600ms for entrance animations.
- `transform` and `opacity` only — never animate `width`, `height`, or `margin`.

### Standard transitions
```css
/* Hover colour change */
transition: background 0.18s, color 0.18s, border-color 0.18s;

/* Hover lift */
transition: transform 0.12s, box-shadow 0.18s;

/* Slide-in (multi-step form, drawers) */
transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease;

/* Nav drawer */
transition: transform 0.22s ease, opacity 0.22s ease;
```

### Page-load entrance
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```
Stagger with delays: 0.1s, 0.2s, 0.3s, 0.4s, 0.5s.

### Scroll reveal
Elements with class `.reveal` start at `opacity: 0; transform: translateY(24px)` and transition to visible state when entering viewport (IntersectionObserver, threshold 0.12).

### Animated states
- **Pulsing dot** (live badge): `opacity 1 → 0.4 → 1`, 2s infinite.
- **Multi-step form transition**: exit slides left (-48px) and fades out, then new step enters from right (+48px). Reverse direction for back navigation. No transition on the "snap-to-start" frame (set `transition: none` momentarily).

---

## Dark Section Treatment

Used for "How it works" panel and footer. Background is **deep forest** (`--bg-dark`: `oklch(22% 0.018 148)`), not charcoal — the subtle green cast ties it to the brand.

Text hierarchy on dark:
- Headings: `--text-inv` (`oklch(96% 0.006 70)`)
- Eyebrow labels: `--text-inv-mid` (`oklch(72% 0.010 148)`)
- Body/description: `oklch(65% 0.012 120)` — muted, slightly warm
- Step numbers: `oklch(34% 0.025 148)` — very muted, decorative

Step icon containers: `oklch(30% 0.030 148)` background, `--text-inv-mid` icon colour.
Grid separator: 1px gaps showing `--border-dark` background.

---

## Logo Mark

A 26×26px rounded square (radius 7px), `--green` background, containing a white checkmark SVG:
```svg
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2 7.5L5.5 11L12 3.5" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

The checkmark is the entire brand metaphor: approval, sign-off, done.

---

## Copywriting Voice

- **Direct, not clever.** State the benefit plainly. "Get written approval on every item" not "Streamline your client communication workflow."
- **Freelancer POV.** The user is an individual, not a team. "You," not "your team."
- **Acknowledge the pain first.** Lead with the problem (scope creep, unpaid work, disputes), then the solution.
- **Short sentences.** Paragraphs max 2–3 sentences. Sub-headlines under 10 words where possible.
- **No exclamation marks** in body copy. One maximum in success states.
- **Numbers ground claims.** "Trusted by 200+ freelancers" not "trusted by thousands."
- **CTA copy:** Action-verb + outcome. "Start for free", "Get early access", "Sign & Submit". Not "Learn more", "Click here", "Submit".

---

## What NOT to do

| ❌ Don't | ✅ Do instead |
|----------|--------------|
| Add red/orange for rejected states | Use neutral grey at 55% opacity |
| Use pure black (`#000`) text | Use `--text` (`oklch(22% 0.014 60)`) |
| Use pure white (`#fff`) backgrounds | Use `--bg-card` (`oklch(100% 0.000 70)`) |
| Invent a third accent colour | Stay within stone + sage green |
| Use `Inter` or `Roboto` | Use `DM Sans` |
| Add a gradient to section backgrounds | Use flat `--bg` / `--bg-alt` / `--bg-dark` |
| Round corners with a left-border accent | Use full-border card pattern |
| Pad designs with icons for every feature | Use icons sparingly; placeholder boxes over bad SVG art |
| Use `margin` for spacing between siblings | Use `flex`/`grid` with `gap` |
| Animate `height` or `width` | Animate `transform` and `opacity` only |
