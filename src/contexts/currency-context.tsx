import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Exchange rate relative to USD
}

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencies: Currency[] = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    flag: '🇺🇸',
    rate: 1.0
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    flag: '🇦🇪',
    rate: 3.67
  },
  {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    flag: '🇹🇷',
    rate: 30.5
  }
];

// Language to currency mapping
const languageToCurrency: Record<string, string> = {
  'en': 'USD',
  'tr': 'TRY',
  'ar': 'AED'
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  // Auto-change currency based on language
  useEffect(() => {
    const currentLanguage = i18n.language;
    const currencyCode = languageToCurrency[currentLanguage] || 'USD';
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
    setSelectedCurrency(currency);
  }, [i18n.language]);

  const formatPrice = (price: number): string => {
    const convertedPrice = Math.round(price * selectedCurrency.rate);
    return `${selectedCurrency.symbol}${convertedPrice.toLocaleString()}`;
  };

  const value: CurrencyContextType = {
    selectedCurrency,
    setSelectedCurrency,
    formatPrice
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export { currencies };
export type { Currency };
