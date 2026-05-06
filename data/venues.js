/**
 * Non-college venues used by events (Students' Union, partner spaces, etc.).
 * Mirrors the Building shape so the EventDetailScreen can render the same
 * "Where" treatment regardless of whether the event lives on a college
 * campus or at a separate venue.
 *
 * Keep this short and curated — only add a venue when an event references
 * it. The minimap places these on the same lat/lng-derived plane as the
 * UAL colleges, so they sit alongside in the contextual map.
 *
 * @typedef {import('./buildings').Building} Building
 * @type {Building[]}
 */
export const VENUES = [
  {
    id: 'arts-su',
    name: "Arts Students' Union",
    college: 'Arts SU',
    address: '272 High Holborn, London WC1V 7EY',
    size: [0.7, 0.6],
    height: 0.8,
    description:
      "UAL's Students' Union — clubs, societies, advice and events for all UAL students.",
    geo: { lat: 51.518, lng: -0.1175 },
  },
];
