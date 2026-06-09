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
    // The new home/product design is single-theme (black-on-light) and the
    // dark-mode toggle was retired with the old side nav. Lock to light so a
    // user whose OS prefers dark doesn't get an orphaned, un-toggleable dark
    // theme that inverts the hero/CTA surfaces away from the design.
    document.documentElement.setAttribute('data-theme', 'light');
    /* eslint-disable react-hooks/set-state-in-effect */
    setTheme('light');
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
