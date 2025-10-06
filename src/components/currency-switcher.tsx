import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency, currencies, Currency } from '@/contexts/currency-context';

interface CurrencySwitcherProps {
  className?: string;
}

export default function CurrencySwitcher({ className = '' }: CurrencySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm"
      >
        <span className="text-lg">{selectedCurrency.flag}</span>
        <span className="font-medium">{selectedCurrency.code}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20">
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
                Select Currency
              </div>
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency)}
                  className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md text-sm transition-colors ${
                    selectedCurrency.code === currency.code
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg">{currency.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{currency.name}</div>
                  </div>
                  <span className="text-sm font-medium">{currency.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

