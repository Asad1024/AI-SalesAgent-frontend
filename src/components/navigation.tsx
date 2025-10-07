import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from './language-switcher';
import Logo from './logo';
import CurrencySwitcher from './currency-switcher';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location === '/' || location === '/home';
    }
    if (path === '/#benefits' || path === '/#pricing') {
      return location === path;
    }
    return location === path;
  };

  const navigationItems = [
    // { name: t('navigation.home'), path: '/' },
    // { name: 'Home Option 1', path: '/home-option1' },
    // { name: 'Home Option 2', path: '/home-option2' },
    // { name: t('navigation.benefits'), path: '/#benefits' },
    // { name: t('navigation.pricing'), path: '/#pricing' },
    { name: t('navigation.about'), path: '/about' },
    { name: t('navigation.contact'), path: '/contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer">
              <Logo size="md" showText={true} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              item.path.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.path}
                  className={`transition-colors ${
                    isActive(item.path)
                      ? 'text-purple-600 dark:text-purple-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`transition-colors ${
                    isActive(item.path)
                      ? 'text-purple-600 dark:text-purple-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Currency Switcher */}
            {/* <CurrencySwitcher /> */}
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              ) : (
                <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
              )}
            </Button>
            
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400">
                {t('navigation.signIn')}
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                Try for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

                      {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Language Switcher for Mobile */}
              <LanguageSwitcher />
              
              {/* Theme Toggle for Mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-10 h-10 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                item.path.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                    {t('navigation.signIn')}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Try for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
