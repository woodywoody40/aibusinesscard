import React from 'react';
import { Theme } from '../types';
import { Icon } from './Icon';

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:text-light-primary dark:hover:text-dark-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-primary focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <div className={`absolute transition-transform duration-500 ease-in-out ${theme === Theme.Light ? 'transform -translate-y-full' : 'transform translate-y-0'}`}>
           <Icon icon="sun" className="w-6 h-6 text-light-primary" />
        </div>
        <div className={`absolute transition-transform duration-500 ease-in-out ${theme === Theme.Light ? 'transform translate-y-0' : 'transform translate-y-full'}`}>
           <Icon icon="moon" className="w-6 h-6 text-dark-primary" />
        </div>
      </div>
    </button>
  );
};