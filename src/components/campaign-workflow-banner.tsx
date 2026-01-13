import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Settings, 
  Rocket, 
  Users, 
  Phone, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  Square
} from 'lucide-react';

const CampaignWorkflowBanner = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setLocation] = useLocation();
  const currentLanguage = i18n.language;

  const workflowSteps = useMemo(() => [
    {
      id: 1,
      title: t('campaignWorkflow.step1.title'),
      description: t('campaignWorkflow.step1.description'),
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      details: [
        t('campaignWorkflow.step1.details.0'),
        t('campaignWorkflow.step1.details.1'),
        t('campaignWorkflow.step1.details.2'),
        t('campaignWorkflow.step1.details.3')
      ],
      features: [
        t('campaignWorkflow.step1.features.0'),
        t('campaignWorkflow.step1.features.1'),
        t('campaignWorkflow.step1.features.2')
      ]
    },
    {
      id: 2,
      title: t('campaignWorkflow.step2.title'),
      description: t('campaignWorkflow.step2.description'),
      icon: Users,
      color: "from-purple-500 to-pink-500",
      details: [
        t('campaignWorkflow.step2.details.0'),
        t('campaignWorkflow.step2.details.1'),
        t('campaignWorkflow.step2.details.2'),
        t('campaignWorkflow.step2.details.3')
      ],
      features: [
        t('campaignWorkflow.step2.features.0'),
        t('campaignWorkflow.step2.features.1'),
        t('campaignWorkflow.step2.features.2')
      ]
    },
    {
      id: 3,
      title: t('campaignWorkflow.step3.title'),
      description: t('campaignWorkflow.step3.description'),
      icon: Settings,
      color: "from-blue-500 to-purple-500",
      details: [
        t('campaignWorkflow.step3.details.0'),
        t('campaignWorkflow.step3.details.1'),
        t('campaignWorkflow.step3.details.2'),
        t('campaignWorkflow.step3.details.3')
      ],
      features: [
        t('campaignWorkflow.step3.features.0'),
        t('campaignWorkflow.step3.features.1'),
        t('campaignWorkflow.step3.features.2')
      ]
    },
    {
      id: 4,
      title: t('campaignWorkflow.step4.title'),
      description: t('campaignWorkflow.step4.description'),
      icon: Rocket,
      color: "from-orange-500 to-red-500",
      details: [
        t('campaignWorkflow.step4.details.0'),
        t('campaignWorkflow.step4.details.1'),
        t('campaignWorkflow.step4.details.2'),
        t('campaignWorkflow.step4.details.3')
      ],
      features: [
        t('campaignWorkflow.step4.features.0'),
        t('campaignWorkflow.step4.features.1'),
        t('campaignWorkflow.step4.features.2')
      ]
    },
    {
      id: 5,
      title: t('campaignWorkflow.step5.title'),
      description: t('campaignWorkflow.step5.description'),
      icon: BarChart3,
      color: "from-indigo-500 to-purple-500",
      details: [
        t('campaignWorkflow.step5.details.0'),
        t('campaignWorkflow.step5.details.1'),
        t('campaignWorkflow.step5.details.2'),
        t('campaignWorkflow.step5.details.3')
      ],
      features: [
        t('campaignWorkflow.step5.features.0'),
        t('campaignWorkflow.step5.features.1'),
        t('campaignWorkflow.step5.features.2')
      ]
    }
  ], [t, currentLanguage]);

  const currentStepData = workflowSteps[currentStep];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [workflowSteps.length]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 lg:mb-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            {t('campaignWorkflow.title')}
          </h2>
          <p className="text-slate-200 text-sm sm:text-base md:text-lg">
            {t('campaignWorkflow.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
          {/* Left Side - Current Step */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentStepData.color} shadow-lg`}>
                  <currentStepData.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('campaignWorkflow.step')} {currentStepData.id}: {currentStepData.title}
                  </h3>
                  <p className="text-slate-200">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              {/* Step Details */}
              <div className="space-y-3">
                {currentStepData.details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-white/90">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {currentStepData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Workflow Steps */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-white mb-4">{t('campaignWorkflow.workflowTitle')}</h4>
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  index === currentStep
                    ? 'bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentStep(index);
                    setIsAnimating(false);
                  }, 300);
                }}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${step.color} ${
                  index === currentStep ? 'scale-110' : 'scale-100'
                } transition-transform duration-300`}>
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white/80">
                      {t('campaignWorkflow.step')} {step.id}
                    </span>
                    {index === currentStep && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                  <h5 className="text-white font-semibold">{step.title}</h5>
                  <p className="text-brand-200 text-sm">{step.description}</p>
                </div>
                {index === currentStep && (
                  <ArrowRight className="h-5 w-5 text-white animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {workflowSteps.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'bg-white scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentStep(index);
                  setIsAnimating(false);
                }, 300);
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <button 
            onClick={() => setLocation("/campaigns/new")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Play className="h-5 w-5" />
            <span>{t('campaignWorkflow.startFirstCampaign')}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignWorkflowBanner;
