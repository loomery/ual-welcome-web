'use client';

import { useThemeContext } from './ThemeProvider';
import { SunIcon, MoonIcon } from '../Icon/NavIcons';

export function ThemeToggle() {
  const { theme, toggleTheme, isLoading } = useThemeContext();

  if (isLoading) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Attiva modalità ${theme === 'light' ? 'scura' : 'chiara'}`}
      className="inline-flex cursor-pointer items-center justify-center rounded-md border-none bg-none p-4 text-ual-medium transition-all duration-150 ease-ual hover:bg-ual-shade focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ual-orange [&_svg]:size-6 [&_svg]:stroke-current"
      title={`Modalità ${theme === 'light' ? 'scura' : 'chiara'}`}
    >
      {theme === 'light' ? (
        <SunIcon width="24" height="24" aria-hidden="true" />
      ) : (
        <MoonIcon width="24" height="24" aria-hidden="true" />
      )}
    </button>
  );
}
