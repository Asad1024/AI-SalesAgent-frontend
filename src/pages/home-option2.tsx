import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import ComingSoonModal from '@/components/coming-soon-modal';
import { 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Sparkles, 
  Bot, 
  Target, 
  Mic, 
  Headphones, 
  Clock, 
  BarChart3, 
  Settings, 
  Globe, 
  Shield, 
  Star, 
  Languages, 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  MicOff,
  CheckCircle,
  ArrowRight,
  Play,
  ChevronRight,
  Building2,
  Heart,
  ShoppingCart,
  GraduationCap,
  Car,
  Scale,
  Utensils,
  Briefcase,
  Calendar,
  Sun,
  Moon,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Video,
  Radio,
  Activity,
  Cpu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import BackToTop from '@/components/back-to-top';
import CalendlyScheduling from '@/components/calendly-scheduling';
import AIDemoCall from '@/components/ai-demo-call';
import AIDemoCallMinimal from '@/components/ai-demo-call-minimal';
import VideoDemoSection from '@/components/video-demo-section';

// Animated Background Components
const VoiceWaveAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-20">
      <div className="w-full h-full border-2 border-blue-500 rounded-full animate-pulse"></div>
      <div className="absolute top-2 left-2 w-28 h-28 border-2 border-purple-500 rounded-full animate-ping"></div>
      <div className="absolute top-4 left-4 w-24 h-24 border-2 border-blue-400 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute top-3/4 right-1/4 w-24 h-24 opacity-15">
      <div className="w-full h-full border-2 border-purple-500 rounded-full animate-ping"></div>
      <div className="absolute top-2 left-2 w-20 h-20 border-2 border-blue-500 rounded-full animate-pulse"></div>
    </div>
    <div className="absolute top-1/2 right-1/3 w-16 h-16 opacity-25">
      <div className="w-full h-full border-2 border-blue-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1 left-1 w-14 h-14 border-2 border-purple-400 rounded-full animate-ping"></div>
    </div>
  </div>
);

const AIParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      >
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-60"></div>
      </div>
    ))}
    {[...Array(5)].map((_, i) => (
      <div
        key={`icon-${i}`}
        className="absolute animate-float-slow opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${6 + Math.random() * 3}s`
        }}
      >
        {i % 3 === 0 && <Mic className="w-4 h-4 text-blue-500" />}
        {i % 3 === 1 && <Radio className="w-4 h-4 text-purple-500" />}
        {i % 3 === 2 && <Activity className="w-4 h-4 text-blue-400" />}
      </div>
    ))}
  </div>
);

const SoundWaveAnimation = () => (
  <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
    <div className="flex items-end justify-center space-x-1 h-full">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-blue-500 to-purple-500 opacity-30 animate-sound-wave"
          style={{
            width: '3px',
            height: `${20 + Math.random() * 40}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.5s'
          }}
        ></div>
      ))}
    </div>
  </div>
);

export default function HomeOption2() {
  const { t } = useTranslation();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Video control functions
  const toggleVideo = () => {
    if (videoRef) {
      if (videoRef.paused) {
        videoRef.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !videoRef.muted;
      setIsVideoMuted(videoRef.muted);
    }
  };

  const handleVideoRef = (element: HTMLVideoElement | null) => {
    setVideoRef(element);
    if (element) {
      element.addEventListener('play', () => setIsVideoPlaying(true));
      element.addEventListener('pause', () => setIsVideoPlaying(false));
    }
  };

  // Animation observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.text-reveal, .team-card, .fade-in-up, .fade-in-left, .fade-in-right, .fade-in-scale');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const industries = [
    { name: t('home.industries.healthcare'), icon: Heart, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.ecommerce'), icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.realEstate'), icon: Building2, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.education'), icon: GraduationCap, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.automotive'), icon: Car, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.legal'), icon: Scale, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.restaurant'), icon: Utensils, color: 'from-blue-500 to-purple-500' },
    { name: t('home.industries.services'), icon: Briefcase, color: 'from-blue-500 to-purple-500' }
  ];

  const solutions = [
    {
      icon: MessageCircle,
      title: t('home.solutions.customerSupport.title'),
      description: t('home.solutions.customerSupport.description'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Target,
      title: t('home.solutions.leadQualification.title'),
      description: t('home.solutions.leadQualification.description'),
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: t('home.solutions.salesAutomation.title'),
      description: t('home.solutions.salesAutomation.description'),
      color: 'from-blue-500 to-purple-500'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: t('home.features.availability.title'),
      description: t('home.features.availability.description')
    },
    {
      icon: Zap,
      title: t('home.features.lightningFast.title'),
      description: t('home.features.lightningFast.description')
    },
    {
      icon: Users,
      title: t('home.features.scalableTeam.title'),
      description: t('home.features.scalableTeam.description')
    },
    {
      icon: BarChart3,
      title: t('home.features.dataDriven.title'),
      description: t('home.features.dataDriven.description')
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: t('home.features.uploadData.title'),
      description: t('home.features.uploadData.description')
    },
    {
      step: '2',
      title: t('home.features.trainAi.title'),
      description: t('home.features.trainAi.description')
    },
    {
      step: '3',
      title: t('home.features.goLive.title'),
      description: t('home.features.goLive.description')
    }
  ];

  const pricingPlans = [
    {
      name: t('home.pricingPlans.essential.name'),
      price: t('home.pricingPlans.essential.price'),
      period: t('home.pricingPlans.essential.period'),
      description: t('home.pricingPlans.essential.description'),
      features: [
        t('home.pricingPlans.essential.features.monitoring'),
        t('home.pricingPlans.essential.features.tweaks'),
        t('home.pricingPlans.essential.features.rollover'),
        t('home.pricingPlans.essential.features.report'),
        t('home.pricingPlans.essential.features.email')
      ],
      cta: t('home.pricingPlans.essential.cta'),
      popular: false
    },
    {
      name: t('home.pricingPlans.premium.name'),
      price: t('home.pricingPlans.premium.price'),
      period: t('home.pricingPlans.premium.period'),
      description: t('home.pricingPlans.premium.description'),
      features: [
        t('home.pricingPlans.premium.features.everything'),
        t('home.pricingPlans.premium.features.optimization'),
        t('home.pricingPlans.premium.features.strategy'),
        t('home.pricingPlans.premium.features.priority'),
        t('home.pricingPlans.premium.features.earlyAccess'),
        t('home.pricingPlans.premium.features.notice')
      ],
      cta: t('home.pricingPlans.premium.cta'),
      popular: true,
      limited: false
    }
  ];

  const testimonials = [
    {
      name: t('home.testimonials.sarah.name'),
      role: 'CEO, TechStart Inc.',
      content: t('home.testimonials.sarah.content'),
      avatar: 'SJ',
      rating: 5,
      image: '/images/testimonial-1.jpg'
    },
    {
      name: t('home.testimonials.michael.name'),
      role: t('home.testimonials.michael.role'),
      content: t('home.testimonials.michael.content'),
      avatar: 'MC',
      rating: 5,
      image: '/images/testimonial-2.jpg'
    },
    {
      name: t('home.testimonials.emily.name'),
      role: t('home.testimonials.emily.role'),
      content: t('home.testimonials.emily.content'),
      avatar: 'ER',
      rating: 5,
      image: '/images/testimonial-3.jpg'
    }
  ];

  const demoCalls = [
    {
      title: t('home.demos.customerSupport.title'),
      description: t('home.demos.customerSupport.description'),
      industry: 'E-commerce',
      duration: '2:30',
      icon: MessageCircle
    },
    {
      title: t('home.demos.appointmentBooking.title'),
      description: t('home.demos.appointmentBooking.description'),
      industry: t('home.demos.appointmentBooking.industry'),
      duration: '1:45',
      icon: Calendar
    },
    {
      title: t('home.demos.salesQualification.title'),
      description: t('home.demos.salesQualification.description'),
      industry: 'Real Estate',
      duration: '3:15',
      icon: Target
    }
  ];

  const faqs = [
    {
      question: t('home.faqs.howItWorks.question'),
      answer: t('home.faqs.howItWorks.answer')
    },
    {
      question: t('home.faqs.customization.question'),
      answer: t('home.faqs.customization.answer')
    },
    {
      question: t('home.faqs.languages.question'),
      answer: t('home.faqs.languages.answer')
    },
    {
      question: t('home.faqs.pricing.question'),
      answer: t('home.faqs.pricing.answer')
    },
    {
      question: t('home.faqs.freeTrial.question'),
      answer: t('home.faqs.freeTrial.answer')
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 scroll-smooth relative overflow-hidden">
      {/* Smart Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs - Brand Colors Only */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        
        {/* Floating Elements - Brand Colors */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-500 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-brand-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-brand-600 rounded-full animate-bounce opacity-60" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-brand-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '3s'}}></div>
      </div>
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 shadow-lg dark:shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <Logo size="sm" showText={true} className="sm:size-md" />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </Button>
              <div className="flex space-x-1 sm:space-x-2">
                {user ? (
                  <>
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      onClick={async () => {
                        try {
                          console.log('Logout button clicked');
                          await logout();
                          console.log('Logout successful');
                          toast({
                            title: t('auth.logoutSuccessMessage'),
                            description: t('auth.logoutSuccessDescription'),
                          });
                          // Force page reload to ensure state is cleared
                          window.location.reload();
                        } catch (error) {
                          console.error('Logout error:', error);
                          toast({
                            title: "Logout Error",
                            description: "There was an error logging out. Please try again.",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      {t('common.logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="text-xs sm:text-sm px-2 sm:px-3 py-2">{t('common.login')}</Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2">
                        {t('common.register')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Main fold */}
      <section id="hero" className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden min-h-screen flex items-center">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '4s'}}></div>
          
        </div>
        <VoiceWaveAnimation />
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in-scale">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current animate-fade-in-scale animate-delay-${(i + 1) * 100}`} />
              ))}
            </div>
            
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 animate-fade-in-up leading-tight px-4">
              {t('home.hero.title')}
            </h1>
            
            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-200 px-4 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 animate-fade-in-up animate-delay-400">
              <Link href="/login">
              <Button 
                size="lg" 
                  className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:via-brand-700 hover:to-brand-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg animate-voice-pulse w-full sm:w-auto max-w-xs sm:max-w-none"
              >
                {t('home.hero.startFreeTrial')}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg w-full sm:w-auto max-w-xs sm:max-w-none"
                onClick={() => {
                  const element = document.getElementById('consultation');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {t('home.hero.bookDemo')}
              </Button>
            </div>
            
          </div>
        </div>
      </section>

      {/* Missed Calls = Missed Revenue */}
      <section id="problem" className="relative py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-25 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 min-h-screen flex items-center">
        {/* Smart Problem Section Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Problem vs Solution Graphics - Brand Colors */}
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/3 w-28 sm:w-36 h-28 sm:h-36 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Problem Icons - Brand Colors */}
          <div className="absolute top-20 sm:top-32 left-20 sm:left-32 w-4 h-4 sm:w-6 sm:h-6 text-brand-500 opacity-20 animate-bounce">
            <X className="w-full h-full" />
          </div>
          <div className="absolute top-32 sm:top-48 right-32 sm:right-48 w-6 h-6 sm:w-8 sm:h-8 text-brand-400 opacity-20 animate-bounce" style={{animationDelay: '1s'}}>
            <CheckCircle className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 sm:bottom-32 left-32 sm:left-48 w-5 h-5 sm:w-7 sm:h-7 text-brand-600 opacity-20 animate-bounce" style={{animationDelay: '2s'}}>
            <TrendingUp className="w-full h-full" />
          </div>
          
          {/* Data Visualization Elements - Brand Colors */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-brand-500 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-brand-400 rounded-full opacity-30 animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-brand-600 rounded-full opacity-30 animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
              {t('home.problem.tag')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight px-4">
              {t('home.problem.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto px-4 leading-relaxed">
              {t('home.problem.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Problem Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('home.problem.problemTitle')}</h3>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
                {t('home.problem.problemDescription')}
              </p>
              
              <div className="space-y-4 mb-8">
                {(t('home.problem.problems', { returnObjects: true }) as string[]).map((problem: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">{problem}</span>
                  </div>
                ))}
              </div>

              {/* Problem Cards */}
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg dark:shadow-2xl transform rotate-1 sm:rotate-2 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.problemCards.outOfHours')}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-red-500">7</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg dark:shadow-2xl transform -rotate-1 sm:-rotate-1 mt-2 sm:mt-4 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.problemCards.unqualified')}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-red-500">32</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg dark:shadow-2xl transform rotate-1 -mt-1 sm:-mt-2 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.problemCards.canceledTasks')}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-red-500">12</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg dark:shadow-2xl transform -rotate-1 sm:-rotate-2 mt-1 sm:mt-2 border dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                      <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.problemCards.missedCalls')}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-red-500">7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{t('home.problem.solutionTitle')}</h3>
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8">
                {t('home.problem.solutionDescription')}
              </p>
              
              <div className="space-y-4 mb-8">
                {(t('home.problem.solutions', { returnObjects: true }) as string[]).map((solution: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">
                      {solution}
                    </span>
                  </div>
                ))}
              </div>

              {/* Solution Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.solutionCards.availability')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">✓</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.solutionCards.qualifiedLeads')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">41</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.solutionCards.freedUpTasks')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">17</div>
                </div>
                <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm/80 dark:backdrop-blur-sm rounded-xl p-4 shadow-lg dark:shadow-2xl dark:shadow-2xl border dark:border-slate-700/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('home.problem.solutionCards.noMissedCalls')}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Social Proof */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-reveal">{t('home.companies.trustedBy')}</p>
          </div>
          
          {/* Running Logo Animation */}
          <div className="logo-container">
            <div className="logo-scroll">
              {/* First set of logos */}
              {[
                { name: 'Matchify', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Matchify%20Logo%20%281%29.png' },
                { name: 'Strique', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Strique%20Logo%20%281%29.png' },
                { name: 'JonEast', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/JonEast%20Logo%20%281%29.png' },
                { name: 'Jon Technologies', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Jon%20Technologies%20Logo%20%281%29.png' },
                { name: 'Incubytes', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Incubytes%20Logo%20%281%29.png' },
                { name: 'Innovations Group', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Innovations%20Group%20Logo%20%281%29.png' },
                { name: 'ilmyst', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/ilmyst%20Logo%20%281%29.png' },
                { name: 'Dynamic World Computers', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Dynamic%20World%20Computers%20Logo%20%281%29.png' },
                { name: 'Shiva IT Distributors', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Shiva%20IT%20Distributors%20Logo%20%281%29.png' },
                { name: 'Box Office Events', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Box%20Office%20Events%20Logo%20%281%29.png' },
                { name: 'OM Computer', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/OM%20Computer%20%281%29.png' },
                { name: 'Winjoy', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Winjoy%20Logo%20%281%29.png' },
                { name: 'Smart Choice', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Smart%20Choice%20Logo%20%281%29.png' }
              ].map((logo, index) => (
                <div key={`first-${index}`} className="logo-item w-32 h-20 bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50 opacity-70 hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80">
                  <img src={logo.src} alt={logo.name} className="h-10 max-w-24 object-contain filter drop-shadow-sm" />
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'Matchify', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Matchify%20Logo%20%281%29.png' },
                { name: 'Strique', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Strique%20Logo%20%281%29.png' },
                { name: 'JonEast', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/JonEast%20Logo%20%281%29.png' },
                { name: 'Jon Technologies', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Jon%20Technologies%20Logo%20%281%29.png' },
                { name: 'Incubytes', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Incubytes%20Logo%20%281%29.png' },
                { name: 'Innovations Group', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Innovations%20Group%20Logo%20%281%29.png' },
                { name: 'ilmyst', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/ilmyst%20Logo%20%281%29.png' },
                { name: 'Dynamic World Computers', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Dynamic%20World%20Computers%20Logo%20%281%29.png' },
                { name: 'Shiva IT Distributors', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Shiva%20IT%20Distributors%20Logo%20%281%29.png' },
                { name: 'Box Office Events', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Box%20Office%20Events%20Logo%20%281%29.png' },
                { name: 'OM Computer', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/OM%20Computer%20%281%29.png' },
                { name: 'Winjoy', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Winjoy%20Logo%20%281%29.png' },
                { name: 'Smart Choice', src: 'https://hazziassets.blr1.cdn.digitaloceanspaces.com/spark/assets/Smart%20Choice%20Logo%20%281%29.png' }
              ].map((logo, index) => (
                <div key={`second-${index}`} className="logo-item w-32 h-20 bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50 opacity-70 hover:opacity-100 hover:shadow-2xl hover:scale-110 transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80">
                  <img src={logo.src} alt={logo.name} className="h-10 max-w-24 object-contain filter drop-shadow-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              {t('home.solutionsSection.tag')}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              {t('home.solutionsSection.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              {t('home.solutionsSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div key={index} className={`group relative text-center animate-fade-in-scale animate-delay-${(index + 1) * 200} h-full`}>
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex-1 flex flex-col">
                      <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${solution.color} rounded-2xl mb-6 animate-fade-in-scale animate-delay-300 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {solution.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500 leading-relaxed flex-1">
                        {solution.description}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-brand-25 via-brand-50 to-brand-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden min-h-screen flex items-center">
        {/* Smart Benefits Graphics */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Benefits Gradient Orbs - Brand Colors */}
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-brand-400 to-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-gradient-to-r from-brand-300 to-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
          
          {/* Benefits Icons - Brand Colors */}
          <div className="absolute top-20 left-20 w-8 h-8 text-brand-500 opacity-20 animate-float-slow">
            <Clock className="w-full h-full" />
          </div>
          <div className="absolute top-32 right-20 w-6 h-6 text-brand-400 opacity-20 animate-float-slow" style={{animationDelay: '1s'}}>
            <Zap className="w-full h-full" />
          </div>
          <div className="absolute bottom-20 left-20 w-7 h-7 text-brand-600 opacity-20 animate-float-slow" style={{animationDelay: '2s'}}>
            <Users className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 right-32 w-5 h-5 text-brand-300 opacity-20 animate-float-slow" style={{animationDelay: '3s'}}>
            <BarChart3 className="w-full h-full" />
          </div>
          
          {/* Geometric Benefits Shapes - Brand Colors */}
          <div className="absolute top-1/3 left-1/3 w-16 h-16 border-2 border-brand-300 rounded-lg rotate-45 opacity-10 animate-spin-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 border-2 border-brand-400 rounded-full opacity-10 animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/2 w-20 h-20 border-2 border-brand-500 rounded-lg rotate-12 opacity-10 animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              {t('home.benefitsSection.tag')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-brand-600 via-brand-700 to-brand-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200 px-4">
              {t('home.benefitsSection.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400 px-4">
              {t('home.benefitsSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className={`group relative animate-fade-in-up animate-delay-${(index + 1) * 150}`}>
                  <div className="relative p-6 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-slate-200 dark:border-slate-700/50 overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    <div className="relative flex-1 flex flex-col">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-fade-in-scale animate-delay-300 group-hover:rotate-12 transition-transform duration-300 shadow-lg dark:shadow-2xl">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-center">
                        {benefit.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm animate-fade-in-right animate-delay-500 leading-relaxed text-center flex-1">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <AIParticles />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M40%2040c0-11-9-20-20-20s-20%209-20%2020%209%2020%2020%2020%2020-9%2020-20zm20%200c0-11-9-20-20-20s-20%209-20%2020%209%2020%2020%2020%2020-9%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              {t('home.howItWorks.tag')}
            </div>
            
            {/* Video Section */}
            <div className="mb-8 animate-fade-in-up animate-delay-100">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative bg-white dark:bg-slate-800/90 rounded-2xl shadow-2xl dark:shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
                  <video 
                    ref={handleVideoRef}
                    className="w-full h-auto max-h-96 object-cover"
                    poster="/images/video-poster.jpg"
                    autoPlay
                    muted
                    loop
                    preload="metadata"
                  >
                    <source src="https://res.cloudinary.com/domnocrwi/video/upload/v1760974827/AI_Calling_Agent_snzybl.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Custom Play/Pause Button Overlay */}
                  {!isVideoPlaying && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-300 cursor-pointer group"
                      onClick={toggleVideo}
                    >
                      <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Pause Button (when video is playing) */}
                  {isVideoPlaying && (
                    <div 
                      className="absolute top-4 right-4 cursor-pointer group"
                      onClick={toggleVideo}
                    >
                      <div className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Mute/Unmute Button */}
                  {isVideoPlaying && (
                    <div 
                      className="absolute top-4 left-4 cursor-pointer group"
                      onClick={toggleMute}
                    >
                      <div className="w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {isVideoMuted ? (
                          // Muted icon (speaker with X)
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                          </svg>
                        ) : (
                          // Unmuted icon (speaker with sound waves)
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Video Description */}
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
                  Watch how our AI-powered calling system works in action
                </p>
              </div>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              {t('home.howItWorks.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className={`group relative text-center animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                <div className="relative">
                  {/* Connection Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-4 z-0"></div>
                  )}
                  
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-fade-in-scale animate-delay-300 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl relative">
                        <span className="text-3xl font-bold text-white">{step.step}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-left animate-delay-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up">
              {t('home.industriesSection.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
              {t('home.industriesSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div key={index} className={`group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-600/50 hover:shadow-lg dark:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-scale animate-delay-${(index + 1) * 100}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300 animate-fade-in-scale animate-delay-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 animate-fade-in-left animate-delay-400">{industry.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 animate-fade-in-right animate-delay-500">
                    {industry.name === t('home.industries.healthcare') && t('home.industryUseCases.healthcare')}
                    {industry.name === t('home.industries.ecommerce') && t('home.industryUseCases.ecommerce')}
                    {industry.name === t('home.industries.realEstate') && t('home.industryUseCases.realEstate')}
                    {industry.name === t('home.industries.education') && t('home.industryUseCases.education')}
                    {industry.name === t('home.industries.automotive') && t('home.industryUseCases.automotive')}
                    {industry.name === t('home.industries.legal') && t('home.industryUseCases.legal')}
                    {industry.name === t('home.industries.restaurant') && t('home.industryUseCases.restaurant')}
                    {industry.name === t('home.industries.services') && t('home.industryUseCases.services')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* See Spark AI in Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <SoundWaveAnimation />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-semibold mb-4 animate-fade-in-up">
              {t('home.demoSection.tag')}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              {t('home.demo.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              {t('home.demo.subtitle')}
            </p>
          </div>

          {/* Video Demo Section */}
          <VideoDemoSection className="animate-fade-in-up animate-delay-600" />

          {/* Call-to-Action */}
          <div className="text-center bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white animate-fade-in-up animate-delay-800 mx-2 sm:mx-0">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">{t('home.aiSalesTeam.readyToSee')}</h3>
            <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              {t('home.aiSalesTeam.bookDemo')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.demoSection.bookLiveDemo')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg dark:shadow-2xl hover:shadow-2xl backdrop-blur-sm bg-white/10 hover:bg-white relative overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                  {t('home.demoSection.tryFreeCall')}
                </span>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2 text-white/80 text-xs sm:text-sm px-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t('home.ctaBanner.trustedBy')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.pricingSection.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('home.pricingSection.subtitle')}
            </p>
          </div>

          {/* Setup Fee and AI Usage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-600/50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('home.pricingSection.setupFee.title')}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{t('home.pricingSection.setupFee.amount')}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{t('home.pricingSection.setupFee.description')}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700/80 dark:backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-200 dark:border-slate-600/50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('home.pricingSection.usageFee.title')}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{t('home.pricingSection.usageFee.amount')}</span>
                  <span className="text-slate-600 dark:text-slate-400">{t('home.pricingSection.usageFee.unit')}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{t('home.pricingSection.usageFee.description')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`group relative overflow-visible transition-all duration-700 hover:scale-105 ${
                plan.popular 
                  ? 'md:scale-110 z-10 pt-4' 
                  : 'hover:z-20'
              }`}>
                {/* Main Card */}
                <div className={`relative overflow-hidden rounded-3xl transition-all duration-500 group-hover:shadow-2xl ${
                  plan.popular 
                    ? 'bg-white dark:bg-slate-800/80 backdrop-blur-sm border-2 border-blue-500/30 shadow-xl group-hover:border-blue-500/60 group-hover:shadow-2xl' 
                    : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50 shadow-xl group-hover:border-blue-300 dark:group-hover:border-blue-500/50'
                }`}>
                  
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
                        {t('home.pricingSection.mostPopular')}
                      </div>
                    </div>
                  )}
                  
                  {/* Limited Badge */}
                  {plan.limited && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                        {t('home.pricingSection.limited')}
                      </div>
                    </div>
                  )}
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                          : 'bg-gradient-to-r from-slate-400 to-slate-500 group-hover:from-blue-400 group-hover:to-purple-400'
                      }`}>
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className={`text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-300 ${
                        plan.popular 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}>
                        {plan.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline justify-center">
                          <span className={`text-4xl sm:text-5xl font-bold transition-colors duration-300 ${
                            plan.popular 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}>
                            {plan.price}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2 text-lg">{plan.period}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                        {plan.description}
                      </p>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start group/item">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 transition-all duration-300 ${
                              plan.popular 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-md' 
                                : 'bg-gradient-to-r from-slate-300 to-slate-400 group-hover:from-green-400 group-hover:to-emerald-500'
                            }`}>
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed group-hover/item:text-slate-700 dark:group-hover/item:text-slate-300 transition-colors duration-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="text-center">
                      <Button 
                        onClick={() => setShowComingSoonModal(true)}
                        className={`w-full py-4 px-6 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-lg' 
                            : 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 text-slate-900 dark:text-white hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-600/20 dark:hover:to-purple-600/20 border border-slate-200 dark:border-slate-500'
                        }`}
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {plan.cta}
                        </span>
                        {plan.popular && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Bottom Accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-500 group-hover:from-blue-400 group-hover:to-purple-400'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Why Top Companies Choose Spark AI - Redesigned */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%235965f0%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
          {/* Floating gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold mb-6 animate-fade-in-up shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {t('badges.trustedByLeaders')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 sm:mb-8 animate-fade-in-up animate-delay-200 leading-tight px-4">
              {t('home.whyChoose.title')}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto animate-fade-in-up animate-delay-400 px-4 leading-relaxed">
              Discover why industry leaders choose AI Spark Sales Agent over other platforms
            </p>
          </div>

          {/* Modern Feature Comparison */}
          <div className="space-y-8 sm:space-y-12">
            {/* Desktop Comparison Table - Enhanced */}
            <div className="hidden lg:block bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-700/50 animate-fade-in-up animate-delay-600">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-slate-600/30 bg-gradient-to-r from-slate-50/80 to-blue-50/80 dark:from-slate-700/80 dark:to-slate-600/80 backdrop-blur-sm">
                      <th className="text-left py-8 px-8 text-lg font-bold text-slate-900 dark:text-white">
                        {t('home.whyChoose.comparison.title')}
                      </th>
                      <th className="text-center py-8 px-8">
                        <div className="inline-flex items-center justify-center w-40 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl shadow-xl">
                          <Sparkles className="w-6 h-6 text-white mr-3" />
                          <span className="text-white font-bold text-lg">{t('home.whyChoose.comparison.ourPlatform')}</span>
                        </div>
                      </th>
                      <th className="text-center py-8 px-8 text-lg font-semibold text-slate-600 dark:text-slate-400">
                        {t('home.whyChoose.comparison.otherPlatforms')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: t('home.whyChoose.comparison.features.advancedAI.title'),
                        description: t('home.whyChoose.comparison.features.advancedAI.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.customerSupport.title'),
                        description: t('home.whyChoose.comparison.features.customerSupport.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.voiceCloning.title'),
                        description: t('home.whyChoose.comparison.features.voiceCloning.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.multiLanguage.title'),
                        description: t('home.whyChoose.comparison.features.multiLanguage.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.realTimeAnalytics.title'),
                        description: t('home.whyChoose.comparison.features.realTimeAnalytics.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.enterpriseSecurity.title'),
                        description: t('home.whyChoose.comparison.features.enterpriseSecurity.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.easyIntegration.title'),
                        description: t('home.whyChoose.comparison.features.easyIntegration.description'),
                        spark: true,
                        others: false
                      },
                      {
                        feature: t('home.whyChoose.comparison.features.dedicatedManager.title'),
                        description: t('home.whyChoose.comparison.features.dedicatedManager.description'),
                        spark: true,
                        others: false
                      }
                    ].map((item, index) => (
                      <tr key={index} className={`border-b border-slate-100/50 dark:border-slate-600/30 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-300 animate-fade-in-up animate-delay-${(index + 1) * 100} group`}>
                        <td className="py-8 px-8">
                          <div className="group-hover:translate-x-2 transition-transform duration-300">
                            <div className="text-slate-900 dark:text-white font-semibold text-lg mb-2 leading-tight">
                              {item.feature}
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-8 px-8">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-7 h-7 text-white" />
                          </div>
                        </td>
                        <td className="text-center py-8 px-8">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <X className="w-7 h-7 text-white" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Comparison Cards - Redesigned */}
            <div className="lg:hidden space-y-6 sm:space-y-8">
              {[
                {
                  feature: t('home.whyChoose.comparison.features.advancedAI.title'),
                  description: t('home.whyChoose.comparison.features.advancedAI.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.customerSupport.title'),
                  description: t('home.whyChoose.comparison.features.customerSupport.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.voiceCloning.title'),
                  description: t('home.whyChoose.comparison.features.voiceCloning.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.multiLanguage.title'),
                  description: t('home.whyChoose.comparison.features.multiLanguage.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.realTimeAnalytics.title'),
                  description: t('home.whyChoose.comparison.features.realTimeAnalytics.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.enterpriseSecurity.title'),
                  description: t('home.whyChoose.comparison.features.enterpriseSecurity.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.easyIntegration.title'),
                  description: t('home.whyChoose.comparison.features.easyIntegration.description'),
                  spark: true,
                  others: false
                },
                {
                  feature: t('home.whyChoose.comparison.features.dedicatedManager.title'),
                  description: t('home.whyChoose.comparison.features.dedicatedManager.description'),
                  spark: true,
                  others: false
                }
              ].map((item, index) => (
                <div key={index} className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 sm:p-8 animate-fade-in-up animate-delay-${(index + 1) * 100} hover:shadow-2xl transition-all duration-300 group`}>
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex-1 pr-6">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {item.feature}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      {/* AI Spark Column */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                          AI Spark
                        </div>
                      </div>
                      {/* Others Column */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-xl mb-2 group-hover:scale-110 transition-transform duration-300">
                          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-red-600 dark:text-red-400">
                          Others
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="text-center animate-fade-in-up animate-delay-800 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{t('featureHighlights.enterpriseSecurity.title')}</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 px-2 leading-relaxed">{t('featureHighlights.enterpriseSecurity.description')}</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-900 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{t('featureHighlights.provenResults.title')}</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 px-2 leading-relaxed">{t('featureHighlights.provenResults.description')}</p>
            </div>
            <div className="text-center animate-fade-in-up animate-delay-1000 sm:col-span-2 lg:col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{t('featureHighlights.fiveStarSupport.title')}</h3>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 px-2 leading-relaxed">{t('featureHighlights.fiveStarSupport.description')}</p>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-16 sm:mt-20 text-center">
            <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-8 sm:p-12 lg:p-16 xl:p-20 text-white animate-fade-in-up animate-delay-1100 overflow-hidden mx-2 sm:mx-0 shadow-2xl">
              {/* Enhanced Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 opacity-50 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight px-2">{t('featureHighlights.cta.title')}</h3>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto px-2 leading-relaxed">
                  {t('featureHighlights.cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-lg sm:max-w-none mx-auto">
                  <Link href="/login">
                  <Button 
                    size="lg" 
                    className="group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-300 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-base sm:text-lg lg:text-xl font-bold shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 relative overflow-hidden w-full sm:w-auto rounded-xl sm:rounded-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {t('featureHighlights.cta.startFreeTrial')}
                      <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group border-2 border-white text-white hover:bg-white hover:text-purple-600 hover:scale-105 transition-all duration-300 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-base sm:text-lg lg:text-xl font-bold shadow-xl hover:shadow-2xl backdrop-blur-sm bg-white/10 hover:bg-white relative overflow-hidden w-full sm:w-auto rounded-xl sm:rounded-2xl"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Phone className="mr-3 w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                      {t('featureHighlights.cta.bookDemoCall')}
                    </span>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
                
                {/* Enhanced Trust Badge */}
                <div className="mt-6 sm:mt-8 lg:mt-10 flex items-center justify-center space-x-3 text-white/90 text-sm sm:text-base px-4">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('home.ctaBanner.trustedBy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* Consultation Booking */}
       <section id="consultation" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              {t('home.consultationSection.badge')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.consultation.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('home.consultation.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Section - Consultation Details */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
                {/* Host Profile */}
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">AI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('home.consultation.expertTeam')}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{t('home.consultation.specialists')}</p>
                </div>

                {/* Call Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.consultation.discoveryCall')}</h4>
                    <div className="flex items-center space-x-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5" />
                        <span>{t('home.consultation.duration')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video className="w-5 h-5" />
                        <span>{t('calendly.webConferencing')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-600 rounded-xl p-6">
                    <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">
                      {t('home.consultation.description')}
                    </p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">{t('home.consultation.weWillCover')}</h5>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        {(t('home.consultation.features', { returnObjects: true }) as string[]).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-500 pt-4">
                      <h5 className="font-semibold text-slate-900 dark:text-white mb-2">{t('home.consultation.hearFromOthers')}</h5>
                      <blockquote className="text-slate-600 dark:text-slate-400 italic">
                        {t('home.consultation.testimonial')}
                      </blockquote>
                      <cite className="text-sm text-slate-500 dark:text-slate-400 mt-2 block">
                        - Sarah Johnson, CEO TechStart Inc.
                      </cite>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Calendly Scheduling */}
              <div className="p-8 lg:p-12">
                <CalendlyScheduling 
                  userSlug="insyncinternational" // Your Calendly username
                  eventTypeSlug="30min" // Common slug for 30 minute meetings
                  className="max-w-md mx-auto"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 dark:text-slate-400">
              {t('calendly.cantFindTime')}{' '}
              <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                {t('calendly.contactDirectly')}
              </a>
            </p>
          </div>
        </div>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-scale animate-delay-600">
              <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-2xl animate-ai-glow">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 md:p-16 lg:p-20 text-center relative overflow-hidden">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  
                  {/* Video Content */}
                  <div className="relative z-10">
                    {/* Large Play Button */}
                    <div className="mb-8">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-voice-pulse hover:scale-110 transition-transform duration-300 cursor-pointer group">
                        <Play className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white group-hover:text-brand-200 transition-colors" />
                      </div>
                    </div>
                    
                    {/* Enhanced Content */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up animate-delay-700 leading-tight">
                      {t('home.hero.seeInAction')}
                    </h3>
                    <p className="text-white/90 mb-8 animate-fade-in-up animate-delay-800 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                      {t('home.hero.watchDescription')}
                    </p>
                    
                    {/* Enhanced AI Demo Call Section - Minimal Version */}
                    <div className="flex justify-center animate-fade-in-up animate-delay-900">
                      <div className="w-full max-w-2xl">
                        <AIDemoCallMinimal className="p-6" />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animate-delay-1000">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.successRate')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.successRateLabel')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.availability')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.availabilityLabel')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('home.hero.stats.languages')}</div>
                        <div className="text-white/80 text-sm sm:text-base">{t('home.hero.stats.languagesLabel')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      {/* Meet Your New AI Sales Team */}
      {/* <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        <VoiceWaveAnimation />
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 animate-fade-in-up">
              🤖 AI SALES TEAM
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animate-delay-200">
              {t('home.aiSalesTeam.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto animate-fade-in-up animate-delay-400">
              {t('home.aiSalesTeam.subtitle')}
            </p>
          </div>

          
          <div className="max-w-4xl mx-auto animate-fade-in-up animate-delay-600">
            <AIDemoCall className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/50" />
          </div>

         
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: t('home.aiSalesFeatures.availability.title'),
                description: t('home.aiSalesFeatures.availability.description'),
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Target,
                title: t('home.aiSalesFeatures.leadQualification.title'),
                description: t('home.aiSalesFeatures.leadQualification.description'),
                color: 'from-cyan-500 to-teal-500'
              },
              {
                icon: TrendingUp,
                title: t('home.aiSalesFeatures.conversionOptimization.title'),
                description: t('home.aiSalesFeatures.conversionOptimization.description'),
                color: 'from-teal-500 to-green-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`group text-center animate-fade-in-up animate-delay-${(index + 1) * 200}`}>
                  <div className="relative p-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200 dark:border-slate-700/50">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-2xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>  */}

      {/* Meet Our Team */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AIParticles />
        <div className="max-w-7xl mx-auto relative z-10">
           <div className="text-center mb-16">
             <div className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4 text-reveal">
               {t('home.teamSection.badge')}
             </div>
             <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-reveal">
               {t('home.teamSection.title')}
             </h2>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-reveal">
               {t('home.teamSection.subtitle')}
             </p>
           </div>

           <div className="team-container">
             {[
               {
                 name: t('home.teamMembers.jay.name'),
                 title: t('home.teamMembers.jay.title'),
                 image: '/images/JAY.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.jay.description')
               },
               {
                 name: t('home.teamMembers.tooba.name'),
                 title: t('home.teamMembers.tooba.title'),
                 image: '/images/Tooba.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.tooba.description')
               },
               {
                 name: t('home.teamMembers.sagar.name'),
                 title: t('home.teamMembers.sagar.title'),
                 image: '/images/Sagar.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.sagar.description')
               },
               {
                 name: t('home.teamMembers.ananya.name'),
                 title: t('home.teamMembers.ananya.title'),
                 image: '/images/Ananya.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.ananya.description')
               },
               {
                 name: t('home.teamMembers.ersham.name'),
                 title: t('home.teamMembers.ersham.title'),
                 image: '/images/Ersham.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.ersham.description')
               },
               {
                 name: t('home.teamMembers.saleem.name'),
                 title: t('home.teamMembers.saleem.title'),
                 image: '/images/Saleem.png',
                 color: 'from-blue-500 to-purple-500',
                 description: t('home.teamMembers.saleem.description')
               }
             ].map((member, index) => (
               <div key={index} className="team-card group bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-600/50">
                 <div className="flex flex-col items-center justify-center text-center h-full">
                   <div className="avatar-3d w-24 h-24 rounded-2xl mb-4 shadow-lg dark:shadow-2xl group-hover:shadow-xl overflow-hidden bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600/50">
                     <img 
                       src={member.image} 
                       alt={member.name}
                       className="w-full h-full object-cover rounded-xl"
                     />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                     {member.name}
                   </h3>
                   <p className="text-blue-600 dark:text-blue-400 font-semibold text-base mb-3">
                     {member.title}
                   </p>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed px-2">
                     {member.description}
                   </p>
                 </div>
               </div>
             ))}
          </div>

          {/* Team Stats */}
          <div className="mt-16 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
                <div className="text-slate-600 dark:text-slate-400">{t('home.teamStats.experience')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">500+</div>
                <div className="text-slate-600 dark:text-slate-400">{t('home.teamStats.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
                <div className="text-slate-600 dark:text-slate-400">{t('home.teamStats.satisfaction')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
                <div className="text-slate-600 dark:text-slate-400">{t('home.teamStats.support')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 border border-slate-200 dark:border-slate-600/50">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <VoiceWaveAnimation />
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-6 sm:p-8 lg:p-12 text-white animate-ai-glow">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              {t('home.ctaSection.title')}
            </h2>
            <p className="text-lg sm:text-xl mb-8 opacity-90 px-2">
              {t('home.ctaSection.subtitle')}
            </p>
            <Link href="/login">
            <Button 
              size="lg" 
              className="bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              {t('home.ctaSection.button')}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/80 dark:backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {t('home.faqSection.title')}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              {t('home.faqSection.subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600/50">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI SPARK SALES AGENT</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                {t('footer.companyDescription')}
              </p>
              <div className="text-slate-400 text-sm space-y-1">
                <p>📍 {t('footer.address')}</p>
                <p>📧 {t('footer.email')}</p>
                <p>📞 {t('footer.phone')}</p>
              </div>
              
              {/* Trust Elements */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-slate-300">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800 rounded-lg px-3 py-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-slate-300">4.9/5 Rating</span>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#solutions" className="hover:text-white transition-colors">{t('footer.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">{t('footer.company')}</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
      
      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoonModal} 
        onClose={() => setShowComingSoonModal(false)} 
      />
    </div>
  );
}
