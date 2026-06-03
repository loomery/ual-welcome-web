/**
 * Global search index.
 *
 * This is the single place that knows *what* is searchable across the app.
 * Every data file (`data/*.js`) gets a small adapter that maps its records
 * into the flat, normalised `SearchEntry` shape below. The UI never touches
 * the raw data files — it only ever sees `SearchEntry[]`.
 *
 * ── Why this shape ──────────────────────────────────────────────────────
 * The app is a thin layer over a large and growing pile of *external* UAL
 * links (arts.ac.uk pages, mailto/tel contacts) plus a handful of internal
 * routes. A student rarely knows which tab a thing lives under, so a single
 * fuzzy search across everything is the cheapest way to make all of it
 * reachable. Each entry is either internal (`to`, opens via next/link) or
 * external (`href`, opens in a new tab) — never both.
 *
 * ── Scaling this ────────────────────────────────────────────────────────
 * To index a new data source: write a `fromX()` adapter that returns
 * `SearchEntry[]`, then add it to the spread in `buildSearchIndex`. To add a
 * field to the fuzzy match, extend `keywords` here and the weight table in
 * `score.js`. No other file changes.
 *
 * @typedef {'page'|'task'|'support'|'event'|'info'|'college'} SearchEntryType
 *
 * @typedef {Object} SearchEntry
 * @property {string} id            Stable, unique across the whole index (prefixed by type).
 * @property {SearchEntryType} type Drives the icon/badge in the UI.
 * @property {string} title         Primary label.
 * @property {string} [subtitle]    Secondary line (short description / context).
 * @property {string} group         Display heading the result is bucketed under.
 * @property {string[]} [keywords]  Extra terms folded into the fuzzy match (synonyms, emails…).
 * @property {string} [to]          Internal route — opens with next/link. Mutually exclusive with href.
 * @property {string} [href]        External / protocol URL (https, mailto, tel) — opens in a new tab.
 */

import { NAV_ITEMS } from '../../components/Layout/navConfig';
import { visibleTasks } from '../../data/checklist';
import { HELP_CATEGORIES, SECTIONS } from '../../data/help';
import { EVENTS } from '../../data/events';
import { USEFUL_INFO } from '../../data/usefulInfo';
import { COLLEGE_OPTIONS } from '../../data/onboardingOptions';

const SECTION_LABELS = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label]));

/** Treat http(s)/mailto/tel as external; everything else is an internal route. */
function isExternal(url) {
  return /^(https?:|mailto:|tel:)/i.test(url ?? '');
}

/** Build either a `to` or `href` field from a single URL string. */
function destination(url) {
  return isExternal(url) ? { href: url } : { to: url };
}

/** Primary nav routes — Home, Get Setup, Events, Map, Support. */
function fromNav() {
  return NAV_ITEMS.map((item) => ({
    id: `page:${item.to ?? item.href}`,
    type: /** @type {const} */ ('page'),
    title: item.label,
    subtitle: 'Go to page',
    group: 'Pages',
    keywords: [item.label],
    ...destination(item.to ?? item.href),
  }));
}

/**
 * Get-setup tasks. International-only tasks (e.g. CAS) are excluded for
 * Home/UK students via the shared `visibleTasks` gate, so search never
 * surfaces something the rest of the app hides.
 *
 * @param {string} [studentType]
 */
function fromTasks(studentType) {
  return visibleTasks(studentType).map((task) => ({
    id: `task:${task.id}`,
    type: /** @type {const} */ ('task'),
    title: task.title,
    subtitle: task.shortDescription,
    group: 'Get setup',
    keywords: ['task', 'checklist', 'setup', task.cta?.label].filter(Boolean),
    to: `/checklist/${task.id}`,
  }));
}

/**
 * Support categories. Each becomes one entry pointing at its internal detail
 * page; the contact labels/values (emails, phone numbers, page names) are
 * folded into keywords so "wellbeing email" or "servicedesk" finds the right
 * category even though those strings aren't in the title.
 */
function fromHelp() {
  return HELP_CATEGORIES.map((cat) => ({
    id: `support:${cat.id}`,
    type: /** @type {const} */ ('support'),
    title: cat.title,
    subtitle: cat.shortDescription,
    group: SECTION_LABELS[cat.section] ?? 'Support',
    keywords: [
      'support',
      'help',
      cat.ctaLabel,
      ...(cat.contacts ?? []).flatMap((c) => [c.label, c.value, c.note]),
    ].filter(Boolean),
    to: `/help/${cat.id}`,
  }));
}

/** Welcome Week events — internal detail pages at /events/[id]. */
function fromEvents() {
  return EVENTS.map((event) => ({
    id: `event:${event.id}`,
    type: /** @type {const} */ ('event'),
    title: event.title,
    subtitle: `${event.category} · ${event.college}`,
    group: 'Events',
    keywords: [event.category, event.college, event.location].filter(Boolean),
    to: `/events/${event.id}`,
  }));
}

/** Always-on reference links (term dates, Student Services). */
function fromUsefulInfo() {
  return USEFUL_INFO.map((info) => ({
    id: `info:${info.id}`,
    type: /** @type {const} */ ('info'),
    title: info.title,
    subtitle: info.eyebrow ?? info.body ?? info.ctaLabel,
    group: 'Useful info',
    keywords: ['info', info.ctaLabel].filter(Boolean),
    ...destination(info.href),
  }));
}

/** Each college's public "What's On" page — high-volume external deep links. */
function fromColleges() {
  return COLLEGE_OPTIONS.map((college) => ({
    id: `college:${college.id}`,
    type: /** @type {const} */ ('college'),
    title: `${college.name} — What's On`,
    subtitle: college.area,
    group: 'Colleges',
    keywords: [college.short, college.name, college.area, 'whats on', 'events'].filter(Boolean),
    href: college.eventsUrl,
  }));
}

/**
 * Assemble the full index. Cheap to call (a few array maps), but the caller
 * should still memoise it on `studentType` and feed the result through
 * `prepareIndex` once — see `useGlobalSearch`.
 *
 * @param {string} [studentType] One of STUDENT_TYPE_OPTIONS[].id.
 * @returns {SearchEntry[]}
 */
export function buildSearchIndex(studentType) {
  return [
    ...fromNav(),
    ...fromTasks(studentType),
    ...fromHelp(),
    ...fromEvents(),
    ...fromUsefulInfo(),
    ...fromColleges(),
  ];
}

/** A small, type-diverse default shown when the search box is empty. */
export const DEFAULT_SUGGESTION_IDS = [
  'page:/checklist',
  'page:/events',
  'support:it-accounts',
  'support:health-wellbeing',
  'info:term-dates',
];
