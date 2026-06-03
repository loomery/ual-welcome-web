/**
 * Pure, dependency-free fuzzy matcher for the global search.
 *
 * Kept deliberately small: no external library, no index server. The whole
 * search index is a few hundred entries at most (see searchSources.js), so a
 * linear scan with per-field weighted scoring is more than fast enough and
 * trivially debuggable. If the corpus ever grows past a few thousand entries,
 * swap this module for a prebuilt inverted index — the public API
 * (`searchEntries`) is the only thing the UI depends on.
 *
 * @typedef {import('./searchSources').SearchEntry} SearchEntry
 *
 * @typedef {Object} PreparedEntry
 * @property {SearchEntry} entry          The original entry (what the UI renders).
 * @property {Object} norm                Normalised, lowercased fields (precomputed once).
 * @property {string} norm.title
 * @property {string} norm.subtitle
 * @property {string} norm.keywords
 * @property {string} norm.group
 *
 * @typedef {Object} SearchResult
 * @property {SearchEntry} entry
 * @property {number} score
 */

/**
 * Lowercase, strip diacritics, collapse whitespace. Diacritic folding means
 * "cafe" matches "café" and vice-versa — useful for an international cohort.
 *
 * @param {string} [value]
 * @returns {string}
 */
export function normalize(value) {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Is `needle` a subsequence of `haystack`? (Characters appear in order, gaps
 * allowed.) This is the "fuzzy" fallback that lets "wlbng" match "wellbeing".
 *
 * @param {string} needle
 * @param {string} haystack
 * @returns {boolean}
 */
function isSubsequence(needle, haystack) {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j += 1) {
    if (haystack[j] === needle[i]) i += 1;
  }
  return i === needle.length;
}

/**
 * Score a single normalised field against a single token. Higher is better.
 *   1.00  prefix match            ("vis" → "visa & immigration")
 *   0.80  word-boundary match     ("immigration" inside "visa & immigration")
 *   0.50  mid-word substring      ("migr" inside "immigration")
 *   0.25  fuzzy subsequence       ("imgrn" inside "immigration")
 *   0     no match
 *
 * @param {string} field   Already normalised.
 * @param {string} token   Already normalised, non-empty.
 * @returns {number}
 */
function fieldScore(field, token) {
  if (!field) return 0;
  const idx = field.indexOf(token);
  if (idx === 0) return 1;
  if (idx > 0) return field[idx - 1] === ' ' ? 0.8 : 0.5;
  return isSubsequence(token, field) ? 0.25 : 0;
}

/** Relative importance of each field. Title dominates; keywords carry synonyms. */
const FIELD_WEIGHTS = { title: 10, keywords: 6, subtitle: 4, group: 2 };

/**
 * Prepare the raw index once. Normalising up-front means each keystroke only
 * does cheap `indexOf` calls instead of re-lowercasing the whole corpus.
 *
 * @param {SearchEntry[]} entries
 * @returns {PreparedEntry[]}
 */
export function prepareIndex(entries) {
  return entries.map((entry) => ({
    entry,
    norm: {
      title: normalize(entry.title),
      subtitle: normalize(entry.subtitle),
      keywords: normalize((entry.keywords ?? []).join(' ')),
      group: normalize(entry.group),
    },
  }));
}

/**
 * Run a query against the prepared index. Every query token must match at
 * least one field (AND semantics across tokens, OR across fields), so
 * "wellbeing email" narrows rather than widens. Results are ranked by summed
 * weighted score, with a prefix bonus so exact title starts float to the top.
 *
 * @param {string} query
 * @param {PreparedEntry[]} prepared
 * @param {number} [limit=12]
 * @returns {SearchResult[]}
 */
export function searchEntries(query, prepared, limit = 12) {
  const q = normalize(query);
  if (!q) return [];
  const tokens = q.split(' ');

  /** @type {SearchResult[]} */
  const results = [];

  for (const { entry, norm } of prepared) {
    let total = 0;
    let matchedEvery = true;

    for (const token of tokens) {
      const best = Math.max(
        FIELD_WEIGHTS.title * fieldScore(norm.title, token),
        FIELD_WEIGHTS.keywords * fieldScore(norm.keywords, token),
        FIELD_WEIGHTS.subtitle * fieldScore(norm.subtitle, token),
        FIELD_WEIGHTS.group * fieldScore(norm.group, token),
      );
      if (best === 0) {
        matchedEvery = false;
        break;
      }
      total += best;
    }

    if (!matchedEvery) continue;
    if (norm.title.startsWith(q)) total += 5; // whole-query prefix bonus
    results.push({ entry, score: total });
  }

  results.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return results.slice(0, limit);
}
