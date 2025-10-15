import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/sidebar";
import StatsOverview from "@/components/stats-overview";
import CampaignSetup from "@/components/campaign-setup";
import VoiceSelection from "@/components/voice-selection";
import LeadsUpload from "@/components/leads-upload";
import CampaignActions from "@/components/campaign-actions";
import CampaignSelector from "@/components/campaign-selector";
import AnimatedBanner from "@/components/animated-banner";
import LanguageSwitcher from "@/components/language-switcher";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Sun, Moon, Menu, Megaphone } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  } from "@/components/ui/sheet";
import CampaignsOverview from "@/components/campaigns-overview";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [uploadedLeads, setUploadedLeads] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleCampaignUpdate = (campaign: any) => {
    setCurrentCampaign(campaign);
    // Reset leads when switching campaigns
    setUploadedLeads([]);
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const handleLeadsUpload = (leads: any[]) => {
    setUploadedLeads(leads);
  };

  // Load leads when campaign changes
  useEffect(() => {
    if (currentCampaign?.id) {
      // Fetch existing leads for the selected campaign
      const token = localStorage.getItem('auth-token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      fetch(`/api/campaigns/${currentCampaign.id}/leads`, {
        headers,
        credentials: 'include'
      })
      .then(response => response.json())
      .then(leads => {
        if (Array.isArray(leads)) {
          setUploadedLeads(leads);
        }
      })
      .catch(error => {
        console.error('Failed to fetch leads:', error);
        setUploadedLeads([]);
      });
    } else {
      setUploadedLeads([]);
    }
  }, [currentCampaign?.id]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 dark:from-brand-900 dark:via-brand-800/20 dark:to-brand-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 shadow-sm overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <defs>
                <pattern id="header-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                  <circle cx="25" cy="25" r="1" fill="currentColor" className="text-brand-500"/>
                  <path d="M25 0L25 20M0 25L20 25M25 25L25 45M30 25L50 25" stroke="currentColor" strokeWidth="0.5" className="text-brand-400"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#header-pattern)"/>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-2 right-20 w-3 h-3 bg-brand-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-2 left-20 w-2 h-2 bg-green-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 hover:text-white transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[287.27px] p-0 bg-white/95 dark:bg-brand-900/95 backdrop-blur-xl">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              
              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center space-x-3">
                  <Logo size="lg" showText={true} />
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm sm:text-base lg:text-lg font-medium hidden sm:block">
                  {t('auth.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Animated Banner */}
            <AnimatedBanner />
            
            {/* Campaign Selection - Moved to Top */}
            {!currentCampaign ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-800 dark:text-brand-200">
                    Select Your Campaign
                  </h3>
                </div>
                <CampaignSelector onCampaignSelect={handleCampaignUpdate} />
              </div>
            ) : (
              // Enhanced Campaign Setup
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 sm:h-8 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-800 dark:text-brand-200">
                    Campaign Configuration
                  </h3>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                  {/* Left Column: Configuration */}
                  <div className="space-y-6">
                    <CampaignSetup 
                      campaign={currentCampaign}
                      onCampaignUpdate={handleCampaignUpdate}
                    />
                  </div>

                  {/* Right Column: Voice & Leads */}
                  <div className="space-y-6">
                    <VoiceSelection 
                      selectedVoiceId={selectedVoiceId}
                      onVoiceSelect={handleVoiceSelect}
                    />
                    <LeadsUpload 
                      campaignId={currentCampaign.id}
                      onLeadsUpload={handleLeadsUpload}
                      uploadedLeads={uploadedLeads}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-brand-800 dark:text-brand-200">
                    {t('dashboard.existingCampaigns')}
                  </h3>
                </div>
                <button
                  onClick={() => setLocation("/campaigns")}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  {t('dashboard.viewAllCampaigns')}
                </button>
              </div>
              <CampaignsOverview />
            </div>

            {currentCampaign && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-brand-800 dark:text-brand-200">
                    Launch & Monitor
                  </h3>
                </div>
                <CampaignActions 
                  campaign={currentCampaign}
                  selectedVoiceId={selectedVoiceId}
                  uploadedLeads={uploadedLeads}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
