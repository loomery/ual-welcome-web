/**
 * UAL Design System tokens, exposed as Tailwind utilities.
 *
 * Strategy:
 *   - The source of truth for tokens stays in CSS custom properties on
 *     :root (see app/globals.css). Tailwind references them via var(--…)
 *     so there's no drift between component CSS and Tailwind utilities.
 *   - All UAL-specific keys are namespaced (e.g. text-step-1, bg-ual-orange,
 *     p-s, m-2xl, font-heading) so we don't clash with Tailwind defaults.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './screens/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ual: {
          light: 'var(--color-light)',
          medium: 'var(--color-medium)',
          shade: 'var(--color-shade)',
          dark: 'var(--color-dark)',
          'dark-50': 'var(--color-dark--tint-50)',
          'dark-90': 'var(--color-dark--tint-90)',
          'dark-95': 'var(--color-dark--tint-95)',
          orange: 'var(--color-orange)',
          'util-blue': 'var(--color-utility-blue)',
          'util-green': 'var(--color-utility-green)',
          'util-orange': 'var(--color-utility-orange)',
          'util-red': 'var(--color-utility-red)',
        },
      },
      fontFamily: {
        main: 'var(--font-main)',
        heading: 'var(--font-heading)',
      },
      fontWeight: {
        normal: 'var(--font-weight-normal)',
        bold: 'var(--font-weight-bold)',
      },
      fontSize: {
        // UAL fluid type scale. step-d1 = "down 1" (smaller than base).
        'step-d1': 'var(--step--1)',
        'step-0': 'var(--step-0)',
        'step-1': 'var(--step-1)',
        'step-2': 'var(--step-2)',
        'step-3': 'var(--step-3)',
        'step-4': 'var(--step-4)',
      },
      lineHeight: {
        default: 'var(--line-height-default)',
        condensed: 'var(--line-height-condensed)',
        single: 'var(--line-height-single)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
      },
      // Override the spacing scale with UAL's fluid clamp-based scale.
      // Keys match UAL DS naming (3xs…3xl) — usable as p-s, m-l, gap-xl, etc.
      spacing: {
        '3xs': 'var(--space-3xs)',
        '2xs': 'var(--space-2xs)',
        xs: 'var(--space-xs)',
        s: 'var(--space-s)',
        m: 'var(--space-m)',
        l: 'var(--space-l)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        'bottom-nav': 'var(--bottom-nav-height)',
      },
      maxWidth: {
        grid: 'var(--grid-max-width)',
        prose: '57.5rem',
      },
      borderWidth: {
        thin: 'var(--border-thin)',
      },
      transitionTimingFunction: {
        ual: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
