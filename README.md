# UAL Student Centre

A web app that helps new University of the Arts London students get set up for
their first weeks: a personalised dashboard, an induction checklist, Welcome
Week events, a per-college map, and help content.

**No login. No backend.** The app is a static site. All content is built into
the bundle, and everything the user saves lives in their browser's
`localStorage`.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **JavaScript / JSX** with JSDoc types (no TypeScript)
- **Tailwind CSS v4** — design tokens in `app/globals.css`
- **Serwist** — optional PWA service worker
- **Google Tag Manager** — via `@next/third-parties`, set up in `app/layout.jsx`

`next.config.mjs` sets `output: 'export'`, so `npm run build` produces a fully
static site in `out/`. There is no server, database, or API at runtime.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

> If `npm install` fails with a `type-fest` lock-file conflict, run
> `rm -rf node_modules package-lock.json && npm install`.

## Scripts

| Script               | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Dev server with hot reload.                   |
| `npm run build`      | Static export to `out/`.                      |
| `npm start`          | Serve the last build.                         |
| `npm run lint`       | ESLint.                                       |
| `npm run lint:fix`   | ESLint with `--fix`.                          |
| `npm run format`     | Prettier over all files.                      |
| `npm run audit`      | `npm audit`, high severity, prod deps.        |
| `npm run audit:full` | `npm audit`, moderate severity, all deps.     |
| `npm run verify`     | Lint + audit + build. **Run before pushing.** |
| `npm run compress`   | Tar `out/` for deployment.                    |

To build with the PWA service worker (compiled by Serwist from `app/sw.js`):

```bash
ENABLE_PWA=1 npm run build
```

A Husky pre-commit hook runs ESLint + Prettier on staged files.

## Folder layout

```
app/         Routes (App Router). Each page.jsx is short and renders a screen.
screens/     One screen per view. Holds the view's state and composes components.
components/  Reusable UI (Button, Card, Layout/*, Onboarding/*, …).
hooks/       Client hooks for localStorage state.
data/        All content, as plain JS files. No database, no fetch.
utils/       Small helpers (asset paths, date formatting, .ics export, map links).
public/      Static files (icons, images, floor plans, manifest).
scripts/     Deploy script (file-store.js — uploads the build to UAL hosting).
```

Routes import screens; screens import components. Imports are relative; the
`@/*` alias (`jsconfig.json`) also works.

## Pages & navigation

`app/layout.jsx` wraps every page in `AppShell` (`components/Layout/AppShell.jsx`):
top header, a greeting/college hero, the desktop side nav, the mobile bottom
tab bar, the footer, and a live region for screen readers. The nav items are
listed in `components/Layout/navConfig.js`.

The home page (`/`) renders `components/SmartHome.jsx`:

- **No saved profile** → it redirects to `/onboarding`.
- **Profile complete** → it shows the personalised `DashboardScreen`.

It waits for `localStorage` to load before deciding, so returning users aren't
redirected by mistake.

### Routes

| Path             | Page                                               |
| ---------------- | -------------------------------------------------- |
| `/`              | Dashboard, or redirect to onboarding if not set up |
| `/onboarding`    | First-run profile setup                            |
| `/checklist`     | Induction checklist (progress saved)               |
| `/checklist/mfa` | Multi-factor authentication guide                  |
| `/events`        | Events list (filter + save favourites)             |
| `/events/[id]`   | Event detail (with calendar export)                |
| `/help`          | Help & support categories                          |
| `/help/[id]`     | Help category detail                               |
| `/info/[slug]`   | Info pages built from content blocks               |
| `/map`           | Per-college floor plans, address & travel info     |
| `/dashboard`     | Redirects to `/`                                   |

## Adding a page

Create `app/<route>/page.jsx`. Keep it short: set `metadata`, render a screen.

```jsx
import { ExampleScreen } from '../../screens/Example/ExampleScreen';

export const metadata = {
  title: 'Example', // becomes "Example | UAL Student Centre"
};

export default function ExamplePage() {
  return <ExampleScreen />;
}
```

The brand suffix comes from the title template in `app/layout.jsx`
(`'%s | UAL Student Centre'`), so each page only sets its short title. The
template does not apply to the home page, so `app/page.jsx` uses
`title: { absolute: 'Home | UAL Student Centre' }`.

For a page with an id or slug (`app/<route>/[id]/page.jsx`), list every page
with `generateStaticParams` and read params with `await` (Next 15+ makes
`params` a Promise):

```jsx
import { notFound } from 'next/navigation';
import { EVENTS } from '../../../data/events';
import { EventDetailScreen } from '../../../screens/Events/EventDetailScreen';

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id })); // one page per id
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  if (!event) return { title: 'Event not found' };
  return { title: event.title, description: event.description };
}

export default async function EventDetailPage({ params }) {
  const { id } = await params;
  const event = EVENTS.find((e) => e.id === id);
  if (!event) notFound(); // shows app/not-found.jsx
  return <EventDetailScreen id={id} />;
}
```

To redirect a route, call `redirect('/')` in the page (see
`app/dashboard/page.jsx`).

## Editing content

All content is plain JavaScript in `data/`. To change what the app shows, edit
the array in the matching file and rebuild. Each file describes its shape with
JSDoc at the top.

| File                   | What it holds                                                    |
| ---------------------- | ---------------------------------------------------------------- |
| `events.js`            | `EVENTS` — Welcome Week events                                   |
| `checklist.js`         | `TASKS`, `TASKS_BY_ID`, `visibleTasks(studentType)`              |
| `help.js`              | `HELP_CATEGORIES`, `SECTIONS`, `HELP_BY_ID`                      |
| `infoPages.js`         | `INFO_PAGES`, `INFO_PAGES_BY_SLUG`                               |
| `usefulInfo.js`        | `USEFUL_INFO` — dashboard reference cards                        |
| `welcomeWeek.js`       | `WELCOME_WEEK` — start/end dates for the countdown               |
| `onboardingOptions.js` | College / year / student-type / visa / interest options          |
| `buildings.js`         | `BUILDINGS` — per-college address, location, travel, floor plans |
| `venues.js`            | `VENUES` — non-college event venues                              |

When a file exports a list, it usually also exports a lookup map built with
`Object.fromEntries` (e.g. `HELP_BY_ID`), so pages can find an item by id or
slug. Info pages are an ordered list of content blocks (`prose`, `list`,
`links`, `table`) rendered by `screens/Info/InfoScreen.jsx` — so adding a page
is just data, no new component.

## Saving data (localStorage)

There is no server, so anything that must survive a reload is stored in the
browser. Use the `usePersistedState` hook (`hooks/usePersistedState.js`) instead
of calling `localStorage` directly:

```js
const [value, setValue, hydrated] = usePersistedState('ual:my:key:v1', initial);
```

- The first render always uses `initial` (so the static HTML matches the first
  client render). After mounting, the saved value loads and `hydrated` becomes
  `true`.
- If some UI depends on saved data, wait for `hydrated === true` before acting
  on it — especially redirects (see `components/SmartHome.jsx`).

Hooks built on top:

- `useOnboardingProfile` — the student profile (`patch`, `commit`, `reset`, `isComplete`).
- `useEventFavourites` — saved events, shared across all components and browser
  tabs (uses `useSyncExternalStore`).
- `useTheme` — see Styling below.

Name keys `ual:<feature>:<thing>:v1`. Keys in use today:

```
ual:profile:v1            onboarding profile
ual:task:status:v1        checklist task statuses
ual:task:steps:v1         checklist sub-step progress
ual:events:favourites:v1  saved event ids
ual:dash:view:v1          dashboard view toggle
ual:feedback:log:v1       feedback submissions
ual-theme                 theme (older key, no ual: prefix)
```

## Static-site notes

- **No data fetching at runtime.** Content comes from `data/` at build time.
- **Forms have no server.** The feedback dialog saves to `localStorage`
  (`ual:feedback:log:v1`). To send it somewhere real later, add that URL to
  `connect-src` and `form-action` in the CSP (`next.config.mjs`).
- **Sub-path hosting.** The site lives under `/student-centre`. `next.config.mjs`
  reads `DEPLOY_PATH` and sets `basePath`. Next handles links, images and chunks
  automatically — but for plain paths to `public/` files (e.g. an `<img src>`),
  wrap them with `asset()` from `utils/asset.js`:

  ```jsx
  import { asset } from '../utils/asset';
  <img src={asset('/images/logo.svg')} />; // → /student-centre/images/logo.svg
  ```

- Security headers and the CSP are in `next.config.mjs` (stricter in production
  than in dev).

## Styling & accessibility

- **Tailwind v4.** Design tokens are defined in `app/globals.css` (under
  `@theme inline`) and used as utilities like `text-step-3`, `text-ual-orange`,
  `gap-l`. Some base styles in `globals.css` are unlayered, so if a utility
  class isn't taking effect, check that file.
- **Single theme (light).** Dark mode was removed. `useTheme` always sets
  `data-theme="light"`. `dark:` classes still exist in some components but are
  inactive.
- **Accessibility.** Skip links, semantic landmarks, focus handling, and a
  route-change announcement for screen readers
  (`components/Layout/RouteAnnouncer.jsx`). Page titles come from Next metadata —
  don't set `document.title` by hand.

## Deployment

On pushing to `main`, there is a GitHub Action to deploy to [dev.arts.ac.uk/student-centre](https://dev.arts.ac.uk/student-centre)

On release creation, there is a GitHub Action to deploy to [test.arts.ac.uk/student-centre](https://test.arts.ac.uk/student-centre)

For deployments to production [studentcentre.arts.ac.uk](https://student-centre.arts.ac.uk) you must trigger the [Production Pipeline](https://git.arts.ac.uk/sss-team/student-prototype/actions/workflows/prod-pipeline.yml) specifying the release version
