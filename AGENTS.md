# AGENTS.md

> Project expert primer for any AI agent (or new human contributor)
> picking up the **UAL Welcome Week** beta. Read this *before* making
> changes — it encodes the conventions, design contracts, and known
> trade-offs so you don't reinvent or accidentally break them.
>
> Cross-tool standard filename per the emerging
> [agents.md](https://agents.md) convention. If your tool prefers
> `CLAUDE.md` or `.cursorrules`, symlink to this file.

---

## 1. What this is, in one paragraph

A mobile-first PWA that helps incoming UAL students get through their
first week: an induction checklist, a 3D explorable campus map, and a
schedule of Welcome Week events. **No login. No backend.** Everything
lives client-side: data is static JS files in `/data`, user state lives
in `localStorage`. We're in **public beta** — content and IA can
change; the contracts in this file (a11y, security, design tokens)
should not.

## 2. The four pillars (don't compromise on these)

1. **Simplicity.** If a feature needs login, a backend, or a
   third-party SDK to work, push back hard before building it. The
   beta's value is fast time-to-information.
2. **User friendliness.** Plain English, mobile-first layout, sensible
   defaults. Avoid jargon ("matriculation" → "enrolment").
3. **Design + practice consistency.** Use the design tokens listed in
   §6. Don't introduce new colours, type scales, or spacing values —
   extend the token set if you really need to.
4. **Accessibility — WCAG 2.2 AA.** Non-negotiable. Every interactive
   target ≥ 44×44 (2.5.8), every focus state visible (2.4.7), every
   route change announced (4.1.3). See §7.

## 3. Stack

| Layer        | Choice                                    |
| ------------ | ----------------------------------------- |
| Framework    | Next.js 14.2 — **App Router**             |
| Language     | JavaScript + JSX (**no TypeScript**) with JSDoc types |
| Styling      | Tailwind 3.4 base + custom CSS in `app/globals.css` driven by CSS variables |
| 3D / Map     | `@react-three/fiber` + `@react-three/drei`, lazy-loaded with `ssr: false` |
| PWA          | `next-pwa` 5.6 — **opt-in via `ENABLE_PWA=1`** (see `next.config.mjs`) |
| Persistence  | `localStorage` only, namespaced under `ual:` |
| Tests        | None yet (beta). Sanity check via `npm run lint` + `npm run build`. |

`next-pwa` is unmaintained — we wrapped its import in try/catch so a
broken workbox dep can't kill the build. Watch for `serwist` or
`@ducanh2912/next-pwa` as future replacements.

## 4. Repo map (the bits that matter)

```
app/
├── layout.jsx          ← Root layout. metadata, manifest, AppShell wrap.
├── globals.css         ← All custom CSS lives here. Tokens at top.
├── page.jsx            ← /
├── checklist/page.jsx  ← /checklist
├── map/page.jsx        ← /map
├── events/page.jsx     ← /events
├── events/[id]/page.jsx← /events/:id (uses generateStaticParams)
└── not-found.jsx
components/
├── Button/             ← Primary, ghost
├── Card/               ← Internal (`to`) + external (`external`) link-cards
├── Checkbox/           ← DS-styled, fully a11y-compliant. DON'T REINVENT.
├── ChecklistItem/      ← Wraps Checkbox + body + CTA + dependency hint
├── Countdown/          ← Days until Welcome Week
├── EventCard/
├── Feedback/           ← FeedbackButton (FAB) + FeedbackDialog (native <dialog>)
├── Icon/               ← All inline SVGs. Add new icons here.
├── Layout/             ← AppShell, Header, BottomNav, Footer, SkipLinks
└── Progress/
data/
├── checklist.js        ← Priority-content checklist items
├── events.js           ← Welcome Week events
├── usefulInfo.js       ← Always-on resources (term dates, Student Services)
└── welcomeWeek.js      ← Start/end dates for the countdown
hooks/
├── usePersistedState.js  ← SSR-safe localStorage hook
└── usePrefersReducedMotion.js
screens/                ← Page-level composition. Server components by default.
├── Home/HomeScreen.jsx
├── Checklist/ChecklistScreen.jsx
├── Events/{EventsScreen,EventDetailScreen}.jsx
└── Map/                ← All Three.js stuff. Client-only.
utils/                  ← Pure functions: dates, ICS export, directions
public/                 ← icon.svg, icon-maskable.svg, manifest.webmanifest
next.config.mjs         ← PWA opt-in + security headers (CSP, HSTS, etc.)
```

## 5. Conventions (the rules of the road)

### Server vs client components
- **Default to server components.** Only add `'use client'` when the
  module needs hooks, browser APIs, or `@react-three/fiber`.
- Page-level `screens/*.jsx` files are server components when possible
  (e.g. `HomeScreen` sorts events at request-time).
- The Map subtree is fully client (`screens/Map/MapScreen` does
  `dynamic(import('./MapCanvas'), { ssr: false })`).

### File naming
- Components: `PascalCase.jsx`, one component per file, named export
  matching filename.
- Hooks: `useFoo.js` with named export.
- Utils: `camelCase.js`, named exports.

### Types
- We use **JSDoc**, not TypeScript. Every exported function gets a
  JSDoc block with `@param` + `@returns`. Use `@template` for generics
  (see `usePersistedState`).

### Styling
- **Tailwind** for ad-hoc utility composition (rare). Most components
  use **semantic class names** (`feedback-dialog__panel`,
  `checklist-item__cta`) defined in `globals.css`.
- BEM-ish: `block__element--modifier` or `data-` attributes for
  modifiers (e.g. `data-checked=""`).
- **Always reach for a CSS variable** before a hard-coded value.

### State persistence
- All localStorage keys are prefixed `ual:` so the **Reset progress**
  button in the footer can sweep them. If you add a new key, follow
  the convention. Never store PII.

## 6. Design tokens (cheat sheet)

Defined in `app/globals.css` `:root`. Don't redefine, don't shadow.

### Colour
| Token                       | Value      | Use                       |
| --------------------------- | ---------- | ------------------------- |
| `--color-dark`              | #000       | Primary text + borders    |
| `--color-light`             | #f6f6f6    | Page background           |
| `--color-medium`            | #3b3b3b    | Secondary text            |
| `--color-orange`            | #ff5000    | Brand accent, focus rings |
| `--color-dark--tint-90`     | #e6e6e6    | Hairlines, subtle bg      |
| `--color-dark--tint-95`     | #f2f2f2    | Card / tag bg             |

There's a `prefers-color-scheme: dark` block already wired — if you
add new components, derive colours from these tokens, not from
hard-coded hex.

### Spacing — fluid (`clamp()`)
`--space-3xs` … `--space-2xl`. Never hard-code rems for layout.

### Type scale — fluid
`--step--1` … `--step-3`. `--line-height-default` and
`--line-height-condensed` for body vs. headings.

### Touch target
**44px minimum** on any interactive element (WCAG 2.5.8). Pattern:

```css
.thing {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-2xs) var(--space-xs);
}
```

## 7. Accessibility — WCAG 2.2 AA (how we deliver it)

Concrete commitments and the file that backs each one:

- **Skip links** (2.4.1) — `components/Layout/SkipLinks.jsx`. Two
  links: skip to main, skip to navigation.
- **Landmarks** — `header`, `main`, `nav`, `footer`, `dialog` are all
  semantic. Don't use `<div role="main">`.
- **Route announcement** (4.1.3) — `RouteAnnouncer` updates an
  `aria-live="polite"` region on every navigation.
- **Focus management** — Native `<dialog>.showModal()` for the
  feedback modal (focus trap + Esc handling for free).
  `FeedbackButton` restores focus to itself on close.
- **Focus visible** (2.4.7) — Every interactive thing has a
  `:focus-visible` outline using `--color-orange`. Don't ship without.
- **Touch targets** (2.5.8) — Min 44×44. Cited in `globals.css`
  comments where it matters.
- **Reduced motion** (2.3.3) — `usePrefersReducedMotion` + CSS
  `@media (prefers-reduced-motion: reduce)`. Map auto-rotation, button
  hover transitions, modal animations all gated.
- **Colour contrast** (1.4.3) — Body text ≥ 4.5:1 against background.
  Run a contrast check before committing new colour pairings.
- **Form labels** (3.3.2) — Programmatic association via `htmlFor` +
  `id`. See `Checkbox` for the pattern.
- **External links** (3.2.5) — `target="_blank"` always paired with
  `rel="noreferrer"` AND a visually-hidden "(opens in new tab)" for AT
  users.
- **Error / status messages** (4.1.3) — `role="status"` +
  `aria-live="polite"` for non-disruptive updates (e.g., feedback
  sent confirmation, completion banner).

**When in doubt**: prefer native HTML over ARIA. If you're reaching
for `role` or `aria-*`, check whether a semantic element would do it
for you.

## 8. Security (what we lock down)

`next.config.mjs` ships with security headers always-on:

- **CSP** — `default-src 'self'`. Concession: `'unsafe-inline'` on
  script-src for Next's boot script (FIXME: nonce + middleware in v1).
  Dev-mode relaxations (toggled via `NODE_ENV !== 'production'`):
  `'unsafe-eval'` + `blob:` on script-src (webpack source maps + HMR
  worker), `ws: wss:` on connect-src (HMR socket). If you change the
  CSP, restart the dev server AND hard-reload — browsers cache CSP
  meta from the previous response.
- **HSTS** — 2 years, includeSubDomains, preload-eligible.
- **X-Frame-Options: DENY**, `frame-ancestors 'none'` — no embedding.
- **Permissions-Policy** — denies camera, mic, geolocation, FLoC,
  Topics. Add an explicit allow if a feature genuinely needs one.
- **Referrer-Policy** — `strict-origin-when-cross-origin`.

Other rules:
- **No `dangerouslySetInnerHTML`.** Ever. We have zero use cases for it.
- **No `eval`, `Function()`, `document.write`.**
- **No PII in localStorage.** UI state and progress only. The feedback
  dialog explicitly does NOT persist email after submit.
- **External URLs**: only `https://`. `mailto:` is allowed, but body
  is capped at 1500 chars (see `FeedbackDialog`'s `MAX_MESSAGE_LENGTH`).
- **Run `npm run audit` before tagging a release.** It runs
  `npm audit --audit-level=high --omit=dev`.

If a future feature needs a backend (likely candidate: replace mailto
feedback with a real endpoint), update CSP `connect-src` and
`form-action` to allow that origin.

## 9. Data (where content lives)

- **Static, in `data/*.js`.** No CMS yet. Content updates require a
  PR. This is fine for the beta — copy churn is low and PRs give us a
  paper trail.
- **Source of truth for student-facing content**:
  [arts.ac.uk](https://www.arts.ac.uk/students). When in doubt, link
  back to the canonical UAL page rather than re-hosting copy that can
  rot.
- **Future CMS migration**: each `data/*.js` file is shaped to mirror
  what a CMS collection would expose — same field names, same
  optional/required semantics. Migration should be a swap of the
  import source, not a rewrite of consumers.

## 10. Common tasks (cheat sheet)

### Add a checklist item
1. Append to `data/checklist.js`. Required: `id`, `title`, `body`,
   `cta { label, href }`, `category`. Optional: `dependsOn` (id of
   parent task; renders a "Complete X first" hint).
2. That's it. The screen rerenders.

### Add a "Useful info" link card
1. Append to `data/usefulInfo.js`.
2. Done — it appears on Home automatically.

### Add a Welcome Week event
1. Append to `data/events.js`. ISO timestamps for `startsAt` /
   `endsAt`.
2. The dynamic `/events/[id]` route picks it up via
   `generateStaticParams`.

### Add a new route
1. Create `app/<route>/page.jsx` with a default export.
2. Add it to `components/Layout/navConfig.js` so Header + BottomNav
   include it (with an icon from `Icon/NavIcons.jsx`).

### Tweak a design token
Edit the `:root` block at the top of `app/globals.css`. The fluid
`clamp()` formulas come from utopia.fyi — preserve the math if you
adjust.

### Add a new icon
Drop a `<svg>` into `Icon/NavIcons.jsx` as a named export. 24×24
viewBox, `currentColor` for fill/stroke, no width/height (let the
caller pass them).

## 11. Anti-patterns (don't do these)

- **Don't** add libraries that pull in `workbox-*` at require time.
  We've been bitten — that's why `next-pwa` is opt-in.
- **Don't** use `dangerouslySetInnerHTML`, `eval`, or
  `document.write`. CSP will refuse and a reviewer will refuse first.
- **Don't** store anything personal in `localStorage`. Progress and
  prefs only.
- **Don't** add `target="_blank"` without `rel="noreferrer"` AND
  visually-hidden "(opens in new tab)".
- **Don't** hard-code colours, spacing, or font sizes. Use tokens.
- **Don't** drop a touch target below 44×44.
- **Don't** ship interactive elements without a visible
  `:focus-visible` style.
- **Don't** reach for a router/hook in a server component. The build
  will fail loudly, but it wastes time.
- **Don't** commit the `.next/` build output.

## 12. Known issues / open work

- `npm install` corruption observed inside the dev sandbox (mismatched
  `type-fest` entry in `package-lock.json`). Workaround: on the host,
  `rm -rf node_modules package-lock.json && npm install`.
- **PNG icons missing** from `manifest.webmanifest`. iOS < 16 and some
  Androids fall back to a grey square for SVG-only manifests. TODO:
  generate 192×192 and 512×512 PNGs (regular + maskable).
- **CSP allows `'unsafe-inline'` for scripts**. Tighten with a nonce
  + middleware before public production launch.
- **Feedback uses `mailto:`** with a 1500-char body cap. Production
  should swap to a server endpoint (Formspree / Resend / Edge
  Function) so we can rate-limit and audit.
- **iOS PWA storage eviction** at 7 days of inactivity. Mitigation:
  prompt for `navigator.storage.persist()` once installed.

## 13. How to verify your changes

1. `npm run lint` — Next's ESLint config; fail = fix.
2. `npm run build` — must produce a clean `.next/` with no warnings
   you didn't introduce.
3. `npm run audit` — high-severity dep advisories must be zero.
4. Manual smoke test in a phone-sized viewport (≤ 380px wide) with
   keyboard-only navigation. If you can't reach an interactive thing
   with Tab, you've broken it.
5. **Rebuild check**: open DevTools → Lighthouse → Mobile → run.
   Accessibility score must stay ≥ 95. PWA installability should pass
   when `ENABLE_PWA=1` is set.

## 14. Who to ask

- **Content / copy**: the priority-content brief (Miro / FigJam from
  the UAL content team). Dan Sweeting is the author.
- **Design system**: the UAL Design System (separate Figma library).
  Tokens here are derived from there.
- **Loomery internal**: Edo (project lead).

---

*Last updated: 2026-04. If you change a convention here, update this
file in the same PR.*
