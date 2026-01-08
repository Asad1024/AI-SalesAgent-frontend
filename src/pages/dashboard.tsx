import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/sidebar";
import CampaignSetup from "@/components/campaign-setup";
import VoiceSelection from "@/components/voice-selection";
import LeadsUpload from "@/components/leads-upload";
import CampaignActions from "@/components/campaign-actions";
import AnimatedBanner from "@/components/animated-banner";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sparkles,  Menu, Megaphone, Plus, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  } from "@/components/ui/sheet";
import CampaignsOverview from "@/components/campaigns-overview";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, refreshUser } = useAuth();
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [uploadedLeads, setUploadedLeads] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refresh user data on mount only (not periodically to prevent refreshes)
  useEffect(() => {
    refreshUser();
    // Removed periodic refresh to prevent page refreshes
    // Credits will update when user performs actions or manually refreshes
  }, [refreshUser]);

  const handleCampaignUpdate = (campaign: any) => {
    setCurrentCampaign(campaign);
    setUploadedLeads([]);
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const handleLeadsUpload = (leads: any[]) => {
    setUploadedLeads(leads);
  };

  useEffect(() => {
    if (currentCampaign?.id) {
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
    <div className="flex h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 dark:from-brand-900 dark:via-brand-800/20 dark:to-brand-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>
      
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Enhanced Header */}
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-2.5 overflow-hidden min-h-[88px] flex items-center border-l-0">
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
          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 hover:text-white transition-all duration-300 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] lg:w-[360px] p-0 bg-white/95 dark:bg-brand-900/95 backdrop-blur-sm sm:backdrop-blur-xl border-r border-brand-200/50 dark:border-brand-800/50">
                  <Sidebar />
                </SheetContent>
              </Sheet>
              
              <div>
                <h2 className="text-3xl font-bold text-black dark:text-black spark-gradient-text">
                  {t('common.dashboard')}
                </h2>
                <p className="text-black dark:text-black mt-2">
                  Manage your AI voice calling campaigns and sales automation
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 lg:p-6 xl:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8 pb-4">
            
            {/* Animated Banner */}
            <AnimatedBanner />
            
            {/* Campaign Configuration - Only show when a campaign is selected */}
            {currentCampaign && (
              <div className="space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-2 h-5 sm:h-6 lg:h-8 xl:h-10 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-800 dark:text-brand-200">
                    Campaign Configuration
                  </h3>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                  {/* Left Column: Configuration */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    <CampaignSetup 
                      campaign={currentCampaign}
                      onCampaignUpdate={handleCampaignUpdate}
                    />
                  </div>

                  {/* Right Column: Voice & Leads */}
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
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

            {/* Recent Campaigns Section - Merged and simplified */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-2 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-brand-800 dark:text-brand-200">
                    {t('dashboard.recentCampaigns')}
                  </h3>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setLocation("/campaigns/new")}
                    className="inline-flex items-center px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base hover:scale-105"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4 mr-1 sm:mr-2" />
                    {t('dashboard.createCampaign')}
                  </button>
                  <button
                    onClick={() => setLocation("/campaigns")}
                    className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base hover:scale-105"
                  >
                    <Megaphone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-1 sm:mr-2" />
                    {t('dashboard.viewAllCampaigns')}
                  </button>
                </div>
              </div>
              <CampaignsOverview />
            </div>

            {currentCampaign && (
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <div className="w-2 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-brand-500 to-brand-600 rounded-full"></div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-brand-800 dark:text-brand-200">
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
