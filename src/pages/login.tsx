import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
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
  Moon,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import { authService } from '@/lib/auth';

export default function Login() {
  const { t } = useTranslation();
  const { login, user, refreshUser, googleLogin: authGoogleLogin } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
  const [setPasswordData, setSetPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showSetPasswordFields, setShowSetPasswordFields] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      setIsSuccess(true);
      
      // Redirect after success using router (no page reload)
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    } catch (error: any) {
      // Check if this is a Google-only account
      if (error.requiresGoogleAuth) {
        setShowSetPasswordDialog(true);
        setShowSetPasswordFields(false);
      } else {
        toast({
          title: t('auth.loginFailedTitle'),
          description: error.message || t('auth.emailPasswordIncorrect'),
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (setPasswordData.password.length < 6) {
      toast({
        title: t('auth.passwordTooShortTitle'),
        description: t('auth.passwordTooShortDescription'),
        variant: "destructive",
      });
      return;
    }

    if (setPasswordData.password !== setPasswordData.confirmPassword) {
      toast({
        title: t('auth.passwordsDontMatchTitle'),
        description: t('auth.passwordsDontMatchDescription'),
        variant: "destructive",
      });
      return;
    }

    setIsSettingPassword(true);
    try {
      await authService.setPassword(formData.email, setPasswordData.password, setPasswordData.confirmPassword);
      toast({
        title: t('auth.passwordSetSuccessTitle'),
        description: t('auth.passwordSetSuccessDescription'),
        variant: "default",
      });
      setShowSetPasswordDialog(false);
      setSetPasswordData({ password: '', confirmPassword: '' });
      setShowSetPasswordFields(false);
      // Auto-login after setting password
      await login(formData.email, setPasswordData.password);
      setIsSuccess(true);
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    } catch (error: any) {
      toast({
        title: t('auth.failedToSetPasswordTitle'),
        description: error.message || t('auth.failedToSetPasswordDescription'),
        variant: "destructive",
      });
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    // Set demo credentials
    setFormData({
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    try {
      await login('admin@example.com', 'admin123');
      setIsSuccess(true);
      
      // Redirect after success using router (no page reload)
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    } catch (error: any) {
      toast({
        title: t('auth.demoLoginFailedTitle'),
        description: error.message || t('auth.demoLoginFailedDescription'),
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

  // Google OAuth handler
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn('Google Client ID not configured');
      return;
    }

    // Check if script already exists
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      // Script already loaded, initialize immediately
      initializeGoogleSignIn(googleClientId);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      initializeGoogleSignIn(googleClientId);
    };

    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
    };
  }, []);

  const initializeGoogleSignIn = (clientId: string) => {
    const checkAndRender = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });

        // Render Google sign-in button
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer && buttonContainer.children.length === 0) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'en'
          });
        }
      } else {
        // Retry after a short delay
        setTimeout(checkAndRender, 100);
      }
    };
    
    checkAndRender();
  };

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true);
    try {
      // Decode the JWT token to get user info
      const tokenParts = response.credential.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      const googleData = {
        idToken: response.credential,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        googleId: payload.sub
      };

      // Check if user exists first
      const checkResult = await authService.checkGoogleUser(googleData.email, googleData.googleId);
      
      if (checkResult.exists) {
        // User exists - sign them in using auth hook (sets user state immediately)
        await authGoogleLogin(googleData);
        // Clear loading state
        setIsLoading(false);
        // Use hard redirect to ensure it works - user state is already set
        window.location.href = '/dashboard';
        return; // Exit early to prevent finally block from running
      } else {
        // User doesn't exist - redirect to signup with Google data
        const params = new URLSearchParams({
          email: googleData.email,
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          name: googleData.name || '',
          picture: googleData.picture || '',
          googleId: googleData.googleId,
          idToken: googleData.idToken || ''
        });
        setIsLoading(false);
        window.location.href = `/signup?${params.toString()}`;
        return; // Exit early to prevent finally block from running
      }
    } catch (error: any) {
      toast({
        title: t('auth.googleSignInFailedTitle'),
        description: error.message || t('auth.googleSignInFailedDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation cycle for floating elements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = [
    { icon: Phone, text: t('auth.floatingElements.aiVoiceCalls'), color: "from-purple-500 to-pink-500" },
    { icon: Bot, text: t('auth.floatingElements.smartAgents'), color: "from-blue-500 to-purple-500" },
    { icon: MessageCircle, text: t('auth.floatingElements.realTimeChat'), color: "from-blue-500 to-cyan-500" },
    { icon: TrendingUp, text: t('auth.floatingElements.analytics'), color: "from-orange-500 to-red-500" }
  ];

  const features = [
    { icon: Headphones, title: t('auth.features.voiceCloning'), description: t('auth.features.voiceCloningDesc') },
    { icon: Mic, title: t('auth.features.multiLanguage'), description: t('auth.features.multiLanguageDesc') },
    { icon: BarChart3, title: t('auth.features.analytics'), description: t('auth.features.analyticsDesc') },
    { icon: Shield, title: t('auth.features.secure'), description: t('auth.features.secureDesc') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Elements */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ease-in-out ${
                currentAnimation === index ? 'opacity-100 scale-100' : 'opacity-20 scale-75'
              }`}
              style={{
                top: `${20 + index * 15}%`,
                left: `${10 + index * 20}%`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${element.color} rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded-full backdrop-blur-sm">
                  {element.text}
                </p>
              </div>
            </div>
          );
        })}

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-6">
              {/* Enhanced Theme Toggle and Back to Home - Fixed Position */}
      <div className="fixed top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 z-50 flex space-x-1 sm:space-x-2">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300"
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-700 dark:text-slate-300" />
          </Button>
        </Link>
        <LanguageSwitcher />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/30 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-700 dark:text-slate-300" />
          ) : (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-700 dark:text-slate-300" />
          )}
        </Button>
      </div>

        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          {/* Enhanced Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4 mb-4 sm:mb-6 lg:mb-8">
              <Logo size="md" showText={false} className="sm:size-lg lg:size-xl" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold spark-gradient-text">{t('auth.title')}</h1>
                <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400">{t('auth.welcomeBack')}</p>
                <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 mt-1">{t('auth.poweredBySparkAI')}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Login Card */}
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-4 sm:p-6 lg:p-8 xl:p-10 shadow-2xl border border-white/30 dark:border-slate-700/60">
            {isSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                  {t('auth.welcomeMessage')}
                </h2>
                <p className="text-purple-600 dark:text-purple-300 mb-4">
                  {t('auth.redirectingToDashboard')}
                </p>
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              </div>
            ) : (
              <>
                {/* Card Header */}
                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{t('auth.signIn')}</h2>
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {t('auth.enterCredentials')}
                  </p>
                </div>

                {/* Enhanced Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
                  {/* Enhanced Email Field */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      {t('common.email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 lg:py-5 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base lg:text-lg placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder={t('auth.emailPlaceholder')}
                      />
                    </div>
                    {!formData.email && (
                      <div className="mt-2">
                        <span className="text-xs sm:text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                          {t('auth.pleaseFillOutField')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Password Field */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
                      {t('common.password')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 lg:py-5 border border-slate-300 dark:border-slate-600 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base lg:text-lg placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder={t('auth.passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 transition-colors duration-200" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 hover:text-slate-600 transition-colors duration-200" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-spin mr-2 sm:mr-3" />
                        <span className="text-sm sm:text-base lg:text-lg">{t('auth.signingIn')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <ArrowRight className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                        <span className="text-sm sm:text-base lg:text-lg">{t('auth.signIn')}</span>
                      </div>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t('auth.orContinueWith')}</span>
                    </div>
                  </div>

                  {/* Google Sign-In Button */}
                  <div id="google-signin-button" className="w-full"></div>
                  
                  {/* Enhanced Demo Login Button */}
                  <Button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <Sparkles className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    <span className="text-sm sm:text-base lg:text-lg">{t('auth.tryDemoAccount')}</span>
                  </Button>
                </form>

                {/* Demo Credentials Info */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-center">
                    <h4 className="text-xs sm:text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
                      {t('auth.demoCredentials')}
                    </h4>
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p><strong>{t('auth.demoEmail')}</strong> admin@example.com</p>
                      <p><strong>{t('auth.demoPassword')}</strong> admin123</p>
                    </div>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {t('auth.dontHaveAccount')}{' '}
                    <Link href="/signup" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors">
                      {t('auth.createOneHere')}
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Features Grid */}
          <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 text-center border border-white/30 dark:border-slate-700/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 group"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-base font-bold text-slate-800 dark:text-slate-200 mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Enhanced Stats */}
          <div className="mt-6 sm:mt-8 lg:mt-10 text-center">
            <div className="inline-flex items-center space-x-4 sm:space-x-6 lg:space-x-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 border border-white/30 dark:border-slate-700/60 shadow-lg">
              <div className="text-center">
                <div className="text-sm sm:text-lg lg:text-xl font-bold spark-gradient-text">10M+</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('auth.callsMade')}</div>
              </div>
              <div className="w-px h-6 sm:h-8 lg:h-10 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-sm sm:text-lg lg:text-xl font-bold spark-gradient-text">500+</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('auth.customers')}</div>
              </div>
              <div className="w-px h-6 sm:h-8 lg:h-10 bg-slate-300 dark:bg-slate-600"></div>
              <div className="text-center">
                <div className="text-sm sm:text-lg lg:text-xl font-bold spark-gradient-text">95+</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{t('auth.languages')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Password Dialog for Google-only accounts */}
      <Dialog open={showSetPasswordDialog} onOpenChange={setShowSetPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('auth.setPasswordDialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('auth.setPasswordDialogDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {!showSetPasswordFields ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('auth.wouldYouLikeToSetPassword')} <strong>{formData.email}</strong>?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSetPasswordFields(true)}
                  className="flex-1"
                >
                  {t('auth.setPassword')}
                </Button>
                <Button
                  onClick={() => setShowSetPasswordDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  {t('auth.useGoogleSignIn')}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('auth.newPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={setPasswordData.password}
                    onChange={(e) => setSetPasswordData({ ...setPasswordData, password: e.target.value })}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('auth.enterNewPassword')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('common.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={setPasswordData.confirmPassword}
                    onChange={(e) => setSetPasswordData({ ...setPasswordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={t('auth.confirmNewPassword')}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isSettingPassword}
                  className="flex-1"
                >
                  {isSettingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('auth.settingPassword')}
                    </>
                  ) : (
                    t('auth.setPasswordAndSignIn')
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowSetPasswordFields(false);
                    setSetPasswordData({ password: '', confirmPassword: '' });
                  }}
                  variant="outline"
                  disabled={isSettingPassword}
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 