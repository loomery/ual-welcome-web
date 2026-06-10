/**
 * Prefix a public/ asset path with the deploy sub-path (basePath).
 *
 * Next applies basePath to routing, `_next` chunks, next/image and next/link,
 * but NOT to plain string references to files in public/ (e.g. `<img src>`,
 * `<a href>` to a PDF, a manifest icon). Under a sub-path deploy
 * (/student-centre) those root-absolute paths 404. Wrap them with asset().
 *
 * NEXT_PUBLIC_BASE_PATH is inlined at build time (see next.config.mjs `env`),
 * so this works identically in server prerender and client hydration.
 *
 * @param {string} path Root-absolute public path, e.g. '/images/x.png'.
 * @returns {string} basePath-prefixed path, e.g. '/student-centre/images/x.png'.
 */
export function asset(path) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
