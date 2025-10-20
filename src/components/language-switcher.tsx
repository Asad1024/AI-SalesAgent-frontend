import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'az', name: 'Azərbaycanca', flag: '🇦🇿' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={t('language.selectLanguage')}
        >
          <span className="text-base sm:text-lg">{currentLanguage.flag}</span>
          <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
            {currentLanguage.name}
          </span>
          <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700 dark:text-slate-300" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
