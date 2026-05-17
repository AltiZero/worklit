# Design System: Worklit

## 1. Overview

**Creative North Star: "The Architect's Desk"**

Worklit's interface feels like a well-organized architect's desk — warm wood, clean blueprints, confident marks. Every element is placed with intention. There is no decoration that doesn't earn its keep. The color palette is warm paper tones with a single clay-terracotta accent that appears rarely and always carries meaning: approval, sign-off, done.

This is a **product** surface. The design serves the workflow: define deliverables, send for approval, get paid. The interface should recede when the freelancer is in flow and assert itself only at moments of decision — approving an item, signing a scope, generating an invoice. Density is generous but not wasteful. Spacing breathes. Typography is editorial but never precious.

The system explicitly rejects: neon accents, aggressive gradients, startup purple, dense enterprise dashboards, color-coded status rainbows, and anything that reads as "AI slop" (Inter/Roboto defaults, purple-on-white gradients, cards-for-everything). Rejected items go neutral grey, never red. The accent is the only meaningful color signal.

**Key Characteristics:**
- One accent, one meaning: clay/terracotta = approval
- Warm paper neutrals throughout — no pure black, no pure white
- Editorial serif headings paired with clean sans body
- Flat at rest, subtle elevation on hover
- Every interaction provides responsive feedback

## 2. Colors

The palette has two axes: warm paper neutrals (hue 75–84) and a clay-terracotta accent (hue 42–48). Nothing else. There are no secondary accent colors. Dark sections use deep forest green (hue 145).

### Accent
- **Clay** (`oklch(48% 0.12 42)`): The architect's stamp. Used on primary buttons, approved states, the logo mark, progress indicators. Appears on ≤10% of any given screen.
- **Clay Hover** (`oklch(40% 0.11 42)`): Hover state for accent elements.
- **Clay Light** (`oklch(84% 0.08 60)`): Background tint for approved items, success confirmations. Subtle context without competing with the primary.
- **Clay Mid** (`oklch(70% 0.10 50)`): Borders on accent-tinted areas. Bridges light and dark values.
- **Clay Dark** (`oklch(38% 0.11 42)`): Text on accent-tinted backgrounds.

### Neutral
- **Paper** (`oklch(96.5% 0.014 82)`): Page background. A warm, slightly off-white paper tone — never cream, never grey.
- **Paper Alt** (`oklch(93% 0.018 80)`): Section tints, alt backgrounds. Noticeably darker than the page.
- **Paper Card** (`oklch(99% 0.006 84)`): Cards, modals, elevated surfaces. Near-white with a ghost of warmth.
- **Paper Deep** (`oklch(88% 0.022 78)`): Stronger section dividers, borders between alt backgrounds.
- **Deep Forest** (`oklch(20% 0.026 145)`): Dark section backgrounds (footer, How It Works panels, final CTA). A deep green-black that ties dark tones to the brand.
- **Forest Black** (`oklch(13% 0.022 145)`): The deepest tone. Used for the footer and final CTA background.
- **Ink** (`oklch(15% 0.018 50)`): Primary text. Warm near-black — never pure black.
- **Ink Mid** (`oklch(36% 0.018 55)`): Secondary text, nav links, metadata.
- **Ink Soft** (`oklch(54% 0.014 60)`): Captions, placeholders, timestamps, muted UI labels.
- **Line** (`oklch(86% 0.020 75)`): Default borders on cards, dividers, table rows.
- **Line Mid** (`oklch(74% 0.020 70)`): Emphasis borders, input default stroke.

### Named Rules
**The Architect's Stamp Rule.** The clay accent is used on ≤10% of any given screen. It appears only where the freelancer needs to take action — approve, sign, submit, create. If every card has an accent element, the stamp loses its authority.

**The No-Red Rule.** Rejected, deferred, and neutral states use warm paper greys at reduced opacity. Never red, never orange. The accent is the only color that carries emotional weight.

## 3. Typography

**Display Font:** Instrument Serif (italic for emphasis, regular for headings)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** A serif with editorial presence paired with a clean, readable sans. The serif appears only in headings — never in body, never in UI labels. This restraint makes each heading feel like a deliberate mark on the page. The sans is warm and neutral; it recedes when the user is reading and asserts itself only in labels and interactive elements.

### Hierarchy
- **Hero** (400/400i, `clamp(44px, 8.6vw, 116px)`, 0.96): Landing page hero only. Instrument Serif.
- **Display** (400, `clamp(32px, 3vw, 48px)`, 1.02–1.12): Section headings, dashboard titles. Instrument Serif.
- **Card Title** (400, 20–34px, 1.15): Card headings, project names. Instrument Serif.
- **UI Heading** (500–600, 15–18px, 1.3): Step titles, feature headings. DM Sans.
- **Body** (400, 15–17px, 1.55–1.65): Paragraphs, descriptions. DM Sans.
- **Label** (500–600, 11–12px, 0.08–0.14em tracking, uppercase): Section eyebrows, KPI labels. DM Sans.

### Named Rules
**The One Serif Rule.** Instrument Serif appears only in headings. Never in body text, never in buttons, never in form labels. If it appears outside a heading, it's wrong.

## 4. Elevation

The system is **flat at rest, raised on interaction.** Surfaces at rest are defined by borders and background color, not shadows. Cards use a 1px line border and a near-white paper-card background — this alone creates enough depth against the paper page background.

Shadows appear only as a response to state: hover lifts a card 2px with a subtle warm-tinted shadow; the product mockup card carries a permanent shadow as a design element; focused inputs get an accent ring. But the default state of every surface is shadowless.

### Shadow Vocabulary
- **Ambient Low** (`0 1px 3px oklch(15% 0.018 50 / 0.04)`): Subtle lift on hover.
- **Ambient Mid** (`0 4px 14px oklch(15% 0.018 50 / 0.05), 0 1px 3px oklch(15% 0.018 50 / 0.03)`): Card hover, dropdown menus.
- **Ambient High** (`0 28px 60px -20px oklch(15% 0.018 50 / 0.22), 0 1px 0 oklch(15% 0.018 50 / 0.04)`): Modals, success states, the product mockup on the landing page.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). The product mockup card is the sole exception — it carries a permanent shadow as a deliberate design element.

## 5. Components

### Buttons
- **Shape:** Rounded (10px) for app UI. Pill shapes (999px border-radius) for landing page CTAs.
- **Primary:** Accent (clay) background, white text. `active:scale(0.97)` for press feedback. Lifts 1px on hover.
- **On dark:** White/near-white background with dark (ink) text. Hover: accent background with white text.
- **Ghost on dark:** Transparent with white/60 border, white text. Hover: white background, dark text.
- **Hover / Focus:** Transition background, color, border-color (0.18s), transform (0.12s). Focus-visible gets an accent ring.
- **Disabled:** Border-mid background, ink-soft text. Never opacity alone — always explicit color change.

### Cards
- **Corner Style:** Rounded (16–20px).
- **Background:** Paper Card (near-white).
- **Border:** 1px line border at rest.
- **Hover:** Border shifts to line-mid, subtle translateY(-2px), ambient shadow.

### Inputs
- **Style:** 1.5px border-mid stroke, paper-card background, 10px radius.
- **Focus:** Border shifts to accent. A subtle accent ring (3px, 10% opacity) reinforces state.
- **Disabled:** Paper-alt background, ink-soft text.

### Navigation
- **Desktop sidebar:** 240px/60px (expanded/collapsed), warm paper background, 1px right border.
- **Landing nav:** Fixed topbar, transparent over hero (white text), solid paper background below scroll. Links are 14px, pill-shaped CTA.
- **Mobile drawer:** Slides down from top, paper-card background, serif link text at 26px.

### Status Badges
- **Approved:** Accent-light background, accent-dark text, accent-mid border. Includes a small check icon.
- **Pending / Draft:** Paper-alt background, ink-mid text, line-mid border.
- **Rejected:** Paper-alt background, ink-soft text, reduced opacity (55%). No color. No red.

## 6. Motion & Animation

### Principles
- **One orchestrated entrance** (page load stagger) is better than scattered micro-interactions.
- Transitions should feel springy. Use `cubic-bezier(0.22, 1, 0.36, 1)` for slide/enter motions.
- Durations: 120–180ms for micro (hover); 220–320ms for state changes; 500–900ms for entrance animations.
- `transform` and `opacity` only — never animate `width`, `height`, or `margin`.

### Standard transitions
```css
/* Hover colour change */
transition: background 0.18s, color 0.18s, border-color 0.18s;

/* Hover lift */
transition: transform 0.12s, box-shadow 0.18s;

/* Slide-in (drawers, panels) */
transition: transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.28s ease;
```

### Hero entrance (landing page)
1. Painting fades in (1.6s)
2. Scrim + vignette fade (1.4s, 0.25s delay)
3. Content cascade: pill → headline → lede → buttons → trust row (each ~140ms apart)

### Scroll reveal
`.reveal` elements fade up (opacity 0 → 1, translateY 24px → 0) via IntersectionObserver (threshold 0.14). `.reveal-stagger` children animate sequentially with 100ms delays.

### Reduced motion
All animations collapse to instant when `prefers-reduced-motion: reduce` is set.

## 7. Do's and Don'ts

### Do:
- **Do** use the clay accent sparingly — one primary button per screen, one active indicator.
- **Do** use warm paper backgrounds everywhere. Cards are near-white; pages are paper. This creates hierarchy.
- **Do** pair Instrument Serif headings with DM Sans body. No other fonts.
- **Do** provide responsive feedback — buttons scale on press, cards lift on hover, inputs glow on focus.
- **Do** use borders for card separation at rest. Shadows are for interaction states only (mockup card excepted).
- **Do** label every status badge with text. Color is never the sole indicator of state.
- **Do** respect `prefers-reduced-motion` — collapse all animation durations to near-zero when requested.

### Don't:
- **Don't** use red, orange, or any secondary accent color. Clay is the only meaningful signal.
- **Don't** use pure black (`#000`) or pure white (`#fff`) anywhere. Every neutral is tinted.
- **Don't** apply Instrument Serif to body text, buttons, labels, or any non-heading element.
- **Don't** use opacity alone for disabled states. Always change the background color explicitly.
- **Don't** animate from `scale(0)`. Start from `scale(0.3)` or higher.
- **Don't** use `transition: all`. Specify exact properties.
- **Don't** use cards inside cards.
- **Don't** use gradient text, glassmorphism as default, or hero-metric templates.
