import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock, CheckCircle, Mic, MicOff, Volume2, VolumeX, User, Building2, Zap, Trash2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'voice' | 'call_request';
}

interface CallRequest {
  name: string;
  phone: string;
  industry: string;
  company?: string;
}

export default function LiveChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('chat.welcomeMessage'),
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [callRequest, setCallRequest] = useState<CallRequest>({
    name: '',
    phone: '',
    industry: '',
    company: ''
  });
  const [isSubmittingCall, setIsSubmittingCall] = useState(false);

  // Cleanup effect when component unmounts or chat is closed
  useEffect(() => {
    return () => {
      // Stop any ongoing speech synthesis when component unmounts
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  // Cleanup when chat is closed
  useEffect(() => {
    if (!isOpen) {
      // Stop any ongoing speech synthesis when chat is closed
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      // Reset speaking state
      setIsSpeaking(false);
    }
  }, [isOpen]);

  const quickReplies = [
    t('chat.quickReplies.cost'),
    t('chat.quickReplies.freeTrial'),
    t('chat.quickReplies.howItWorks'),
    t('chat.quickReplies.demo')
  ];

  const industries = [
    "Real Estate",
    "Healthcare",
    "Finance",
    "E-commerce",
    "Education",
    "Technology",
    "Marketing",
    "Insurance",
    "Automotive",
    "Other"
  ];

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || newMessage;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Check if user wants a call
    if (text.toLowerCase().includes('call me') || text.toLowerCase().includes('demo call')) {
      setTimeout(() => {
        setShowCallForm(true);
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Simulate bot response with voice
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Auto-speak the response
      speakText(botResponse);
    }, 1500);
  };

  const getBotResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('cost') || message.includes('price') || message.includes('pricing')) {
      return t('chat.responses.pricing');
    }
    
    if (message.includes('free') || message.includes('trial')) {
      return t('chat.responses.freeTrial');
    }
    
    if (message.includes('demo') || message.includes('how') || message.includes('work')) {
      return t('chat.responses.demo');
    }
    
    if (message.includes('setup') || message.includes('start')) {
      return t('chat.responses.setup');
    }
    
    return t('chat.responses.default');
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      utterance.onpause = () => setIsSpeaking(false);
      utterance.onresume = () => setIsSpeaking(true);
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const handleCallRequest = async () => {
    if (!callRequest.name || !callRequest.phone || !callRequest.industry) {
      return;
    }

    setIsSubmittingCall(true);
    
    // Simulate API call
    setTimeout(() => {
      const successMessage: Message = {
        id: Date.now(),
        text: t('chat.callScheduled', { phone: callRequest.phone, industry: callRequest.industry }),
        isUser: false,
        timestamp: new Date(),
        type: 'call_request'
      };
      
      setMessages(prev => [...prev, successMessage]);
      setShowCallForm(false);
      setCallRequest({ name: '', phone: '', industry: '', company: '' });
      setIsSubmittingCall(false);
      
      // Speak the success message
      speakText(successMessage.text);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: t('chat.welcomeMessage'),
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }
    ]);
    setShowCallForm(false);
    setCallRequest({
      name: '',
      phone: '',
      industry: '',
      company: ''
    });
  };

  const backToMain = () => {
    clearChat();
    // Reset any other states to initial values
    setIsTyping(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsSubmittingCall(false);
  };

  const handleCloseChat = () => {
    // Stop any ongoing speech synthesis
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    // Clear the chat
    clearChat();
    
    // Reset all states
    setIsTyping(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsSubmittingCall(false);
    
    // Close the chat
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="ml-2 hidden sm:inline">{t('chat.chatWithUs')}</span>
          </Button>
          
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-white animate-pulse">
            <div className="w-full h-full bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{t('chat.aiSalesSupport')}</h3>
                <div className="flex items-center space-x-1 text-sm opacity-90">
                  <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                  <span>{t('chat.onlineNow')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title={t('chat.clearChat')}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={backToMain}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title={t('chat.backToMain')}
              >
                <Home className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                title={isSpeaking ? t('chat.stopSpeaking') : t('chat.aiVoice')}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleCloseChat}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${
                      message.isUser ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {!message.isUser && (
                      <button
                        onClick={() => speakText(message.text)}
                        className="text-xs text-purple-500 hover:text-purple-600 transition-colors"
                        title={t('chat.listenToMessage')}
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t('chat.quickQuestions')}</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(reply)}
                    className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Call Request Form */}
          {showCallForm && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{t('chat.freeDemoCall')}</h4>
                </div>
                
                <input
                  type="text"
                  placeholder={t('chat.yourName')}
                  value={callRequest.name}
                  onChange={(e) => setCallRequest(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                
                <input
                  type="tel"
                  placeholder={t('chat.phoneNumber')}
                  value={callRequest.phone}
                  onChange={(e) => setCallRequest(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                
                <select
                  value={callRequest.industry}
                  onChange={(e) => setCallRequest(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                >
                  <option value="">{t('chat.selectIndustry')}</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder={t('chat.companyName')}
                  value={callRequest.company}
                  onChange={(e) => setCallRequest(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCallRequest}
                    disabled={!callRequest.name || !callRequest.phone || !callRequest.industry || isSubmittingCall}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    {isSubmittingCall ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('chat.scheduling')}
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        {t('chat.scheduleDemoCall')}
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowCallForm(false)}
                    variant="outline"
                    className="px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.typeMessage')}
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <Button
                onClick={startListening}
                disabled={isListening}
                variant="outline"
                className="px-3"
                title={t('chat.voiceInput')}
              >
                {isListening ? (
                  <div className="animate-pulse">
                    <MicOff className="h-4 w-4 text-red-500" />
                  </div>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Contact Options */}
            <div className="flex justify-center space-x-4 mt-3 text-xs">
              <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-purple-500 transition-colors">
                <Phone className="h-3 w-3" />
                <span>{t('chat.call')}</span>
              </button>
              <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-purple-500 transition-colors">
                <Mail className="h-3 w-3" />
                <span>{t('chat.email')}</span>
              </button>
              <button className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-purple-500 transition-colors">
                <Clock className="h-3 w-3" />
                <span>{t('chat.schedule')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
