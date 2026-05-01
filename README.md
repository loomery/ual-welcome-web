# UAL Welcome Week

A beta web app to help new University of the Arts London students get set up
for their first weeks. Lightweight, mobile-first, no login, no backend.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **JSX** (no TypeScript) with JSDoc types where useful
- **Tailwind CSS** + CSS custom properties (`app/globals.css`)
- **@react-three/fiber** for the 3D campus map (lazy-loaded, client-only)
- **next-pwa** (opt-in)

State that survives a page reload lives in `localStorage` under the `ual:`
prefix. There is no server.

> **Note on `params`:** Next.js 15+ exposes route params as a `Promise`.
> All dynamic pages (`app/**/[id]/page.jsx`) must `await params` before
> reading route segments.

## Prerequisites

- Node.js **>= 18.17** (LTS recommended)
- npm 9+

## Install

```bash
npm install
```

> If you see a `type-fest` lock-file conflict in the dev sandbox, run:
> `rm -rf node_modules package-lock.json && npm install`

## Run in development

```bash
npm run dev
```

Open <http://localhost:3000>. The dev server has a relaxed Content Security
Policy (HMR + webpack source maps need `unsafe-eval`, `blob:`, and the WS
upgrade) — production builds use the strict CSP from `next.config.mjs`.

## Production build

```bash
npm run build
npm start
```

To build with the PWA service worker enabled:

```bash
ENABLE_PWA=1 npm run build
npm start
```

## Other useful scripts

| Script               | What it does                                         |
| -------------------- | ---------------------------------------------------- |
| `npm run lint`       | ESLint over the whole tree.                          |
| `npm run audit`      | `npm audit` at high severity, prod deps only.        |
| `npm run audit:full` | `npm audit` at moderate severity, all deps.          |
| `npm run verify`     | Lint → audit → production build. Run before pushing. |

## Routes

| Path           | Description                           |
| -------------- | ------------------------------------- |
| `/`            | Home — countdown + useful-info cards  |
| `/checklist`   | Induction checklist with localStorage |
| `/events`      | Welcome Week event list (filterable)  |
| `/events/[id]` | Individual event detail page          |
| `/map`         | 3D explorable campus map              |

## Project orientation

For the architectural map, conventions, design tokens, accessibility
commitments, and security model, read **[`AGENTS.md`](./AGENTS.md)** at the
repo root. It is the project primer for both humans and AI agents.
