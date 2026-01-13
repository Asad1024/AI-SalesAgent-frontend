import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Campaign } from "@/lib/api";
import { Eye, Edit, Trash2, Play, Pause, Square, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import UpgradeModal from "@/components/upgrade-modal";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onDelete, onEdit }: CampaignCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
      case "done":
      case "answered_briefly":
        return "bg-blue-500";
      case "active":
      case "running":
      case "in-progress":
      case "in_progress":
      case "calling":
      case "ringing":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "stopped":
        return "bg-red-500";
      case "failed":
      case "no_answer":
      case "busy":
        return "bg-red-500";
      case "draft":
      case "initiated":
      case "pending":
      case "queued":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const progress = campaign.totalLeads > 0 ? (campaign.completedCalls / campaign.totalLeads) * 100 : 0;
  
const canEdit = (campaign.status === 'draft' || campaign.status === 'initiated') && (campaign.completedCalls || 0) === 0;

  const getLanguageInfo = (lang: string) => {
    const languages: Record<string, { label: string; flag: string; color: string }> = {
      en: { label: 'EN', flag: '🇺🇸', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      tr: { label: 'TR', flag: '🇹🇷', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
      ar: { label: 'AR', flag: '🇦🇪', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      hi: { label: 'HI', flag: '🇮🇳', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    };
    return languages[lang] || languages.en;
  };

  const languageInfo = getLanguageInfo(campaign.language || 'en');

  const handleStopCampaign = async () => {
    let confirmMessage = t('campaigns.stopConfirmMessage', { name: campaign.name });
    // Ensure {name} is replaced (fallback if interpolation didn't work)
    const campaignName = campaign.name || 'this campaign';
    confirmMessage = confirmMessage.replace(/\{name\}/g, campaignName);
    confirmMessage = confirmMessage.replace(/\{\{name\}\}/g, campaignName);
    
    if (window.confirm(confirmMessage)) {
      try {
        await api.post(`/api/campaigns/${campaign.id}/stop`, {});
        toast({
          title: t('campaigns.stopped'),
          description: t('campaigns.stoppedMessage'),
        });
        // Refresh data without page reload
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
        refreshUser();
      } catch (error: any) {
        toast({
          title: t('common.error'),
          description: error.message || t('campaigns.deleteErrorMessage'),
          variant: "destructive"
        });
      }
    }
  };

  const handlePauseCampaign = async () => {
    let confirmMessage = t('campaigns.pauseConfirmMessage', { name: campaign.name });
    // Ensure {name} is replaced (fallback if interpolation didn't work)
    const campaignName = campaign.name || 'this campaign';
    confirmMessage = confirmMessage.replace(/\{name\}/g, campaignName);
    confirmMessage = confirmMessage.replace(/\{\{name\}\}/g, campaignName);
    
    if (window.confirm(confirmMessage)) {
      try {
        await api.post(`/api/campaigns/${campaign.id}/pause`, {});
        toast({
          title: t('campaigns.paused'),
          description: t('campaigns.pausedMessage'),
        });
        // Refresh data without page reload
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
        refreshUser();
      } catch (error: any) {
        toast({
          title: t('common.error'),
          description: error.message || t('campaigns.deleteErrorMessage'),
          variant: "destructive"
        });
      }
    }
  };

  const handleResumeCampaign = async () => {
    try {
      await api.post(`/api/campaigns/${campaign.id}/resume`, {});
      toast({
        title: t('campaigns.resumed'),
        description: t('campaigns.resumedMessage'),
      });
      // Refresh data without page reload
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      refreshUser();
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('campaigns.deleteErrorMessage'),
        variant: "destructive"
      });
    }
  };

  const handleStartCampaign = async () => {
    // Check if user has minutes available (can't predict required minutes since call duration is unknown)
    const userMinutes = user?.creditsBalance || 0;
    
    if (userMinutes <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    let confirmMessage = t('campaigns.startConfirmMessage', { name: campaign.name });
    // Ensure {name} is replaced (fallback if interpolation didn't work)
    const campaignName = campaign.name || 'this campaign';
    confirmMessage = confirmMessage.replace(/\{name\}/g, campaignName);
    confirmMessage = confirmMessage.replace(/\{\{name\}\}/g, campaignName);
    
    if (window.confirm(confirmMessage)) {
      try {
        await api.post(`/api/campaigns/start-campaign`, { campaignId: campaign.id });
        toast({
          title: t('campaigns.started'),
          description: t('campaigns.startedMessage'),
        });
        // Refresh data without page reload
        queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
        refreshUser();
      } catch (error: any) {
        // Check if error is due to insufficient credits
        const errorMessage = error.message || error.error || '';
        if (errorMessage.toLowerCase().includes('insufficient credits') || errorMessage.toLowerCase().includes('insufficient')) {
          setShowUpgradeModal(true);
        } else {
          toast({
            title: t('common.error'),
            description: errorMessage || t('campaigns.deleteErrorMessage'),
            variant: "destructive"
          });
        }
      }
    }
  };

  const canStart = campaign.status === 'draft' || campaign.status === 'stopped' || campaign.status === 'initiated';
  const canPause = campaign.status === 'active' || campaign.status === 'running' || campaign.status === 'in-progress' || campaign.status === 'in_progress' || campaign.status === 'calling' || campaign.status === 'ringing';
  const canResume = campaign.status === 'paused';
  const canStop = campaign.status === 'active' || campaign.status === 'running' || campaign.status === 'in-progress' || campaign.status === 'in_progress' || campaign.status === 'calling' || campaign.status === 'ringing' || campaign.status === 'paused';

  return (
    <>
      <Card className="relative bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-gray-200/20 shadow-lg rounded-2xl overflow-hidden group">
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-3 h-3 rounded-full ${getStatusClass(campaign.status)}`}></div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">{campaign.name}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('campaigns.created')} {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${languageInfo.color} text-xs font-medium px-2 py-0.5`}>
              <span className="mr-1">{languageInfo.flag}</span>
              {languageInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{campaign.completedCalls}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('campaigns.totalCalls')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{campaign.successfulCalls}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('campaigns.successful')}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('campaigns.progress')}</p>
          <div className="flex items-center gap-2">
            <Progress value={progress} className="w-full" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="flex justify-center gap-2 py-3 border-t border-gray-200/20">
          {canStart && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStartCampaign}
              className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
            >
              <Play className="h-4 w-4" />
              <span className="text-xs">{t('campaigns.start')}</span>
            </Button>
          )}
          {canPause && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePauseCampaign}
              className="flex items-center gap-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <Pause className="h-4 w-4" />
              <span className="text-xs">{t('campaigns.pause')}</span>
            </Button>
          )}
          {canResume && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResumeCampaign}
              className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-xs">{t('campaigns.resume')}</span>
            </Button>
          )}
          {canStop && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStopCampaign}
              className="flex items-center gap-1 text-red-600 border-red-600 hover:bg-red-50"
            >
              <Square className="h-4 w-4" />
              <span className="text-xs">{t('campaigns.stop')}</span>
            </Button>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-200/20">
          <Button variant="ghost" size="icon" onClick={() => setLocation(`/campaigns/${campaign.id}`)}>
            <Eye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
          {canEdit ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(campaign)}
              title="Edit campaign"
            >
              <Edit className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              disabled
              title={campaign.status !== 'draft' && campaign.status !== 'initiated'
                ? t('campaigns.cannotEditPublished')
                : t('campaigns.cannotEditWithCompletedCalls')
              }
            >
              <Edit className="h-5 w-5 text-gray-300 dark:text-gray-600" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(campaign)}>
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
    
    <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
}
