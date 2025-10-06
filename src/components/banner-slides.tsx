import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Bot, Phone, Zap, Target, TrendingUp, BarChart3, MessageCircle } from 'lucide-react';

const BannerSlides = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Transform Your Sales with AI Voice Intelligence",
      subtitle: "Automate your sales calls with human-like AI agents that qualify leads, schedule meetings, and close deals 24/7. Experience the future of sales automation.",
      icon: Bot,
      gradient: "from-brand-500 via-brand-400 to-brand-600",
      bgPattern: "bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900",
      accent: "brand-300",
      features: ["24/7 Availability", "Human-like Conversations", "Lead Qualification", "Meeting Scheduling"]
    },
    {
      id: 2,
      title: "Revolutionary AI Voice Technology",
      subtitle: "Experience cutting-edge neural voice synthesis that creates natural, engaging conversations. Our AI agents understand context, emotions, and business objectives to deliver exceptional results.",
      icon: Phone,
      gradient: "from-brand-400 via-brand-500 to-brand-700",
      bgPattern: "bg-gradient-to-br from-brand-800 via-brand-900 to-brand-800",
      accent: "brand-200",
      features: ["Neural Voice Synthesis", "Context Understanding", "Emotional Intelligence", "Business Optimization"]
    },
    {
      id: 3,
      title: "Scale Your Business Automatically",
      subtitle: "Multiply your sales capacity without increasing overhead. Our AI agents handle thousands of calls simultaneously, providing consistent quality and results that grow your business exponentially.",
      icon: Zap,
      gradient: "from-brand-600 via-brand-500 to-brand-400",
      bgPattern: "bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900",
      accent: "brand-100",
      features: ["Unlimited Scale", "Cost Efficiency", "Consistent Quality", "Exponential Growth"]
    },
    {
      id: 4,
      title: "Precision Lead Targeting & Conversion",
      subtitle: "Our AI analyzes customer behavior, preferences, and intent to deliver personalized conversations that convert. Every call is optimized for maximum engagement and sales success.",
      icon: Target,
      gradient: "from-brand-700 via-brand-600 to-brand-500",
      bgPattern: "bg-gradient-to-br from-brand-800 via-brand-900 to-brand-800",
      accent: "brand-200",
      features: ["Smart Targeting", "Personalized Conversations", "Behavior Analysis", "Higher Conversion"]
    },
    {
      id: 5,
      title: "Real-Time Analytics & Performance Insights",
      subtitle: "Track every conversation, measure success metrics, and optimize your campaigns with comprehensive analytics. Make data-driven decisions that accelerate your sales growth.",
      icon: TrendingUp,
      gradient: "from-brand-500 via-brand-600 to-brand-700",
      bgPattern: "bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900",
      accent: "brand-300",
      features: ["Real-Time Tracking", "Performance Metrics", "Data Analytics", "Growth Optimization"]
    }
  ];

  const currentSlideData = slides[currentSlide];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${currentSlideData.bgPattern}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-brand-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 bg-brand-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-brand-300" />
                <span className="text-xs sm:text-sm font-medium">AI Sales Calling Agent by Spark AI</span>
              </div>

              {/* Main Content */}
              <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-brand-100 to-white bg-clip-text text-transparent">
                    {currentSlideData.title}
                  </span>
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-brand-100 leading-relaxed max-w-2xl">
                  {currentSlideData.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                {currentSlideData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 bg-white/5 backdrop-blur-sm rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border border-white/10">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-brand-300 rounded-full animate-pulse flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm text-brand-100 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative order-1 lg:order-2">
              <div className="relative">
                  {/* Enhanced Visual Container */}
                <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                  {/* Dynamic AI-themed Visual Elements */}
                  <div className="absolute inset-0">
                    {/* Animated Circuit Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                        <defs>
                          <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M20 0L20 20M0 20L40 20M20 20L20 40" stroke="currentColor" strokeWidth="1" className="text-white/30"/>
                            <circle cx="20" cy="20" r="2" fill="currentColor" className="text-white/40"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#circuit)"/>
                      </svg>
                    </div>

                    {/* Floating AI Elements */}
                    <div className="absolute inset-0">
                      {/* Neural Network Nodes */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse"
                        style={{
                            left: `${20 + (i * 10)}%`,
                            top: `${30 + (i % 3) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                      
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                        {[...Array(6)].map((_, i) => (
                          <line
                            key={i}
                            x1={`${25 + i * 15}%`}
                            y1={`${35 + (i % 2) * 15}%`}
                            x2={`${35 + i * 12}%`}
                            y2={`${45 + (i % 3) * 10}%`}
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="1"
                            className="animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Slide-specific Visual Elements */}
                    {currentSlideData.id === 1 && (
                      <div className="absolute inset-0">
                        {/* AI Bot Visualization */}
                        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Bot className="w-8 h-8 text-white/80" />
                        </div>
                        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Phone className="w-6 h-6 text-white/80" />
                        </div>
                        <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <MessageCircle className="w-5 h-5 text-white/80" />
                        </div>
                      </div>
                    )}

                    {currentSlideData.id === 2 && (
                      <div className="absolute inset-0">
                        {/* Neural Network Visualization */}
                        <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-white/20 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
                              <Zap className="w-6 h-6 text-white/80" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-1/4 right-1/4 w-14 h-14 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <TrendingUp className="w-7 h-7 text-white/80" />
                        </div>
                      </div>
                    )}

                    {currentSlideData.id === 3 && (
                      <div className="absolute inset-0">
                        {/* Growth Visualization */}
                        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/20 rounded-full"></div>
                        <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-white/15 rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full"></div>
                      </div>
                    )}

                    {currentSlideData.id === 4 && (
                      <div className="absolute inset-0">
                        {/* Target/Precision Visualization */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-24 h-24 border-2 border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-white/40 rounded-full flex items-center justify-center">
                                <Target className="w-4 h-4 text-white/80" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-white/20 rounded-full animate-ping"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                    )}

                    {currentSlideData.id === 5 && (
                      <div className="absolute inset-0">
                        {/* Analytics Visualization */}
                        <div className="absolute bottom-1/4 left-1/4 w-16 h-12 bg-white/10 rounded-t-lg backdrop-blur-sm"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-white/15 rounded-t-lg backdrop-blur-sm"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-16 h-20 bg-white/20 rounded-t-lg backdrop-blur-sm"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-16 h-14 bg-white/12 rounded-t-lg backdrop-blur-sm"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-16 h-18 bg-white/18 rounded-t-lg backdrop-blur-sm"></div>
                        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <BarChart3 className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-60`}></div>
                  
                  {/* Main Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                    <currentSlideData.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                  </div>

                  {/* Subtle floating elements */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/3 left-2 sm:left-4 w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Minimal floating icons */}
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-brand-400/20 rounded-lg flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '0.5s' }}>
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-brand-300/20 rounded-md flex items-center justify-center backdrop-blur-sm animate-bounce" style={{ animationDelay: '1s' }}>
                  <Phone className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-4">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </button>

        {/* Dots */}
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-brand-400 to-brand-300 transition-all duration-100 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BannerSlides;
