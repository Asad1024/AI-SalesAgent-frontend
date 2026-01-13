import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference - use unified key 'spark-ai-theme'
    const savedTheme = localStorage.getItem('spark-ai-theme') || localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      // Sync with unified key
      localStorage.setItem('spark-ai-theme', 'dark');
    } else {
      // Default to light mode on first load
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      // Sync with unified key
      localStorage.setItem('spark-ai-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('spark-ai-theme', 'dark');
      // Keep old key for backward compatibility
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('spark-ai-theme', 'light');
      // Keep old key for backward compatibility
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md border border-brand-200 bg-white hover:bg-brand-50 dark:border-brand-800 dark:bg-brand-900 dark:hover:bg-brand-800 transition-all duration-300"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-brand-600 dark:text-brand-400" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-brand-400 dark:text-brand-200" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
