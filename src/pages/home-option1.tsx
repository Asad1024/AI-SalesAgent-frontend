import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Sparkles, 
  Bot, 
  Target, 
  Headphones, 
  Clock, 
  BarChart3, 
  Settings, 
  Globe, 
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
  Shield,
  Mic
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import LanguageSwitcher from '@/components/language-switcher';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/logo';
import BackToTop from '@/components/back-to-top';

export default function HomeOption1() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCalling, setIsCalling] = useState(false);
  const [callForm, setCallForm] = useState({
    name: '',
    phone: '',
    industry: '',
    company: ''
  });

  const industries = [
    { name: 'Healthcare', icon: Heart, color: 'from-blue-500 to-purple-500' },
    { name: 'E-commerce', icon: ShoppingCart, color: 'from-blue-500 to-purple-500' },
    { name: 'Real Estate', icon: Building2, color: 'from-blue-500 to-purple-500' },
    { name: 'Education', icon: GraduationCap, color: 'from-blue-500 to-purple-500' },
    { name: 'Automotive', icon: Car, color: 'from-blue-500 to-purple-500' },
    { name: 'Legal', icon: Scale, color: 'from-blue-500 to-purple-500' },
    { name: 'Restaurant', icon: Utensils, color: 'from-blue-500 to-purple-500' },
    { name: 'Services', icon: Briefcase, color: 'from-blue-500 to-purple-500' }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Never miss a call again. Our AI agents work around the clock to handle customer inquiries, appointment bookings, and support requests.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: '300% More Conversions',
      description: 'Transform your sales process with AI agents that qualify leads, follow up automatically, and close deals while you sleep.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Zap,
      title: '10+ Hours Saved Weekly',
      description: 'Automate repetitive phone tasks and free up your team to focus on high-value activities that drive business growth.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'Spark AI transformed our lead qualification process. We went from 20% conversion rate to 65% in just 3 months.',
      avatar: 'SJ',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Sales Director, RealEstate Pro',
      content: 'The AI agents handle our appointment scheduling flawlessly. Our team can now focus on closing deals instead of managing calendars.',
      avatar: 'MC',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Founder, HealthCare Plus',
      content: 'Patient satisfaction increased by 40% since implementing Spark AI. Our patients love the instant, personalized support.',
      avatar: 'ER',
      rating: 5
    }
  ];

  const demoCalls = [
    {
      title: 'Customer Support Demo',
      description: 'See how our AI handles customer inquiries and resolves issues instantly.',
      industry: 'E-commerce',
      duration: '2:30',
      icon: MessageCircle
    },
    {
      title: 'Appointment Booking Demo',
      description: 'Watch our AI agent schedule appointments and manage calendars seamlessly.',
      industry: 'Healthcare',
      duration: '1:45',
      icon: Calendar
    },
    {
      title: 'Sales Qualification Demo',
      description: 'Experience how our AI qualifies leads and books meetings for your sales team.',
      industry: 'Real Estate',
      duration: '3:15',
      icon: Target
    }
  ];

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalling(true);
    
    // Simulate call initiation
    setTimeout(() => {
      setIsCalling(false);
      toast({
        title: "Call Initiated!",
        description: "Our AI agent will call you shortly to demonstrate our capabilities.",
        variant: "default",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="relative z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Logo size="md" showText={true} />
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Hook */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Frustration Hook */}
            <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Phone className="w-4 h-4" />
              <span>Missing 70% of your calls? Losing leads daily?</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Are You Ready to{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
                Never Miss Another Call?
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
              Transform your business with AI voice agents that work 24/7, qualify leads automatically, 
              and convert 300% more prospects into customers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Try Free Demo Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm text-slate-500 dark:text-slate-400">Trusted by 500+ companies</div>
              <div className="flex space-x-4">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              See Spark AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Watch our AI agent handle real customer calls, qualify leads, and book appointments automatically
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-8 md:p-12 overflow-hidden">
              {/* Video Container */}
              <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl aspect-video flex items-center justify-center">
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="group w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl">
                    <Play className="w-8 h-8 text-blue-600 ml-1 group-hover:text-purple-600 transition-colors" />
                  </button>
                </div>
                
                {/* Video Overlay Elements */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-white text-sm font-medium">LIVE DEMO</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-white text-sm">2:45</span>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <Volume2 className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">100%</span>
                  </div>
                </div>
              </div>
              
              {/* Video Description */}
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Real AI Agent Demo: Customer Support Call
                </h3>
                <p className="text-white/80 text-lg mb-6 max-w-3xl mx-auto">
                  Watch as our AI agent handles a real customer inquiry, provides instant support, 
                  and seamlessly transfers to a human agent when needed.
                </p>
                
                {/* Video Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">95%</div>
                    <div className="text-white/70 text-sm">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">2.3s</div>
                    <div className="text-white/70 text-sm">Average Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">24/7</div>
                    <div className="text-white/70 text-sm">Always Available</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video Thumbnails */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Sales Qualification', duration: '1:45', thumbnail: 'Sales' },
                { title: 'Appointment Booking', duration: '2:30', thumbnail: 'Booking' },
                { title: 'Customer Support', duration: '3:15', thumbnail: 'Support' }
              ].map((video, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="bg-slate-100 dark:bg-slate-700 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-blue-600 ml-0.5" />
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm font-medium">{video.thumbnail}</div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Autonomous AI Sales Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Your Autonomous AI Sales Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              25+ coordinated AI agents working together to find, research, and convert your ideal prospects.
            </p>
          </div>

          {/* AI Sales Process Flow */}
          <div className="relative mb-16">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              {[
                { name: 'Lead Discovery', icon: Target, color: 'from-blue-500 to-cyan-500' },
                { name: 'Research & Enrichment', icon: Users, color: 'from-cyan-500 to-teal-500' },
                { name: 'Personalized Outreach', icon: MessageCircle, color: 'from-teal-500 to-green-500' },
                { name: 'Follow-Up Sequences', icon: Phone, color: 'from-green-500 to-emerald-500' },
                { name: 'Objection Handling', icon: Shield, color: 'from-emerald-500 to-lime-500' },
                { name: 'Booked Demo', icon: Calendar, color: 'from-lime-500 to-yellow-500' }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse`} style={{animationDelay: `${index * 0.5}s`}}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      {step.name}
                    </h3>
                    {index < 5 && (
                      <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-slate-300 to-slate-400 transform translate-x-8"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Integrations */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Platform Integrations
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Connect with all your favorite tools and platforms
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['HubSpot', 'Salesforce', 'Pipedrive', 'Close.com', 'Twilio', 'GoHighLevel', 'Zapier', 'Slack', 'Intercom', 'Calendly', 'Zoom', 'Microsoft Teams'].map((platform, index) => (
                <div key={index} className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-500">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real World Scenarios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Real World Scenarios
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              See how our AI automation works across calls, emails, and LinkedIn outreach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Voice */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Voice</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Professional outreach that sounds human
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Our AI greets by name, references the company, and opens with a context-driven reason for calling.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    It adjusts mid-call to answers, handles objections naturally, and books the meeting. It sounds like a sharp SDR and runs 24/7 without salary, commission, or downtime.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Live Call</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    "Hi James, I saw you at SaaStr Annual. Your scaling insights were spot-on - exactly what our AI SDR helps achieve. Wednesday work for a 10-min call?"
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Personalized outreach that converts
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Every email is written for the recipient using LinkedIn, company site, recent press, and market signals. No templating.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    The AI chooses the right tone: casual, direct, or consultative, based on industry norms and seniority.
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Personalized Email</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <strong>Subject:</strong> Quick question about SaaStr
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    "Hey James, Saw you at SaaStr Annual. Your scaling insights were spot-on - exactly what our AI SDR helps achieve. One client booked 62 calls in 18 days. Wednesday work for a 10-min call?"
                  </p>
                </div>
              </div>
            </div>

            {/* LinkedIn Voice Note */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-600">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">LinkedIn Voice Note</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Authentic voice messages that increase connection rates
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Personalized connection message. If no reply, follow with an AI generated voice note that sounds human and fits context.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our AI creates authentic voice messages that feel personal and relevant, increasing connection acceptance rates significantly.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Voice Message</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">S</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Shrey Ansh</span>
                    <span className="text-xs text-slate-500">0:46</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    "Hey James, great to connect! I saw your insights on scaling at SaaStr. Would love to share how we're helping similar companies automate their sales process. Quick 10-min call this week?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Your Pipeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Scale Your Pipeline Without Scaling Your Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our AI does the heavy lifting while you focus on what matters: taking credit for all those closed deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Find Leads',
                description: 'No more detective work. Our AI scours the web to find your dream prospects—so you don\'t have to stalk LinkedIn at 2 AM.',
                icon: Target,
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Research Leads',
                description: 'We read the room (and their tweets) so you don\'t accidentally ask about their ex\'s startup. Awkwardness: avoided.',
                icon: Users,
                color: 'from-cyan-500 to-teal-500'
              },
              {
                title: 'Personalize Messages',
                description: 'Generic is out. Hyper-personalized is in. Think "Hey [Name]" but with actual effort—like a love letter, minus the creepiness.',
                icon: MessageCircle,
                color: 'from-teal-500 to-green-500'
              },
              {
                title: 'Execute Outreach',
                description: 'Emails, LinkedIn, carrier pigeon (ok, maybe not that last one). We hit all the right channels while you hit "snooze."',
                icon: Phone,
                color: 'from-blue-500 to-purple-500'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-600">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Live Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</div>
              <div className="text-slate-600 dark:text-slate-400 mb-4">Calls Today</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
              <div className="text-slate-600 dark:text-slate-400">Connected</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24</div>
              <div className="text-slate-600 dark:text-slate-400 mb-4">Meetings Booked</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Demo Scheduled: TechCorp Inc. • 2:30 PM
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
              <div className="text-slate-600 dark:text-slate-400 mb-4">Missed Calls</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Follow-up: Enterprise Lead • Tomorrow
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Reality vs Desired Outcomes */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Current Reality */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Current Reality: You're Losing Money Every Day
              </h2>
              <div className="space-y-4">
                {[
                  '70% of calls go unanswered',
                  'Leads slip through the cracks',
                  'Manual follow-ups waste hours',
                  'Inconsistent customer experience',
                  'Missed revenue opportunities'
                ].map((problem, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 text-sm">✗</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desired Outcomes */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Desired Outcome: AI-Powered Success
              </h2>
              <div className="space-y-4">
                {[
                  '100% call coverage 24/7',
                  'Every lead gets qualified',
                  'Automated follow-ups',
                  'Consistent, professional service',
                  '300% more conversions'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 3 Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Why 500+ Companies Choose Spark AI
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Three game-changing benefits that transform your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Authority/Credibility/Trust */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Built by AI Experts, Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Our team of AI researchers and engineers have spent years perfecting voice AI technology. 
                We've processed over 10 million calls and helped businesses increase their conversion rates by 300%.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10M+</div>
                  <div className="text-slate-600 dark:text-slate-400">Calls Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
                  <div className="text-slate-600 dark:text-slate-400">Customer Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">500+</div>
                  <div className="text-slate-600 dark:text-slate-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
                  <div className="text-slate-600 dark:text-slate-400">Support Available</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Research & Development
              </h3>
              <div className="space-y-4">
                {[
                  'Advanced neural voice synthesis',
                  'Natural language processing',
                  'Emotional intelligence algorithms',
                  'Multi-language support (100+ languages)',
                  'Real-time conversation optimization'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Calls Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              See Spark AI in Action
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Watch real demo calls across different industries and use cases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoCalls.map((demo, index) => {
              const Icon = demo.icon;
              return (
                <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{demo.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{demo.industry}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{demo.duration}</div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{demo.description}</p>
                  <Button variant="outline" className="w-full">
                    <Play className="mr-2 w-4 h-4" />
                    Watch Demo
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              From healthcare to real estate, our AI agents adapt to your industry's unique needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div key={index} className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{industry.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {industry.name === 'Healthcare' && 'Appointment scheduling, patient reminders, and support'}
                    {industry.name === 'E-commerce' && 'Order tracking, returns, and customer support'}
                    {industry.name === 'Real Estate' && 'Lead qualification, property inquiries, and scheduling'}
                    {industry.name === 'Education' && 'Student support, enrollment, and information'}
                    {industry.name === 'Automotive' && 'Service appointments, sales follow-ups, and support'}
                    {industry.name === 'Legal' && 'Client intake, appointment scheduling, and case updates'}
                    {industry.name === 'Restaurant' && 'Reservations, orders, and customer service'}
                    {industry.name === 'Services' && 'Appointment booking, follow-ups, and support'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Real results from real businesses using Spark AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-8 border border-slate-200 dark:border-slate-600">
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

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join 500+ companies already saving 10+ hours per week and increasing conversions by 300%
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
              >
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-6">
              ✅ 14-day free trial • ✅ No credit card required • ✅ 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}
