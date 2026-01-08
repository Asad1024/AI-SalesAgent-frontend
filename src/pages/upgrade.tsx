import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/sidebar';
import ThemeToggle from '@/components/theme-toggle';
import LanguageSwitcher from '@/components/language-switcher';
import { Menu, Check, Zap, Rocket, Crown, Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UpgradePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const packages = [
    { name: 'Basic', price: '12,000', period: 'One-time', highlighted: false, features: ['1 Seat', '500 Credits', 'Email Support'], icon: Zap, buttonText: 'Get Started' },
    { name: 'Essential', price: '1,500', period: '/Month', highlighted: false, features: ['2 Seats', '500 Credits/Seat', 'Email Support'], icon: Rocket, buttonText: 'Subscribe' },
    { name: 'Premium', price: '3,000', period: '/Month', highlighted: true, features: ['3 Seats', '2,500 Credits', 'Priority Support'], icon: Crown, buttonText: 'Subscribe' },
  ];

  const handleUpgradePlan = (plan: string) => {
    toast({ title: `${plan} Plan Selected`, description: `You selected the ${plan} plan. Payment integration coming soon.` });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-2.5 overflow-hidden min-h-[88px] flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <defs>
                <pattern id="upgrade-header-pattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                  <circle cx="35" cy="35" r="2" fill="currentColor" className="text-purple-500"/>
                  <path d="M35 0L35 30M0 35L30 35M35 35L35 65M40 35L70 35" stroke="currentColor" strokeWidth="1" className="text-purple-400"/>
                  <circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-purple-300"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#upgrade-header-pattern)"/>
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-4 right-28 w-5 h-5 bg-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-28 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center space-x-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 hover:text-white transition-all duration-300">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[287.27px] p-0 bg-white/95 dark:bg-brand-900/95 backdrop-blur-sm sm:backdrop-blur-xl">
                  <Sidebar />
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="hover:bg-brand-100 dark:hover:bg-brand-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div>
                <h2 className="text-3xl font-bold text-black dark:text-black spark-gradient-text">Upgrade Your Plan</h2>
                <p className="text-black dark:text-black mt-2">Get more credits and unlock premium features</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 pb-4">
            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 items-stretch">
              {packages.map((pkg, idx) => {
                const Icon = pkg.icon;
                return (
                  <div key={idx} className={`rounded-xl transition-shadow duration-300 flex flex-col h-full ${pkg.highlighted ? 'bg-white dark:bg-slate-800 shadow-xl ring-2 ring-brand-500 relative overflow-visible' : 'bg-white dark:bg-slate-800 shadow-lg overflow-hidden'}`}>
                    {pkg.highlighted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <span className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap">MOST POPULAR</span>
                      </div>
                    )}
                    <div className={`p-6 sm:p-8 flex-1 flex flex-col`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-lg ${pkg.highlighted ? 'bg-brand-100 dark:bg-brand-900' : 'bg-slate-100 dark:bg-slate-700'}`}>
                          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${pkg.highlighted ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400'}`} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                      </div>
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{pkg.price}</span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium">AED</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2 font-medium">{pkg.period}</p>
                      </div>
                      <ul className="space-y-3 mb-6 sm:mb-8 flex-1">
                        {pkg.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-center gap-3">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button onClick={() => handleUpgradePlan(pkg.name)} className={`w-full py-2.5 sm:py-3 font-semibold transition-all duration-300 rounded-lg ${pkg.highlighted ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white'}`}>
                        {pkg.buttonText}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add-ons */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">Add-Ons</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Customize your plan with additional options</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                  <p className="font-bold text-slate-900 dark:text-white">Extra Seat</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">500 AED</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">+ 750 Credits per month</p>
                </div>
                <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                  <p className="font-bold text-slate-900 dark:text-white">Credit Recharge</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">0.92 AED</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Per minute of call time</p>
                </div>
              </div>
            </div>

            {/* Contact Sales */}
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200 dark:border-brand-800 rounded-xl p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-md">
                  <Mail className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Need Custom Solutions?</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6 max-w-2xl mx-auto">Our sales team is here to help you find the perfect plan for your business. Get personalized recommendations and custom pricing.</p>
              <Button onClick={() => window.open('mailto:sales@sparkai.com', '_blank')} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-2 rounded-lg">Contact Sales Team</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
