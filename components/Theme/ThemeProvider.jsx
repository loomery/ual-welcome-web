'use client';

import { createContext, useContext } from 'react';
import { useTheme } from '../../hooks/useTheme';

const ThemeContext = createContext();

/**
 * Provider per il tema globale dell'app
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function ThemeProvider({ children }) {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook per accedere al contesto del tema
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext deve essere usato dentro ThemeProvider');
  }
  return context;
}
