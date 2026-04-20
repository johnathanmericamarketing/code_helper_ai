# Code Helper Studio — Brand Guidelines

*The canonical brand reference for all UI, design, and product work.*

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Logo & Icon](#4-logo--icon)
5. [Spacing & Layout](#5-spacing--layout)
6. [Shadows & Depth](#6-shadows--depth)
7. [Component Patterns](#7-component-patterns)
8. [Motion & Animation](#8-motion--animation)
9. [Writing Style & Voice](#9-writing-style--voice)
10. [Dark Mode Policy](#10-dark-mode-policy)
11. [Do's and Don'ts](#11-dos-and-donts)

---

## 1. Brand Identity

| Attribute | Value |
|---|---|
| **Product name** | Code Helper Studio |
| **Tagline** | "Your personal AI software engineer" |
| **Secondary tagline** | "AI Website Changes, No Coding Required" |
| **Live URL** | <https://codehelper.studio/> |
| **Product type** | AI-powered web application — users describe website changes in plain English; AI generates safe code diffs with visual preview and one-click publish. |
| **Target audience** | Founders, marketers, designers, operators, and developers who need to make website changes without breaking things. |

### Brand personality

Powerful but approachable. Dark, modern, technical. Precise. Trusted. **Not flashy — confident.**

---

## 2. Color System

### Background Scale

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080c18` | Base page background |
| `--bg-elev` | `#0f172a` | Elevated surfaces, cards |
| `--surface` | `#0f172a` | Card backgrounds |
| `--surface-2` | `rgba(255,255,255,0.04)` | Subtle overlays |

### Brand / Violet Scale

| Token | Value | Usage |
|---|---|---|
| `--violet-400` | `#a78bfa` | Highlights, eyebrow text, links, accents |
| `--violet-500` | `#8b5cf6` | Primary brand color |
| — | `#7c3aed` | Deep violet, shadows, glow |
| — | `#6366f1` | Indigo, gradient mid |
| — | `#4f46e5` | Indigo dark, gradient end |
| — | `#c4b5fd` | Light violet, logo core glow |
| — | `#818cf8` | Soft indigo, tertiary orbiting dot |

### Text Scale

| Token | Value | Usage |
|---|---|---|
| `--text` | `#f1f5f9` | Primary text |
| `--text-muted` | `#94a3b8` | Body copy, secondary text |
| `--text-soft` | `#64748b` | Placeholder text, de-emphasized labels |

### Border Scale

| Token | Value | Usage |
|---|---|---|
| `--border` | `rgba(148,163,184,0.1)` | Default borders |
| `--border-strong` | `rgba(148,163,184,0.18)` | Hover/active borders |
| Focus border | `#7c3aed` | Input focus state |

### Gradients

| Name | Value | Usage |
|---|---|---|
| **Brand gradient** | `linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)` | CTAs, primary buttons, logo backgrounds |
| **Gradient text** | `linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #6366f1 75%, #4f46e5 100%)` | Hero headings, section titles |
| **Violet glow bg** | `radial-gradient(ellipse 600px 400px at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)` | Page background accent behind key sections |

---

## 3. Typography

### Font Families

| Role | Font | Weights | Source |
|---|---|---|---|
| Body / UI | **Inter** | 400, 500, 600, 700, 800, 900 | Google Fonts |
| Code / Terminal | **JetBrains Mono** | 500, 700 | Google Fonts |

**Google Fonts import:**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
```

### Type Scale

| Element | Size | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| `h1` | `clamp(48px, 6vw, 80px)` | 900 | `-0.04em` | `1.05` |
| `h2` | `clamp(30px, 3.8vw, 52px)` | 800 | `-0.035em` | `1.08` |
| `h3` | `20px` | 700 | `-0.02em` | — |
| Body / lead | `clamp(17px, 1.4vw, 20px)` | 400 | — | `1.55` |
| Label | `13px` | 500 | — | — |
| Eyebrow / tag | `11–12px` | 600–700 | `0.1–0.12em` | — |
| Code / mono | JetBrains Mono `14px` | 500 | — | — |
| Input placeholder | JetBrains Mono `14px` | 400 | — | — |

### Gradient Text (hero headings)

Apply via:

```css
background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 40%, #6366f1 75%, #4f46e5 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 4. Logo & Icon

### Logo variants

| File | Usage |
|---|---|
| `logo-dark.svg` | On dark backgrounds (`#080c18`) — **default** |
| `logo-light.svg` | On light backgrounds |
| `logo-brand.svg` | On purple/gradient backgrounds |
| `logo-transparent.svg` | On any background where white text works |
| `icon-only.svg` | App icon, standalone use |
| `favicon.svg` | Browser favicon (animated orbiting atom, SMIL animations) |

### Icon description

Animated **orbiting atom**: a glowing violet core circle with three elliptical orbit rings at `0°`, `+60°`, and `-60°` rotation, each carrying a small orbiting dot at different speeds (`3s`, `4.5s`, `3.8s`). The core uses a radial gradient from `#c4b5fd` to `#7c3aed`.

### Logo construction rules

- Always use the `prefix` prop on `LogoIcon.jsx` (`prefix="nav"` in header, `prefix="footer"` in footer) to prevent SVG gradient ID conflicts when the logo appears more than once on a page.
- **Minimum clear space:** equal to the height of the icon on all sides.
- Do not recolor the logo. Do not add drop shadows to the wordmark. Do not use the logo on low-contrast backgrounds.
- **Wordmark font:** Inter 700, color `#f1f5f9` on dark, `#0f172a` on light.

### Favicon

- **File:** `favicon.svg` with SMIL animations
- **HTML tag:**

```html
<link rel="icon" type="image/svg+xml" href="%PUBLIC_URL%/favicon.svg" />
```

---

## 5. Spacing & Layout

### Spacing tokens

| Token | Value |
|---|---|
| `--s-2` | `8px` |
| `--s-4` | `16px` |
| `--s-6` | `24px` |
| `--s-10` | `40px` |
| `--s-16` | `64px` |
| `--s-24` | `96px` |

### Layout

- **Max container width:** `1200px`, centered, `padding: 0 24px`
- **Section vertical padding:** `100px 0` desktop, `72px 0` mobile (≤768px)
- **Card border-radius:** `16–20px`
- **Button border-radius:** `12px` default, `9999px` for pill buttons (Google sign-in)
- **Input border-radius:** `12px`

### Breakpoints

| Name | Width |
|---|---|
| Mobile | ≤ 480px |
| Tablet | ≤ 768px |
| Desktop | > 768px |

---

## 6. Shadows & Depth

| Token | Value | Usage |
|---|---|---|
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.3)` | Cards, panels |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.4)` | Modals, dropdowns |
| `--shadow-violet` | `0 8px 32px -8px rgba(124,58,237,0.45)` | Brand CTAs, active logo |
| Card shadow | `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)` | Auth card, modal |
| Button hover shadow | `0 8px 24px rgba(124,58,237,0.4)` | Primary CTA hover |
| Focus glow | `0 0 0 3px rgba(124,58,237,0.2)` | Input focus ring |

### Glass card formula

```css
background: rgba(15, 23, 42, 0.8);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(148, 163, 184, 0.12);
border-radius: 20px;
box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1);
```

---

## 7. Component Patterns

### Primary CTA Button

```css
background: linear-gradient(135deg, #8b5cf6, #6366f1);
color: #fff;
font-weight: 700;
border-radius: 12px;
height: 48px;
padding: 0 28px;
border: none;

/* Hover */
filter: brightness(1.08);
box-shadow: 0 8px 24px rgba(124,58,237,0.4);

/* Shimmer overlay */
background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
animation: shimmer 2.5s infinite;
```

### Eyebrow / Section tag

```css
display: inline-flex;
align-items: center;
gap: 8px;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
color: #a78bfa;
background: rgba(124,58,237,0.08);
border: 1px solid rgba(167,139,250,0.25);
padding: 8px 14px;
border-radius: 9999px;
```

### Input field (focused state)

```css
background: #0f172a;
border: 1px solid rgba(148,163,184,0.12);
border-radius: 12px;
height: 44px;
padding: 0 14px;
color: #f1f5f9;
font-family: JetBrains Mono, monospace; /* placeholders only */

/* Focus */
border-color: #7c3aed;
box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
outline: none;
```

### Glass card

See [Section 6 — Glass card formula](#glass-card-formula).

### Navigation (sticky header)

```css
position: sticky;
top: 0;
z-index: 100;
background: rgba(8,12,24,0.85);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(148,163,184,0.08);
```

### Particle canvas (background effect)

- **50 dots**, radius `1–2px`, color `rgba(139,92,246,0.5)` to `rgba(99,102,241,0.3)`
- Slow random drift (speed `0.1–0.3`), wrap at edges
- Rendered on a fixed `<canvas>` behind all content, `z-index: 0`
- **Used on:** landing hero, auth page background

---

## 8. Motion & Animation

### Keyframes used

| Name | Description | Duration |
|---|---|---|
| `shimmer` | Horizontal light sweep across buttons/cards | `2.5s infinite` |
| `fadeInUp` | Fade + translate Y from `+20px` to `0` | `0.5–0.6s ease-out` |
| `fadeIn` | Opacity `0 → 1` | `0.4s ease` |
| `float` | Gentle vertical bob `±8px` | `6s ease-in-out infinite` |
| `pulse-glow` | Box-shadow pulsing violet glow | `3s ease-in-out infinite` |
| `spin` | 360° rotation (loading spinner) | `0.7s linear infinite` |
| Orbit (SMIL) | SVG `<animateMotion>` along elliptical path | `3s / 4.5s / 3.8s` |

### Page entrance

- Cards and sections: `fadeInUp` on mount, `0.4s` delay stagger between elements
- Auth card: `fadeInUp` `0.4s ease`, starts `-12px` translateY

### Interaction states

- **Buttons:** `transition: all 0.2s ease` — covers background, shadow, transform
- **Inputs:** `transition: border-color 0.2s, box-shadow 0.2s`
- **Nav links:** `transition: color 0.2s`
- **Cards:** `transition: transform 0.3s, box-shadow 0.3s` — hover lifts `4px`

### Rules

- Never use motion that lasts longer than **600ms** for UI transitions.
- Entrance animations should stagger at **100–150ms** intervals, not all at once.
- Prefer `transform` and `opacity` for animations — never animate `width`, `height`, or `margin`.

---

## 9. Writing Style & Voice

### Tone

- **Confident, not arrogant.** Direct and precise.
- **Technical, not jargon-heavy.** Explain what things do, not how they work internally.
- **Empowering.** The user is in control; the AI is the assistant.

### Headlines

- Bold, action-oriented. Lead with the benefit.
- Use gradient text on the most important word or phrase in each section heading.
- **Example:** "Ship website changes **in seconds**" — not "Introducing AI website editing"

### UI copy rules

| Context | Rule |
|---|---|
| Buttons | Verb first — "Sign In", "Get Started", "Create Account", "Try It Free" |
| Errors | Plain English. Never show raw Firebase/API error strings to users. |
| Empty states | Helpful, not apologetic. Tell the user what to do next. |
| Loading states | Always show a spinner. Never leave a button click silent. |
| Placeholders | Use realistic examples (`you@example.com`, not `Enter email here`) |

### Capitalization

- **Product name:** always "Code Helper Studio" (never "Code helper studio" or "CHS")
- **Features:** title case — "Visual Inspector", "Try It Free", "Brand Rules"
- Do not ALL-CAPS words for emphasis — use font-weight or gradient text instead

---

## 10. Dark Mode Policy

> **Dark mode is the only mode. There is no light mode.**

Enforce on every page load:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

- Never rely on `prefers-color-scheme` media query for the app — always force dark.
- **Tailwind:** set `darkMode: 'class'` in `tailwind.config.js` and ensure the `dark` class is always present on `<html>`.
- Do not expose a theme toggle in the UI unless explicitly requested.

---

## 11. Do's and Don'ts

### ✅ Do

- Always use `#080c18` as the base page background — never pure black `#000`.
- Use **Inter** for all UI text. Use **JetBrains Mono** only for code, terminal output, and input placeholders.
- Use the brand gradient on **exactly one primary CTA per section** — not on every button.
- Add `backdrop-filter: blur` to nav and glass cards for depth.
- Use the animated logo SVG — never a static `</>` icon or a generic code icon.
- Include a `prefix` prop on `LogoIcon.jsx` whenever it appears more than once per page.
- Follow SEO metadata structure from `frontend/public/index.html` for any new pages.

### ❌ Don't

- Don't use light backgrounds, white cards, or `bg-white` anywhere in the app.
- Don't use red for brand elements — only for error/destructive states.
- Don't use generic UI component defaults (e.g., shadcn light card styles) without overriding to the dark design system.
- Don't animate `width`, `height`, `top`, or `left` — only `transform` and `opacity`.
- Don't add exclamation marks to UI copy. The tone is confident, not excitable.
- Don't place the logo on any background that doesn't have enough contrast for the wordmark.
- Don't ship without testing at **390px** (iPhone SE) and **1280px** (desktop) widths.

---

*This document is the canonical source of truth for Code Helper Studio's visual and written brand. When in doubt, defer to the values defined here.*
