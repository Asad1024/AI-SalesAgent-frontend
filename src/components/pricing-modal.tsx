import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { X, Check, Zap, Crown, Rocket } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { t } = useTranslation();

  const handlePaymentRedirect = (plan: string) => {
    window.open('https://calendly.com/insyncinternational/payment', '_blank');
    onClose();
  };

  const packages = [
    {
      name: 'Basic',
      price: '12,000',
      period: 'One-time',
      highlighted: false,
      features: ['1 Seat', '500 Minutes', 'Email Support'],
      icon: Zap,
      buttonText: 'Get Started',
    },
    {
      name: 'Essential',
      price: '1,500',
      period: '/Month',
      highlighted: false,
      features: ['2 Seats', '500 Minutes/Seat', 'Email Support'],
      icon: Rocket,
      buttonText: 'Subscribe',
    },
    {
      name: 'Premium',
      price: '3,000',
      period: '/Month',
      highlighted: true,
      features: ['3 Seats', '2,500 Minutes', 'Priority Support'],
      icon: Crown,
      buttonText: 'Subscribe',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl p-0 gap-0 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </button>

        {/* Header */}
        <div className="px-4 sm:px-6 py-6 border-b border-slate-200 dark:border-slate-700 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Choose Your Plan
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upgrade to get more minutes and unlock premium features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {packages.map((pkg, idx) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-lg transition-all relative ${
                    pkg.highlighted
                      ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-2 border-purple-500 shadow-lg'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {pkg.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Icon & Name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 rounded-lg ${pkg.highlighted ? 'bg-purple-100 dark:bg-purple-900/50' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                        <Icon className={`w-4 h-4 ${pkg.highlighted ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{pkg.price}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">AED{pkg.period}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={() => handlePaymentRedirect(pkg.name)}
                      className={`w-full py-2 mb-4 rounded-lg text-sm font-semibold transition-all ${
                        pkg.highlighted
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                      }`}
                    >
                      {pkg.buttonText}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-2">
                      {pkg.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Add-ons</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Extra Seat</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">500 AED</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">+ 750 Minutes</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Minutes Recharge</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">0.92 AED</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">per minute</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-900/10 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Questions? <a href="mailto:sales@sparkai.com" className="text-blue-600 dark:text-blue-400 font-semibold">Contact sales</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
