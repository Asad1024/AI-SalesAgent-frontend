import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CampaignManagement from "@/components/campaign-management";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "react-i18next";

interface CampaignEditProps {
    id: string;
}

export default function CampaignEdit({ id }: CampaignEditProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Fetch campaign details to validate edit permissions
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: [`/api/campaigns/${id}`],
    queryFn: () => api.getCampaignDetails(id),
  });

  // Validate edit permissions
  useEffect(() => {
    if (campaign?.campaign) {
      const canEdit = campaign.campaign.status === 'draft' && (campaign.campaign.completedCalls || 0) === 0;
      
      if (!canEdit) {
        toast({
          title: "Cannot Edit Campaign",
          description: campaign.campaign.status !== 'draft' 
            ? "Only draft campaigns can be edited" 
            : "Cannot edit campaigns with completed calls",
          variant: "destructive",
        });
        setLocation('/campaigns');
      }
    }
  }, [campaign, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-brand-500 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Failed to load campaign</p>
            <Button onClick={() => window.history.back()} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-8 py-4 sm:py-2.5 min-h-[88px] flex items-center">
          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="hover:bg-brand-100 dark:hover:bg-brand-800"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-3xl font-bold text-black dark:text-black spark-gradient-text">
                  {t('dashboard.editCampaign')}
                </h2>
                <p className="text-black dark:text-black mt-2">{t('dashboard.updateYourAIVoiceCallingCampaign')}</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-transparent">
          <CampaignManagement campaignId={id} />
        </main>
      </div>
    </div>
  );
}
