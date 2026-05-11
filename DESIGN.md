---
name: Worklit
description: Scope approval for freelancers who want to get paid for what was agreed to.
colors:
  sage-green: oklch(50% 0.13 152)
  sage-green-hover: oklch(44% 0.13 152)
  sage-green-light: oklch(94% 0.035 150)
  sage-green-mid: oklch(86% 0.065 150)
  sage-green-dark: oklch(34% 0.1 150)
  warm-stone: oklch(95% 0.008 100)
  warm-stone-alt: oklch(91% 0.012 100)
  warm-stone-card: oklch(100% 0 0)
  deep-forest: oklch(20% 0.015 148)
  charcoal-text: oklch(20% 0.012 60)
  charcoal-mid: oklch(44% 0.008 65)
  charcoal-soft: oklch(62% 0.005 65)
  stone-border: oklch(90% 0.006 90)
  stone-border-mid: oklch(84% 0.008 90)
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(28px, 3vw, 48px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.12em"
    textTransform: uppercase
rounded:
  sm: 10px
  lg: 16px
spacing:
  card-pad: 22px
  section-gap: 18px
  page-pad: 22px
components:
  button-primary:
    backgroundColor: "{colors.sage-green}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "13px 26px"
  button-primary-hover:
    backgroundColor: "{colors.sage-green-hover}"
  input-default:
    backgroundColor: "{colors.warm-stone-card}"
    rounded: "{rounded.sm}"
    padding: "13px 16px"
---

# Design System: Worklit

## 1. Overview

**Creative North Star: "The Architect's Desk"**

Worklit's interface feels like a well-organized architect's desk — warm wood, clean blueprints, confident marks. Every element is placed with intention. There is no decoration that doesn't earn its keep. The color palette is warm stone with a single green accent that appears rarely and always carries meaning: approval, sign-off, done.

This is a **product** surface. The design serves the workflow: define deliverables, send for approval, get paid. The interface should recede when the freelancer is in flow and assert itself only at moments of decision — approving an item, signing a scope, generating an invoice. Density is generous but not wasteful. Spacing breathes. Typography is editorial but never precious.

The system explicitly rejects: neon accents, aggressive gradients, startup purple, dense enterprise dashboards, color-coded status rainbows, and anything that reads as "AI slop" (Inter/Roboto defaults, purple-on-white gradients, cards-for-everything). Rejected items go neutral grey, never red. Green is the only meaningful color signal.

**Key Characteristics:**
- One accent, one meaning: green = approval
- Warm stone neutrals throughout — no pure black, no pure white
- Editorial serif headings paired with clean sans body
- Flat at rest, subtle elevation on hover
- Every interaction provides responsive feedback without performance

## 2. Colors

The palette has two axes: warm stone neutrals (hue 95–100) and a single sage green accent (hue 150–152). Nothing else. There are no secondary accent colors.

### Primary
- **Sage Green** (`oklch(50% 0.13 152)`): The architect's stamp. Used on primary buttons, approved states, the logo mark, progress indicators, and the green dot on notifications. Its rarity is the point — it appears on ≤10% of any given screen.
- **Sage Green Hover** (`oklch(44% 0.13 152)`): Hover state for green elements. Darker, more deliberate.
- **Sage Green Light** (`oklch(94% 0.035 150)`): Background tint for approved items, success confirmations, and active nav states. Subtle enough to read as "green context" without competing with the primary.
- **Sage Green Mid** (`oklch(86% 0.065 150)`): Borders on green-tinted areas. Bridges light and dark greens.
- **Sage Green Dark** (`oklch(34% 0.1 150)`): Text on green-light backgrounds. Readable contrast without being harsh.

### Neutral
- **Warm Stone** (`oklch(95% 0.008 100)`): Page background. A warm, slightly gray stone — never cream, never yellow. Professional but approachable.
- **Warm Stone Alt** (`oklch(91% 0.012 100)`): Section tints, sidebar backgrounds, input disabled states. Noticeably darker than the page, creating clear visual zones.
- **Warm Stone Card** (`oklch(100% 0 0)`): Cards, modals, elevated surfaces. Pure white with a ghost of warmth. Sits cleanly on the stone background.
- **Deep Forest** (`oklch(20% 0.015 148)`): Dark section backgrounds (footer, How It Works panels). A deep green-charcoal that ties dark tones to the brand. Not black.
- **Charcoal Text** (`oklch(20% 0.012 60)`): Primary text. Warm charcoal — never pure black.
- **Charcoal Mid** (`oklch(44% 0.008 65)`): Secondary text, nav links, metadata.
- **Charcoal Soft** (`oklch(62% 0.005 65)`): Captions, placeholders, timestamps, muted UI labels.
- **Stone Border** (`oklch(90% 0.006 90)`): Default borders on cards, dividers, table rows.
- **Stone Border Mid** (`oklch(84% 0.008 90)`): Emphasis borders, input default stroke. One step stronger than default.

### Named Rules
**The Architect's Stamp Rule.** Sage green is used on ≤10% of any given screen. It appears only where the freelancer needs to take action — approve, sign, submit, create. If every card has a green element, the stamp loses its authority.

**The No-Red Rule.** Rejected, deferred, and neutral states use warm stone greys at reduced opacity. Never red, never orange. Green is the only color that carries emotional weight.

## 3. Typography

**Display Font:** Instrument Serif (with Georgia fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)

**Character:** A serif with editorial presence paired with a clean, readable sans. The serif appears only in headings — never in body, never in UI labels. This restraint makes each heading feel like a deliberate mark on the page, not filler text. The sans is warm and neutral; it recedes when the user is reading and asserts itself only in labels and interactive elements.

### Hierarchy
- **Display** (400, `clamp(32px, 3vw, 48px)`, 1.12): Section headings, dashboard titles. Instrument Serif only. Used sparingly — typically once per page.
- **Headline** (400, `clamp(28px, 3vw, 40px)`, 1.12): Card titles, project names. Instrument Serif.
- **Title** (600, 18px, 1.3): Step titles, feature headings. DM Sans semibold.
- **Body** (400, 15px, 1.6): Paragraphs, descriptions, form labels. DM Sans. Max line length 65–75ch for prose; shorter for UI contexts.
- **Label** (600, 11px, 0.12em tracking, uppercase): Section eyebrows, KPI labels, table headers. DM Sans semibold. Always uppercase, always small.

### Named Rules
**The One Serif Rule.** Instrument Serif appears only in headings. Never in body text, never in buttons, never in form labels. If it appears outside a heading, it's wrong.

## 4. Elevation

The system is **flat at rest, raised on interaction.** Surfaces at rest are defined by borders and background color, not shadows. Cards use a 1px warm stone border and a pure white background — this alone creates enough depth against the stone page background.

Shadows appear only as a response to state: hover lifts a card 2px with a subtle warm-tinted shadow; the nav gains a soft shadow when scrolling; focused inputs get a green-tinted ring. But the default state of every surface is shadowless.

### Shadow Vocabulary
- **Ambient Low** (`0 1px 3px oklch(20% 0.012 60 / 0.04)`): Subtle lift on hover. Used under buttons.
- **Ambient Mid** (`0 4px 14px oklch(20% 0.012 60 / 0.05), 0 1px 3px oklch(20% 0.012 60 / 0.03)`): Card hover, dropdown menus.
- **Ambient High** (`0 14px 40px oklch(20% 0.012 60 / 0.08), 0 4px 10px oklch(20% 0.012 60 / 0.04)`): Modals, success states, the interactive mockup on the landing page.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). If a card has a shadow at rest, it's wrong.

## 5. Components

### Buttons
- **Shape:** Rounded (10px). No pill shapes, no sharp corners.
- **Primary:** Sage green background, white text, 13px vertical / 26px horizontal padding. `active:scale(0.97)` for press feedback. Lifts 1px on hover with a stronger green shadow.
- **Hover / Focus:** Darker green background, translateY(-1px), stronger shadow. Focus-visible gets a green ring.
- **Secondary:** Transparent background, 1.5px stone border, charcoal-mid text. Border shifts darker on hover.
- **Disabled:** Stone-mid background, charcoal-soft text. Never opacity alone — always explicit color change.

### Cards
- **Corner Style:** Rounded (16px).
- **Background:** Warm Stone Card (pure white).
- **Border:** 1px warm stone border at rest.
- **Internal Padding:** 22px.
- **Hover:** Border shifts to sage-mid, subtle translateY(-2px), ambient-mid shadow.

### Inputs
- **Style:** 1.5px stone-mid border, warm-stone-card background, 10px radius, 13px vertical / 16px horizontal padding.
- **Focus:** Border shifts to sage green. A subtle green ring (3px, 10% opacity) reinforces the state. No outline — just border-color + box-shadow.
- **Disabled:** Warm-stone-alt background, charcoal-soft text, cursor not-allowed.

### Navigation
- **Desktop sidebar:** 232px fixed, warm-stone background, 1px right border. Nav items are 13.5px DM Sans, charcoal-mid at rest, sage-green-light background + sage-green-dark text when active. Badges are 11px, full-rounded pills.
- **Top nav (landing page):** Fixed 64px bar with backdrop-blur-xl (24px), semi-transparent warm-stone background. Links are 14px charcoal-mid, hover to charcoal-text. CTA is dark filled button.

### Status Badges
- **Approved:** Sage-green-light background, sage-green-dark text, sage-green-mid border. Includes a small green check icon.
- **Pending / Draft:** Warm-stone-alt background, charcoal-mid text, stone-border-mid border.
- **Rejected:** Warm-stone-alt background, charcoal-soft text, reduced opacity (55%). No color. No red.

## 6. Do's and Don'ts

### Do:
- **Do** use sage green sparingly — one primary button per screen, one active indicator. The rarity creates the meaning.
- **Do** use warm stone backgrounds everywhere. Cards are white; pages are warm stone. This alone creates hierarchy.
- **Do** pair Instrument Serif headings with DM Sans body. No other fonts.
- **Do** provide responsive feedback — buttons scale on press, cards lift on hover, inputs glow on focus.
- **Do** use borders for card separation at rest. Shadows are for interaction states only.
- **Do** label every status badge with text. Color is never the sole indicator of state.
- **Do** respect `prefers-reduced-motion` — collapse all animation durations to near-zero when the user requests it.

### Don't:
- **Don't** use red, orange, or any secondary accent color. Green is the only meaningful signal.
- **Don't** use pure black (`#000`) or pure white (`#fff`) anywhere. Every neutral is tinted toward warm stone.
- **Don't** apply Instrument Serif to body text, buttons, labels, or any non-heading element.
- **Don't** use opacity alone for disabled states. Always change the background color explicitly.
- **Don't** animate from `scale(0)`. Nothing in the real world appears from nothing. Start from `scale(0.3)` or higher.
- **Don't** use `transition: all`. Specify exact properties.
- **Don't** use cards inside cards. Nested cards are always wrong.
- **Don't** use side-stripe borders (`border-left` > 1px as a colored accent). Rewrite with full borders, background tints, or nothing.
- **Don't** use gradient text, glassmorphism as default, or the hero-metric template (big number + small label + gradient accent). These are SaaS clichés.
