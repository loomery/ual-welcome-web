/**
 * PostCSS — Tailwind v4
 *
 * Tailwind 4 ships its own PostCSS plugin (`@tailwindcss/postcss`) that
 * replaces the v3 `tailwindcss` plugin. autoprefixer is no longer needed:
 * Tailwind 4 prefixes vendor properties internally and emits the right
 * @supports/@property fallbacks.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
