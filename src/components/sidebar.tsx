import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { 
  Phone, 
  BarChart3, 
  Megaphone, 
  MicOff, 
  TrendingUp,
  User,
  LogOut,
  Sparkles,
  Coins,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import LanguageSwitcher from "./language-switcher";

export default function Sidebar() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const navigation = [
    { 
      name: t('common.dashboard'), 
      href: "/dashboard", 
      icon: BarChart3, 
      current: location === "/" || location === "/dashboard" || location.startsWith("/dashboard")
    },
    { 
      name: t('common.campaigns'), 
      href: "/campaigns", 
      icon: Megaphone, 
      current: location === "/campaigns" || location.startsWith("/campaign") || location.startsWith("/campaigns")
    },
    { 
      name: t('common.voices'), 
      href: "/voices", 
      icon: MicOff, 
      current: location === "/voices" || location.startsWith("/voices")
    },
    { 
      name: t('common.analytics'), 
      href: "/analytics", 
      icon: TrendingUp, 
      current: location === "/analytics" || location.startsWith("/analytics")
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-[287.27px] h-full bg-white/90 dark:bg-brand-900/90 backdrop-blur-xl border-r border-brand-200/50 dark:border-brand-800/50 flex flex-col shadow-2xl overflow-hidden">
      {/* Enhanced Brand */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-brand-200/50 dark:border-brand-800/50 bg-gradient-to-br from-brand-50/50 to-brand-100/50 dark:from-brand-900/20 dark:to-brand-800/20 min-h-[88px] flex flex-col justify-center">
        <div className="flex items-center space-x-3">
          <Logo size="sm" showText={true} />
          <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-xs sm:text-xs lg:text-sm xl:text-sm text-brand-600 dark:text-brand-400 font-medium mt-2">
          {t('navigation.aiPowered')} & Sales Automation
        </p>
      </div>

      {/* Enhanced Navigation - scrollable */}
      <nav className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-brand-500 dark:text-brand-400 uppercase tracking-wider mb-2.5">
            {t('navigation.voiceConversations')}
          </h3>
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`group relative flex items-center space-x-3 px-3.5 py-3.5 rounded-xl font-medium transition-all duration-300 cursor-pointer overflow-hidden ${
                        item.current
                          ? "bg-gradient-to-r from-brand-500/20 to-brand-400/20 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-700/50 shadow-lg"
                          : "text-brand-600 dark:text-brand-400 hover:bg-gradient-to-r hover:from-brand-100/50 hover:to-brand-200/50 dark:hover:from-brand-800/50 dark:hover:to-brand-700/50 hover:text-brand-800 dark:hover:text-brand-200"
                      }`}
                    >
                      {/* Animated background */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-brand-500/5 to-brand-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      
                      <Icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 relative z-10 ${
                        item.current ? "text-brand-600 dark:text-brand-400" : "group-hover:text-brand-600 dark:group-hover:text-brand-400"
                      }`} />
                      <span className="relative z-10">{item.name}</span>
                      
                      {/* Active indicator */}
                      {item.current && (
                        <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Enhanced User Section - Fixed at bottom */}
      <div className="flex-shrink-0 p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-t from-slate-50/50 to-transparent dark:from-slate-800/50 relative">
        <div className="space-y-4">
          {/* Theme & Language for mobile devices */}
          <div className="lg:hidden flex items-center justify-end gap-3 pb-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30 shadow-lg">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user?.email || t('common.user')}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{t('common.active')} {t('common.user')}</p>
            </div>
          </div>

          <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border shadow-md bg-white/80 dark:bg-slate-900/70 ${
            (user?.creditsBalance || 0) < 50
              ? 'border-red-200/70 dark:border-red-700/50'
              : 'border-emerald-200/70 dark:border-emerald-700/50'
          }`}>
            <div className="flex items-center space-x-2">
              <Coins className={`h-4 w-4 ${
                (user?.creditsBalance || 0) < 50 ? 'text-red-500' : 'text-emerald-600'
              }`} />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${
                (user?.creditsBalance || 0) < 50 ? 'text-red-600' : 'text-emerald-600'
              }`}>
                {user?.creditsBalance ?? 0}
              </span>
              <button
                onClick={() => setLocation('/upgrade')}
                className="p-1.5 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-all duration-300 group"
                title="Upgrade to get more credits"
              >
                <Zap className="h-4 w-4 text-yellow-500 group-hover:scale-110 group-hover:text-yellow-600 transition-all duration-300" />
              </button>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border-slate-200/50 dark:border-slate-700/50 hover:border-red-300/50 dark:hover:border-red-600/50 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300 group"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            {t('common.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
}
