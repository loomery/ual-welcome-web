/**
 * ESLint flat config — Next 16 + ESLint 9.
 *
 * Next 16 removed the bundled `next lint` command. ESLint is now invoked
 * directly (see package.json `scripts.lint`) and reads this flat-config
 * file instead of the legacy `.eslintrc.json`. The `eslint-config-next`
 * package now ships its config as a flat-config array, so we spread it
 * straight into the export.
 *
 * `core-web-vitals` already extends the base `eslint-config-next` config
 * with the web-vitals rule pack, so we don't need to import the base
 * config separately.
 */
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWebVitals,
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
