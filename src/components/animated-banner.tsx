import { useState, useEffect, useMemo } from 'react';
import { Phone, MessageCircle, TrendingUp, Users, Zap, Sparkles, Bot, Target, Mic, Headphones, Clock, BarChart3, Settings, Globe, Shield, Star, Languages, PhoneCall, PhoneOff, Volume2, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AnimatedBanner() {
  const { t, i18n } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState('idle');

  // Make currentLanguage reactive to language changes
  const currentLanguage = useMemo(() => {
    const rawLang = i18n.language || 'en';
    return rawLang.split('-')[0].toLowerCase();
  }, [i18n.language]);
  
  // Memoize stats to recalculate when language changes
  // Use i18n.t with explicit language to ensure translations are found
  const stats = useMemo(() => {
    const rawLang = i18n.language || 'en';
    const lang = rawLang.split('-')[0].toLowerCase();
    
    // Use i18n.t with explicit language parameter, same as features
    return [
      { label: i18n.t('stats.aiCallsMade', { lng: lang }), value: "10M+", icon: Phone },
      { label: i18n.t('stats.happyCustomers', { lng: lang }), value: "500+", icon: Users },
      { label: i18n.t('stats.languagesSupported', { lng: lang }), value: "95+", icon: Globe },
      { label: i18n.t('stats.uptime', { lng: lang }), value: "99.9%", icon: TrendingUp }
    ];
  }, [i18n, i18n.language]);

  // Memoize features to recalculate when language changes
  // Use i18n.t with explicit language to ensure translations update
  const features = useMemo(() => {
    const rawLang = i18n.language || 'en';
    const lang = rawLang.split('-')[0].toLowerCase();
    // Use rawLang for i18n.t() in case it needs full locale, but normalized lang for conditionals
    return [
    {
      icon: Phone,
      title: i18n.t('features.aiVoiceCalling.title', { lng: lang }),
      description: i18n.t('features.aiVoiceCalling.description', { lng: lang }),
      metric: i18n.t('features.aiVoiceCalling.stats', { lng: lang }),
      color: "from-purple-500 to-pink-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "مرحبا، أنا مهتم بخدماتكم" : lang === 'tr' ? "Merhaba, hizmetlerinizle ilgileniyorum" : lang === 'hi' ? "नमस्ते, मैं आपकी सेवाओं में रुचि रखता हूं" : "Hello, I'm interested in your services" },
        { type: "ai", text: lang === 'ar' ? "مرحباً! 👋 أنا مساعد المبيعات الذكي. يمكنني مساعدتك في:" : lang === 'tr' ? "Merhaba! 👋 Ben AI satış asistanınızım. Size şu konularda yardımcı olabilirim:" : lang === 'hi' ? "नमस्ते! 👋 मैं आपका AI सेल्स असिस्टेंट हूं। मैं आपकी मदद कर सकता हूं:" : "Hi there! 👋 I'm your AI sales assistant. I can help you with:", 
          features: lang === 'ar' ? ["تأهيل العملاء المحتملين", "تحليلات المبيعات", "دعم العملاء"] : 
                   lang === 'tr' ? ["Müşteri Adayı Nitelendirme", "Satış Analitikleri", "Müşteri Desteği"] : 
                   lang === 'hi' ? ["लीड योग्यता", "सेल्स एनालिटिक्स", "ग्राहक सहायता"] : 
                   ["Lead Qualification", "Sales Analytics", "Customer Support"] },
        { type: "typing", text: "" }
      ],
      dialerInterface: true
    },
    {
      icon: Mic,
      title: i18n.t('features.voiceCloning.title', { lng: lang }),
      description: i18n.t('features.voiceCloning.description', { lng: lang }),
      metric: i18n.t('features.voiceCloning.stats', { lng: lang }),
      color: "from-blue-500 to-purple-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "هل يمكنك أن تبدو أكثر احترافية؟" : lang === 'tr' ? "Daha profesyonel ses çıkarabilir misiniz?" : lang === 'hi' ? "क्या आप अधिक पेशेवर लग सकते हैं?" : "Can you sound more professional?" },
        { type: "ai", text: lang === 'ar' ? "بالتأكيد! يمكنني تكييف صوتي ليطابق علامتك التجارية. اختر من:" : lang === 'tr' ? "Kesinlikle! Sesimi markanıza uyacak şekilde ayarlayabilirim. Seçin:" : lang === 'hi' ? "बिल्कुल! मैं अपनी आवाज़ को आपके ब्रांड से मेल खाने के लिए अनुकूलित कर सकता हूं। चुनें:" : "Absolutely! I can adapt my voice to match your brand. Choose from:", 
          features: lang === 'ar' ? ["احترافي", "ودود", "سلطوي", "عادي"] : 
                   lang === 'tr' ? ["Profesyonel", "Dostane", "Otoriter", "Gündelik"] : 
                   lang === 'hi' ? ["पेशेवर", "दोस्ताना", "अधिकारिक", "आकस्मिक"] : 
                   ["Professional", "Friendly", "Authoritative", "Casual"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Headphones,
      title: i18n.t('features.multiLanguage.title', { lng: lang }),
      description: i18n.t('features.multiLanguage.description', { lng: lang }),
      metric: i18n.t('features.multiLanguage.stats', { lng: lang }),
      color: "from-blue-500 to-cyan-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "هل تتحدث الإنجليزية؟" : lang === 'tr' ? "İngilizce konuşuyor musunuz?" : lang === 'hi' ? "क्या आप अंग्रेजी बोलते हैं?" : "Do you speak English?" },
        { type: "ai", text: lang === 'ar' ? "بالطبع! يمكنني التواصل بعدة لغات:" : lang === 'tr' ? "Tabii ki! Birden fazla dilde iletişim kurabilirim:" : lang === 'hi' ? "बिल्कुल! मैं कई भाषाओं में संवाद कर सकता हूं:" : "Of course! I can communicate in multiple languages:", features: lang === 'ar' ? ["الإنجليزية", "العربية", "Français", "Deutsch", "中文"] : lang === 'tr' ? ["İngilizce", "العربية", "Türkçe", "Français", "Deutsch"] : lang === 'hi' ? ["अंग्रेजी", "हिंदी", "Français", "Deutsch", "中文"] : ["English", "العربية", "Français", "Deutsch", "中文"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Languages,
      title: i18n.t('features.arabicSupport.title', { lng: lang }),
      description: i18n.t('features.arabicSupport.description', { lng: lang }),
      metric: i18n.t('features.arabicSupport.stats', { lng: lang }),
      color: "from-purple-500 to-pink-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "مرحبا، هل تتحدث العربية؟" : lang === 'tr' ? "Arapça konuşuyor musunuz?" : lang === 'hi' ? "क्या आप अरबी बोलते हैं?" : "Do you speak Arabic?" },
        { type: "ai", text: lang === 'ar' ? "نعم بالطبع! أستطيع التحدث باللغة العربية بطلاقة:" : lang === 'tr' ? "Evet tabii ki! Arapça'yı akıcı bir şekilde konuşabilirim:" : lang === 'hi' ? "हाँ बिल्कुल! मैं धाराप्रवाह अरबी बोल सकता हूं:" : "Yes, of course! I can speak Arabic fluently:", 
          features: lang === 'ar' ? ["اللهجة المصرية", "اللهجة الخليجية", "اللهجة الشامية", "اللهجة المغربية"] : 
                   lang === 'tr' ? ["Mısır Lehçesi", "Körfez Lehçesi", "Şam Lehçesi", "Fas Lehçesi"] : 
                   lang === 'hi' ? ["मिस्र की बोली", "खाड़ी की बोली", "शाम की बोली", "मोरक्को की बोली"] : 
                   ["Egyptian Dialect", "Gulf Dialect", "Levantine Dialect", "Moroccan Dialect"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Clock,
      title: i18n.t('features.availability.title', { lng: lang }),
      description: i18n.t('features.availability.description', { lng: lang }),
      metric: i18n.t('features.availability.stats', { lng: lang }),
      color: "from-orange-500 to-red-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "الساعة 2 صباحاً، هل ما زلت متاحاً؟" : lang === 'tr' ? "Saat gece 2, hala müsait misiniz?" : lang === 'hi' ? "रात 2 बजे हैं, क्या आप अभी भी उपलब्ध हैं?" : "It's 2 AM, are you still available?" },
        { type: "ai", text: lang === 'ar' ? "بالطبع! أنا متاح على مدار الساعة لمساعدتك:" : lang === 'tr' ? "Tabii ki! Size yardım etmek için 7/24 müsaitim:" : lang === 'hi' ? "बिल्कुल! मैं आपकी मदद के लिए 24/7 उपलब्ध हूं:" : "Of course! I'm available 24/7 to help you:", 
          features: lang === 'ar' ? ["استجابة فورية", "لا انتظار", "جاهز دائماً", "مناطق زمنية عالمية"] : 
                   lang === 'tr' ? ["Anında Yanıt", "Bekleme Yok", "Her Zaman Hazır", "Küresel Saat Dilimleri"] : 
                   lang === 'hi' ? ["तत्काल प्रतिक्रिया", "कोई प्रतीक्षा नहीं", "हमेशा तैयार", "वैश्विक समय क्षेत्र"] : 
                   ["Instant Response", "No Waiting", "Always Ready", "Global Time Zones"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: BarChart3,
      title: i18n.t('features.analytics.title', { lng: lang }),
      description: i18n.t('features.analytics.description', { lng: lang }),
      metric: i18n.t('features.analytics.stats', { lng: lang }),
      color: "from-indigo-500 to-purple-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "ما هي نتائج حملتي التسويقية؟" : lang === 'tr' ? "Pazarlama kampanyamın sonuçları neler?" : lang === 'hi' ? "मेरे मार्केटिंग अभियान के परिणाम क्या हैं?" : "What are my marketing campaign results?" },
        { type: "ai", text: lang === 'ar' ? "إليك أحدث إحصائياتك المباشرة:" : lang === 'tr' ? "İşte en güncel canlı istatistikleriniz:" : lang === 'hi' ? "यहां आपके नवीनतम लाइव आंकड़े हैं:" : "Here are your latest live statistics:", 
          features: lang === 'ar' ? ["معدل التحويل: 18.7%", "المكالمات اليوم: 1,523", "معدل النجاح: 96.8%", "الإيرادات: $15,230"] : 
                   lang === 'tr' ? ["Dönüşüm Oranı: %18.7", "Bugünkü Aramalar: 1,523", "Başarı Oranı: %96.8", "Gelir: $15,230"] : 
                   lang === 'hi' ? ["रूपांतरण दर: 18.7%", "आज की कॉलें: 1,523", "सफलता दर: 96.8%", "राजस्व: $15,230"] : 
                   ["Conversion Rate: 18.7%", "Calls Today: 1,523", "Success Rate: 96.8%", "Revenue: $15,230"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Shield,
      title: i18n.t('features.leadQualification.title', { lng: lang }),
      description: i18n.t('features.leadQualification.description', { lng: lang }),
      metric: i18n.t('features.leadQualification.stats', { lng: lang }),
      color: "from-pink-500 to-purple-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "هل يمكنك تقييم جودة العملاء المحتملين؟" : lang === 'tr' ? "Potansiyel müşteri kalitesini değerlendirebilir misiniz?" : lang === 'hi' ? "क्या आप लीड की गुणवत्ता का आकलन कर सकते हैं?" : "Can you assess lead quality?" },
        { type: "ai", text: lang === 'ar' ? "بالطبع! أقوم بتقييم العملاء المحتملين باستخدام الذكاء الاصطناعي:" : lang === 'tr' ? "Tabii ki! AI kullanarak müşteri adaylarını değerlendiriyorum:" : lang === 'hi' ? "बिल्कुल! मैं AI का उपयोग करके संभावनाओं का मूल्यांकन करता हूं:" : "Absolutely! I evaluate prospects using AI:", 
          features: lang === 'ar' ? ["تحليل الميزانية المتاحة", "سلطة اتخاذ القرار", "تقييم الجدول الزمني", "تحديد الحاجة الفعلية"] : 
                   lang === 'tr' ? ["Mevcut Bütçe Analizi", "Karar Verme Yetkisi", "Zaman Çizelgesi Değerlendirmesi", "Gerçek İhtiyaç Belirleme"] : 
                   lang === 'hi' ? ["उपलब्ध बजट विश्लेषण", "निर्णय लेने की अधिकार", "समयसीमा मूल्यांकन", "वास्तविक आवश्यकता पहचान"] : 
                   ["Available Budget Analysis", "Decision-Making Authority", "Timeline Assessment", "Real Need Identification"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Globe,
      title: i18n.t('features.globalReach.title', { lng: lang }),
      description: i18n.t('features.globalReach.description', { lng: lang }),
      metric: i18n.t('features.globalReach.stats', { lng: lang }),
      color: "from-violet-500 to-purple-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "هل يمكنك العمل مع العملاء في جميع أنحاء العالم؟" : lang === 'tr' ? "Dünya çapındaki müşterilerle çalışabilir misiniz?" : lang === 'hi' ? "क्या आप दुनिया भर के ग्राहकों के साथ काम कर सकते हैं?" : "Can you work with clients worldwide?" },
        { type: "ai", text: lang === 'ar' ? "نعم! أقدم خدماتي للعملاء في جميع أنحاء العالم:" : lang === 'tr' ? "Evet! Dünya çapında müşterilere hizmet veriyorum:" : lang === 'hi' ? "हाँ! मैं दुनिया भर के ग्राहकों की सेवा करता हूं:" : "Yes! I serve clients worldwide:", 
          features: lang === 'ar' ? ["لهجات محلية أصيلة", "وعي ثقافي عميق", "إدارة المناطق الزمنية", "الامتثال للقوانين المحلية"] : 
                   lang === 'tr' ? ["Otantik Yerel Lehçeler", "Derin Kültürel Farkındalık", "Saat Dilimi Yönetimi", "Yerel Yasalara Uyum"] : 
                   lang === 'hi' ? ["प्रामाणिक स्थानीय बोलियाँ", "गहरी सांस्कृतिक जागरूकता", "समय क्षेत्र प्रबंधन", "स्थानीय कानूनी अनुपालन"] : 
                   ["Authentic Local Dialects", "Deep Cultural Awareness", "Time Zone Management", "Local Legal Compliance"] },
        { type: "typing", text: "" }
      ]
    },
    {
      icon: Star,
      title: i18n.t('features.personalization.title', { lng: lang }),
      description: i18n.t('features.personalization.description', { lng: lang }),
      metric: i18n.t('features.personalization.stats', { lng: lang }),
      color: "from-yellow-500 to-orange-500",
      chatMessages: [
        { type: "user", text: lang === 'ar' ? "كيف تجعل كل مكالمة فريدة ومخصصة؟" : lang === 'tr' ? "Her aramayı nasıl benzersiz ve kişiselleştirilmiş yapıyorsunuz?" : lang === 'hi' ? "आप प्रत्येक कॉल को अद्वितीय और व्यक्तिगत कैसे बनाते हैं?" : "How do you make each call unique and personalized?" },
        { type: "ai", text: lang === 'ar' ? "أستخدم الذكاء الاصطناعي المتقدم للتخصيص:" : lang === 'tr' ? "Kişiselleştirme için gelişmiş AI kullanıyorum:" : lang === 'hi' ? "मैं व्यक्तिगतकरण के लिए उन्नत AI का उपयोग करता हूं:" : "I use advanced AI for personalization:", 
          features: lang === 'ar' ? ["تحليل التفاعلات السابقة", "المعرفة المتخصصة بالصناعة", "الاهتمامات الشخصية المحددة", "أسلوب التواصل المفضل"] : 
                   lang === 'tr' ? ["Önceki Etkileşim Analizi", "Sektörel Uzmanlık Bilgisi", "Spesifik Kişisel İlgi Alanları", "Tercih Edilen İletişim Tarzı"] : 
                   lang === 'hi' ? ["पिछली बातचीत विश्लेषण", "उद्योग विशेषज्ञता ज्ञान", "विशिष्ट व्यक्तिगत रुचियां", "पसंदीदा संचार शैली"] : 
                   ["Previous Interaction Analysis", "Industry Expertise Knowledge", "Specific Personal Interests", "Preferred Communication Style"] },
        { type: "typing", text: "" }
      ]
    }
    ];
  }, [i18n, i18n.language]);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Simulate calling animation for the first feature
  useEffect(() => {
    if (currentFeature === 0) {
      const callSequence = async () => {
        setIsCalling(true);
        setCallStatus('dialing');
        
        setTimeout(() => {
          setCallStatus('connecting');
        }, 2000);
        
        setTimeout(() => {
          setCallStatus('connected');
        }, 4000);
        
        setTimeout(() => {
          setCallStatus('idle');
          setIsCalling(false);
        }, 8000);
      };
      
      callSequence();
    }
  }, [currentFeature]);

  const currentFeatureData = features[currentFeature];
  const Icon = currentFeatureData.icon;

  const dialerButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className={`animated-banner rounded-xl sm:rounded-2xl lg:rounded-3xl mb-3 sm:mb-4 lg:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ aspectRatio: '16/7', minHeight: '470px' }}>
      <div className="relative z-10 h-full flex flex-col p-2 sm:p-3 lg:p-4 overflow-hidden">
        {/* Top Section: Language Selector and Title on Left */}
        <div className="flex items-start justify-between mb-1 sm:mb-2 lg:mb-3 flex-shrink-0">
          {/* Left Side: Language Selector and Title */}
          <div className="flex flex-col space-y-1 sm:space-y-1.5 lg:space-y-2">
            {/* Language Selector */}
            <div className="flex justify-start">
              <div className="flex space-x-1 sm:space-x-1.5 bg-white/20 backdrop-blur-sm rounded-full p-1 sm:p-1.5">
                {['en', 'ar', 'tr', 'hi'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => i18n.changeLanguage(lang)}
                    className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm lg:text-base font-medium transition-all duration-300 ${
                      currentLanguage === lang
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'ar' ? 'عربي' : lang === 'tr' ? 'TR' : 'हिंदी'}
                  </button>
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="text-left">
              <div className="flex items-center space-x-1 sm:space-x-1.5 mb-0.5 sm:mb-1">
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white/20 backdrop-blur-sm rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white animate-pulse" />
                </div>
                <h1 className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold text-white typing-animation" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                  {i18n.t('home.title', { lng: currentLanguage })}
                </h1>
              </div>
              <p className="text-[10px] sm:text-xs lg:text-sm text-white/90 font-medium" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                {i18n.t('home.subtitle', { lng: currentLanguage })}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2 lg:gap-3 flex-1 items-center min-h-0">
          {/* Left Side - Feature Showcase */}
          <div className="space-y-1.5 sm:space-y-2 lg:space-y-2.5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-4 border border-white/20">
              <div className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 mb-1 sm:mb-1.5 lg:mb-2">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br ${currentFeatureData.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg float-animation flex-shrink-0`}>
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm sm:text-base lg:text-lg font-bold text-white slide-in ${currentLanguage === 'hi' ? '' : 'truncate'}`} style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: currentLanguage === 'hi' ? 'normal' : 'nowrap', overflow: currentLanguage === 'hi' ? 'visible' : 'hidden', textOverflow: currentLanguage === 'hi' ? 'clip' : 'ellipsis', wordBreak: currentLanguage === 'hi' ? 'break-word' : 'normal'}}>
                    {currentFeatureData.title}
                  </h3>
                  <p className={`text-white/80 text-xs sm:text-sm ${currentLanguage === 'hi' ? '' : 'line-clamp-2'}`} style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: currentLanguage === 'hi' ? 'normal' : 'normal', overflow: currentLanguage === 'hi' ? 'visible' : 'hidden', wordBreak: currentLanguage === 'hi' ? 'break-word' : 'normal', maxHeight: currentLanguage === 'hi' ? 'none' : '3em'}}>
                    {currentFeatureData.description}
                  </p>
                </div>
              </div>
              
              {/* Metric Badge */}
              <div className="inline-block mt-1 sm:mt-1.5">
                <span className="bg-white/20 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm backdrop-blur-sm pulse-glow">
                  {currentFeatureData.metric}
                </span>
              </div>
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-start space-x-1 sm:space-x-1.5 lg:space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 rounded-full transition-all duration-300 ${
                    index === currentFeature 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Dynamic Interface */}
          <div className="relative h-full flex items-center justify-center lg:justify-end min-h-0 transform -translate-y-7 sm:-translate-y-9 lg:-translate-y-12">
            {currentFeatureData.dialerInterface ? (
              /* Phone Dialer Interface */
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/20 float-animation w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl p-1.5 sm:p-2 lg:p-2.5 shadow-2xl">
                  {/* Call Header */}
                  <div className="text-center mb-1 sm:mb-1.5 lg:mb-2">
                    <div className="flex items-center justify-center space-x-1 mb-0.5 sm:mb-1">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[10px] sm:text-xs lg:text-sm font-bold text-gray-800 truncate" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip'}}>
                          {t('dialer.aiSalesAgent')}
                        </h3>
                        <p className="text-[9px] sm:text-[10px] text-gray-600 truncate" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: 'normal', overflow: 'visible'}}>
                          {t('dialer.sparkAISystem')}
                        </p>
                      </div>
                    </div>
                    
                    {/* Call Status */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                        {callStatus === 'dialing' && (
                          <>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] sm:text-[10px] text-yellow-600 font-medium" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                              {t('dialer.dialing')}
                            </span>
                          </>
                        )}
                        {callStatus === 'connecting' && (
                          <>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] sm:text-[10px] text-blue-600 font-medium" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                              {t('dialer.connecting')}
                            </span>
                          </>
                        )}
                        {callStatus === 'connected' && (
                          <>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] sm:text-[10px] text-blue-600 font-medium" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                              {t('dialer.connected')}
                            </span>
                          </>
                        )}
                        {callStatus === 'idle' && (
                          <>
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-500 rounded-full"></div>
                            <span className="text-[9px] sm:text-[10px] text-gray-600 font-medium" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                              {t('dialer.readyToCall')}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Phone Number Display */}
                      <div className="bg-gray-100 rounded-md p-1 sm:p-1.5">
                        <p className="text-[10px] sm:text-xs font-mono text-gray-800">+1 (555) 123-4567</p>
                        <p className="text-[9px] text-gray-500 truncate" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: 'normal', overflow: 'visible'}}>
                          {currentLanguage === 'ar' ? 'جون سميث - عميل محتمل' : currentLanguage === 'tr' ? 'John Smith - Satış Adayı' : currentLanguage === 'hi' ? 'जॉन स्मिथ - सेल्स लीड' : 'John Smith - Sales Lead'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Call Controls */}
                  <div className="flex justify-center space-x-1 sm:space-x-1.5 mb-1 sm:mb-1.5">
                    <button className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300">
                      <PhoneOff className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                    </button>
                    <button className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg">
                      <PhoneCall className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5 text-white" />
                    </button>
                    <button className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
                      <Volume2 className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                    </button>
                  </div>

                  {/* Dialer Pad */}
                  <div className="space-y-0.5 sm:space-y-1">
                    {dialerButtons.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center space-x-0.5 sm:space-x-1">
                        {row.map((button) => (
                          <button
                            key={button}
                            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700 transition-colors duration-300 text-[10px] sm:text-xs"
                          >
                            {button}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Call Stats */}
                  <div className="mt-1 sm:mt-1.5 pt-0.5 sm:pt-1 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-0.5 sm:gap-1 text-center">
                      <div>
                        <p className="text-[9px] text-gray-500" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                          {t('dialer.duration')}
                        </p>
                        <p className="text-[9px] font-semibold text-gray-800">00:02:34</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                          {t('dialer.quality')}
                        </p>
                        <p className="text-[9px] font-semibold text-blue-600" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                          {t('dialer.excellent')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                          {t('dialer.sentiment')}
                        </p>
                        <p className="text-[9px] font-semibold text-blue-600" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
                          {t('dialer.positive')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Chat Interface */
              <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-1 sm:p-1.5 lg:p-2 border border-white/20 float-animation w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[280px]">
                <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl p-1.5 sm:p-2 shadow-2xl">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <div className="flex items-center space-x-0.5 sm:space-x-1">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center flex-shrink-0">
                        <Bot className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                      </div>
                      <span className="font-semibold text-gray-800 text-[10px] sm:text-xs lg:text-sm" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit', whiteSpace: 'normal', overflow: 'visible'}}>
                        {t('dialer.aiAgent')}
                      </span>
                    </div>
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>

                  {/* Dynamic Chat Interface */}
                  <div className="space-y-0.5 sm:space-y-1 max-h-[120px] sm:max-h-[140px] lg:max-h-[160px] overflow-y-auto">
                    {currentFeatureData.chatMessages.map((message, index) => {
                      const textDirection = currentLanguage === 'ar' ? 'rtl' : 'ltr';
                      const textFontFamily = currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit';
                      return (
                      <div key={index} className={`fade-in`} style={{animationDelay: `${index * 0.5}s`}}>
                        {message.type === "user" && (
                          <div className="flex justify-end">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-1.5 sm:px-2 py-1 rounded-lg sm:rounded-xl rounded-br-md max-w-[85%]">
                              <p className="text-[10px] sm:text-xs" style={{direction: textDirection, fontFamily: textFontFamily}}>
                                {message.text}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {message.type === "ai" && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 px-1.5 sm:px-2 py-1 rounded-lg sm:rounded-xl rounded-bl-md max-w-[85%]">
                              <p className="text-[10px] sm:text-xs text-gray-800" style={{direction: textDirection, fontFamily: textFontFamily}}>
                                {message.text}
                              </p>
                              {message.features && (
                                <div className="mt-0.5 sm:mt-1 space-y-0.5">
                                  {message.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-0.5 sm:space-x-1">
                                      <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${currentFeatureData.color} flex-shrink-0`}></div>
                                      <span className="text-[9px] sm:text-[10px] text-gray-600" style={{direction: textDirection, fontFamily: textFontFamily}}>
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {message.type === "typing" && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 px-1.5 sm:px-2 py-1 rounded-lg sm:rounded-xl rounded-bl-md">
                              <div className="flex space-x-0.5">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Elements */}
            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center bounce-animation">
              <Zap className="h-2 w-2 lg:h-2.5 lg:w-2.5 text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 lg:-bottom-2 lg:-left-2 w-3 h-3 lg:w-4 lg:h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center rotate-animation">
              <Sparkles className="h-1.5 w-1.5 lg:h-2 lg:w-2 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-2 sm:mt-3 lg:mt-4 grid grid-cols-2 md:grid-cols-4 gap-0.5 sm:gap-1 lg:gap-2 flex-shrink-0">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg lg:rounded-xl p-1 sm:p-1.5 lg:p-2 border border-white/20 text-center fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center mx-auto mb-0.5 sm:mb-1">
                  <StatIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm font-bold text-white">{stat.value}</div>
                <div 
                  className="text-[9px] sm:text-[10px] lg:text-xs text-white/80" 
                  style={{
                    direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', 
                    fontFamily: (currentLanguage === 'hi' || currentLanguage === 'ar') ? 'system-ui, -apple-system, sans-serif' : 'inherit', 
                    whiteSpace: 'normal', 
                    overflow: 'visible', 
                    textOverflow: 'clip', 
                    wordBreak: 'break-word',
                    lineHeight: '1.3',
                    minHeight: currentLanguage === 'hi' || currentLanguage === 'ar' ? '2.5em' : 'auto'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-1 sm:mt-1.5 lg:mt-2 flex-shrink-0">
          <div className="w-full bg-white/20 rounded-full h-0.5 sm:h-1 lg:h-1.5">
            <div 
              className="h-0.5 sm:h-1 lg:h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((currentFeature + 1) / features.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-0.5 sm:mt-0.5 lg:mt-1">
            <span className="text-white/80 text-[9px] sm:text-[10px] lg:text-xs" style={{direction: currentLanguage === 'ar' ? 'rtl' : 'ltr', fontFamily: currentLanguage === 'hi' ? 'system-ui, -apple-system, sans-serif' : 'inherit'}}>
              {currentFeature + 1} {t('progress').replace('{total}', features.length.toString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
