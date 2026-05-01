/**
 * ESLint flat config — Next 16 + ESLint 9 + better-tailwindcss.
 *
 * Stack:
 *  - Next 16 ships ESLint config as a flat-config array (we spread
 *    `core-web-vitals`, which already extends the base Next config).
 *  - `better-tailwindcss` reads `app/globals.css` (our @theme entry
 *    point), then lints JSX class strings: canonicalises arbitrary
 *    values to theme tokens, removes duplicates, sorts variants, etc.
 *    All recommended rules are autofixable — `npm run lint:fix`
 *    rewrites the codebase in place.
 *
 * Rule choices:
 *  - `recommended-warn` config = every recommended rule as a warning.
 *    Warnings show in CI but don't fail the build, which is right for
 *    style-only rules during the in-progress Tailwind migration.
 *  - `enforce-shorthand-classes` is opt-in (recommended: false) so we
 *    add it explicitly. It collapses `mt-4 mr-4 mb-4 ml-4` → `m-4`,
 *    `w-4 h-4` → `size-4`, etc.
 *  - `no-unknown-classes` is DISABLED for now. Once we're enabled it
 *    flags every legacy class still in `globals.css` (`.event-card`,
 *    `.feedback-dialog`, `.flow`, `.box`, …). We'll re-enable it as
 *    `error` at the very end of the Tailwind-only refactor — at that
 *    point it becomes the gate that proves "no custom CSS classes
 *    survive in JSX".
 */
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

const config = [
  ...nextCoreWebVitals,
  {
    files: ['**/*.{js,jsx,mjs,ts,tsx}'],
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'better-tailwindcss': {
        // Tailwind 4 entry point — the file with `@import "tailwindcss"`
        // and the `@theme` block. The plugin walks the CSS to know
        // which tokens / utilities are registered.
        entryPoint: 'app/globals.css',
        // Browser default. Required so the plugin can convert px-based
        // arbitrary values into rem-based canonical tokens. Without it,
        // `min-h-[44px]` is seen as opaque — with it, the plugin knows
        // 44px = 2.75rem = min-h-11. Mirrors the VSCode Tailwind LSP
        // assumption.
        rootFontSize: 16,
      },
    },
    rules: {
      // Convert arbitrary values to canonical token utilities when an
      // exact equivalent exists. e.g. `rounded-[8px]` → `rounded-lg`,
      // `mt-[16px]` → `mt-4`.
      'better-tailwindcss/enforce-canonical-classes': 'warn',
      // Collapse longhand into shorthand when possible.
      // e.g. `mt-4 mr-4 mb-4 ml-4` → `m-4`, `w-4 h-4` → `size-4`.
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      // Sort classes consistently.
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
      // Sort variants consistently inside a class string.
      'better-tailwindcss/enforce-consistent-variant-order': 'warn',
      // Remove `p-4 p-4` etc.
      'better-tailwindcss/no-duplicate-classes': 'warn',
      // Flag `p-2 p-4` (last wins, but author intent is unclear).
      'better-tailwindcss/no-conflicting-classes': 'warn',
      // Remove leading/trailing spaces inside class strings.
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      // OFF for now — would flag every legacy custom class. Re-enable
      // as `error` once the Tailwind-only migration is complete.
      'better-tailwindcss/no-unknown-classes': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/sw.js',
      'public/workbox-*.js',
      'next-env.d.ts',
    ],
  },
];

export default config;
