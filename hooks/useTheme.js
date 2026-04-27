import { useEffect, useState, useCallback } from 'react';

/**
 * Hook per gestire dark/light mode con persistenza in localStorage
 * @returns {Object} { theme, toggleTheme, isLoading }
 */
export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Carica il tema da localStorage al mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('ual-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setIsLoading(false);
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
