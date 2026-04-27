/**
 * Build a universal "open in map" URL.
 * Google Maps' `search/?api=1&query=` endpoint is honoured by every OS —
 * on iOS Safari, iOS / Android open the native Maps picker automatically.
 *
 * @param {import('../data/buildings').Building} b
 * @returns {string}
 */
export function directionsUrl(b) {
  const q = b.geo ? `${b.geo.lat},${b.geo.lng}` : `${b.name}, ${b.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
