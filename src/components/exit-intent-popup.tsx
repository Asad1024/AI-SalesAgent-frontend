import React, { useState, useEffect } from 'react';
import { X, Clock, Gift, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface ExitIntentPopupProps {
  onClose: () => void;
}

export default function ExitIntentPopup({ onClose }: ExitIntentPopupProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Email captured:', email);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border border-slate-200 dark:border-slate-700">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            {t('exitIntent.success.title')}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t('exitIntent.success.message')}
          </p>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            {t('exitIntent.success.button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-200 dark:border-slate-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Timer */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {t('exitIntent.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t('exitIntent.subtitle')}
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-purple-500" />
              <span className="text-slate-700 dark:text-slate-300">{t('exitIntent.benefits.save')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-purple-500" />
              <span className="text-slate-700 dark:text-slate-300">{t('exitIntent.benefits.setup')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-purple-500" />
              <span className="text-slate-700 dark:text-slate-300">{t('exitIntent.benefits.trial')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-purple-500" />
              <span className="text-slate-700 dark:text-slate-300">{t('exitIntent.benefits.guarantee')}</span>
            </div>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t('exitIntent.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder={t('exitIntent.emailPlaceholder')}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 text-lg font-semibold"
          >
            {t('exitIntent.claimButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
          {t('exitIntent.privacy')}
        </p>
      </div>
    </div>
  );
}
