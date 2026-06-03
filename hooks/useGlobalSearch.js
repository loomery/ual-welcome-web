'use client';

import { useMemo } from 'react';
import { useOnboardingProfile } from './useOnboardingProfile';
import { buildSearchIndex, DEFAULT_SUGGESTION_IDS } from '../lib/search/searchSources';
import { prepareIndex, searchEntries } from '../lib/search/score';

/**
 * Glue between the pure search modules and React. Builds + prepares the index
 * once per `studentType` (so international-only entries appear/disappear with
 * the profile) and returns ranked results for a query.
 *
 * The actual matching is delegated to `searchEntries` — this hook only owns
 * memoisation and the empty-query default suggestions.
 *
 * @param {string} query
 * @param {number} [limit=12]
 * @returns {{ results: import('../lib/search/score').SearchResult[], indexSize: number }}
 */
export function useGlobalSearch(query, limit = 12) {
  const { profile } = useOnboardingProfile();
  const studentType = profile?.studentType;

  // Rebuilt only when the student type changes — not on every keystroke.
  const prepared = useMemo(() => prepareIndex(buildSearchIndex(studentType)), [studentType]);

  const defaults = useMemo(() => {
    const byId = new Map(prepared.map((p) => [p.entry.id, p.entry]));
    return DEFAULT_SUGGESTION_IDS.map((id) => byId.get(id))
      .filter(Boolean)
      .map((entry) => ({ entry, score: 0 }));
  }, [prepared]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return defaults;
    return searchEntries(trimmed, prepared, limit);
  }, [query, prepared, defaults, limit]);

  return { results, indexSize: prepared.length };
}
