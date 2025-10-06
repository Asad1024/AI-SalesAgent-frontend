import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractiveDemoProps {
  onClose: () => void;
}

export default function InteractiveDemo({ onClose }: InteractiveDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);

  const demoSteps = [
    {
      id: 0,
      title: "AI Agent Introduction",
      message: "Hi! I'm Sarah, your AI sales assistant. I'm calling to discuss how our AI calling system can help your business save 10+ hours per week while increasing conversions by 300%.",
      duration: 8000,
      type: "ai"
    },
    {
      id: 1,
      title: "Lead Qualification",
      message: "I understand you're interested in automating your sales calls. Can you tell me about your current calling volume and what challenges you're facing?",
      duration: 6000,
      type: "ai"
    },
    {
      id: 2,
      title: "Value Proposition",
      message: "That's exactly what we help with! Our AI agents work 24/7, never get tired, and can make 10x more calls than a human sales rep. Plus, they sound completely natural.",
      duration: 7000,
      type: "ai"
    },
    {
      id: 3,
      title: "Meeting Booking",
      message: "I'd love to show you a personalized demo. Are you available for a 15-minute call tomorrow at 2 PM to see how this could work for your business?",
      duration: 6000,
      type: "ai"
    },
    {
      id: 4,
      title: "Call Completion",
      message: "Perfect! I've scheduled your demo for tomorrow at 2 PM. You'll receive a calendar invite shortly. Thank you for your time, and I look forward to showing you how we can 10x your sales calls!",
      duration: 5000,
      type: "ai"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if (isPlaying && currentStep < demoSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, demoSteps[currentStep].duration);

      return () => clearTimeout(timer);
    } else if (currentStep >= demoSteps.length) {
      setIsPlaying(false);
      setIsCallActive(false);
    }
  }, [isPlaying, currentStep, demoSteps]);

  const startDemo = () => {
    setIsPlaying(true);
    setIsCallActive(true);
    setCurrentStep(0);
    setCallDuration(0);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    setIsCallActive(false);
    setCurrentStep(0);
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = demoSteps[currentStep] || demoSteps[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              🎯 Interactive AI Demo
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Experience how our AI agent sounds and performs
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Call Interface */}
        <div className="bg-gradient-to-br from-purple-500/10 to-green-500/10 rounded-2xl p-6 mb-6">
          {/* Call Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Sarah - AI Sales Agent</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {isCallActive ? 'Call in progress' : 'Ready to start'}
                  </span>
                </div>
              </div>
            </div>
            
            {isCallActive && (
              <div className="text-right">
                <div className="text-lg font-mono text-slate-800 dark:text-slate-200">
                  {formatTime(callDuration)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Duration</div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Step {currentStep + 1} of {demoSteps.length}</span>
              <span>{currentStepData.title}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* AI Message */}
          <div className="bg-white dark:bg-slate-700 rounded-xl p-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {currentStepData.message}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${
                          isPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'
                        }`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isPlaying ? 'Speaking...' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isPlaying ? (
              <Button
                onClick={startDemo}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3"
              >
                <Play className="mr-2 h-5 w-5" />
                Start Demo Call
              </Button>
            ) : (
              <Button
                onClick={stopDemo}
                variant="outline"
                className="px-6 py-3"
              >
                <Square className="mr-2 h-5 w-5" />
                Stop Demo
              </Button>
            )}
            
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="outline"
              className="px-4 py-3"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Demo Results */}
        {currentStep >= demoSteps.length && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-700 dark:text-green-400">Demo Complete!</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Call Duration:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 ml-2">{formatTime(callDuration)}</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Steps Completed:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 ml-2">{demoSteps.length}/5</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Meeting Booked:</span>
                <span className="font-medium text-green-600 dark:text-green-400 ml-2">Yes</span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Lead Quality:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400 ml-2">High</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready to experience this with your own leads?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-purple-700 text-white px-6 py-3">
              Start Free Trial
            </Button>
            <Button variant="outline" className="px-6 py-3">
              Schedule Live Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
