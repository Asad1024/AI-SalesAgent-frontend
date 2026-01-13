import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check for saved theme preference - check both keys for backward compatibility
    const savedTheme = (localStorage.getItem('spark-ai-theme') || localStorage.getItem('theme')) as Theme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      // Sync both keys
      localStorage.setItem('spark-ai-theme', savedTheme);
      localStorage.setItem('theme', savedTheme);
    } else {
      // Default to light mode on first load
      setTheme('light');
      localStorage.setItem('spark-ai-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('spark-ai-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
