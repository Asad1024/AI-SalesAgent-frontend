import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  Bot, 
  MessageCircle, 
  TrendingUp, 
  Zap,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Mail,
  Lock,
  User,
  Shield,
  Star,
  Globe,
  Headphones,
  Mic,
  BarChart3,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';

export default function Signup() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.confirmPassword);
      setIsSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Animation cycle for floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = [
    { icon: Phone, text: t('signup.floatingElements.aiVoiceCalls'), color: "from-blue-500 to-purple-500" },
    { icon: Bot, text: t('signup.floatingElements.smartAgents'), color: "from-blue-500 via-purple-500 to-purple-600" },
    { icon: MessageCircle, text: t('signup.floatingElements.realTimeChat'), color: "from-blue-500 to-purple-500" },
    { icon: TrendingUp, text: t('signup.floatingElements.analytics'), color: "from-blue-500 to-purple-500" },
  ];

  const features = [
    { icon: Zap, text: t('signup.features.lightningFastSetup') },
    { icon: Shield, text: t('signup.features.enterpriseSecurity') },
    { icon: Globe, text: t('signup.features.multiLanguageSupport') },
    { icon: BarChart3, text: t('signup.features.advancedAnalytics') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          const isActive = currentAnimation === index;
          return (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ${
                isActive ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
              style={{
                top: `${20 + index * 20}%`,
                left: `${10 + index * 25}%`,
                transform: isActive ? 'translateY(-10px)' : 'translateY(0)',
              }}
            >
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${element.color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
                <p className="text-xs mt-1 font-medium">{element.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Header */}
      <div className="relative z-10 flex justify-between items-center p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Logo size="sm" showText={true} className="sm:size-md lg:size-lg" />
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 shadow-lg transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-2xl border border-white/30 dark:border-slate-700/60 p-4 sm:p-6 lg:p-8 xl:p-10">
            {!isSuccess ? (
              <>
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t('signup.title')}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {t('signup.subtitle')}
                  </p>
                </div>

                {/* Enhanced Form */}
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
                  {/* Enhanced Email */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      {t('signup.emailLabel')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 lg:py-5 border border-slate-200 dark:border-slate-600 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base lg:text-lg"
                        placeholder={t('signup.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Enhanced Password */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      {t('signup.passwordLabel')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 lg:py-5 border border-slate-200 dark:border-slate-600 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base lg:text-lg"
                        placeholder={t('signup.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Confirm Password */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      {t('signup.confirmPasswordLabel')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 lg:py-5 border border-slate-200 dark:border-slate-600 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base lg:text-lg"
                        placeholder={t('signup.confirmPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base lg:text-lg shadow-xl hover:shadow-2xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 animate-spin" />
                        <span className="text-sm sm:text-base lg:text-lg">{t('signup.creatingAccount')}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm sm:text-base lg:text-lg">{t('signup.createAccount')}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {t('signup.alreadyHaveAccount')}{' '}
                    <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                      {t('signup.signInHere')}
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('signup.accountCreated')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {t('signup.welcomeMessage')}
                </p>
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Features Grid */}
          <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 border border-white/30 dark:border-slate-700/60 text-center overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 group"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <pattern id={`signup-pattern-${index}`} x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                          <circle cx="12.5" cy="12.5" r="1" fill="currentColor" className="text-blue-500"/>
                          <path d="M12.5 0L12.5 10M0 12.5L10 12.5M12.5 12.5L12.5 22.5M15 12.5L25 12.5" stroke="currentColor" strokeWidth="0.5" className="text-purple-400"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#signup-pattern-${index})`}/>
                    </svg>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl mb-2 sm:mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
