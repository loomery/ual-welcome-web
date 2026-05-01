import { useEffect, useState, useCallback } from 'react';

/**
 * Hook per gestire dark/light mode con persistenza in localStorage
 * @returns {Object} { theme, toggleTheme, isLoading }
 */
export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Carica il tema da localStorage al mount.
  // Lo setState dentro l'effetto è voluto: leggiamo da localStorage e da
  // matchMedia (browser-only) e dobbiamo idratare a un valore di default
  // SSR-safe per poi sincronizzare al volo. React 19 introduce la regola
  // `react-hooks/set-state-in-effect` per questo pattern — qui la
  // disabilitiamo perché è il caso d'uso esplicitamente esentato:
  // hand-off del valore "vero" da un external system al primo paint.
  useEffect(() => {
    const storedTheme = localStorage.getItem('ual-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    /* eslint-disable react-hooks/set-state-in-effect */
    setTheme(initialTheme);
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ual-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme, isLoading };
}
