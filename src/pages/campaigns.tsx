import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Menu, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api, type Campaign } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import { useToast } from "@/hooks/use-toast";
import CampaignManagement from "@/components/campaign-management";
import { CampaignCard } from "@/components/campaign-card";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import CampaignWorkflowBanner from "@/components/campaign-workflow-banner";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useAuth } from "@/hooks/use-auth";

interface CampaignManagementProps {
  campaignId?: string;
}

export default function Campaigns({ campaignId }: CampaignManagementProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: api.getCampaigns,
    refetchInterval: 30000, // Refresh every 30 seconds to get updated campaign progress
  });

  // Refresh user data when campaigns are updated to show updated minutes balance
  useEffect(() => {
    if (campaigns) {
      refreshUser();
    }
  }, [campaigns, refreshUser]);

  const deleteCampaignMutation = useMutation({
    mutationFn: (id: number) => api.deleteCampaign(id),
    onSuccess: () => {
      toast({
        title: t('campaigns.deleteSuccess'),
        description: t('campaigns.deleteSuccessMessage'),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setShowDeleteDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: t('campaigns.deleteError'),
        description: error.message || t('campaigns.deleteErrorMessage'),
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (campaignToDelete) {
      deleteCampaignMutation.mutate(campaignToDelete.id);
    }
  };

  const handleEditClick = (campaign: Campaign) => {
    // Validate that campaign can be edited (draft status with no calls)
    const canEdit = campaign.status === 'draft' && (campaign.completedCalls || 0) === 0;
    
    if (!canEdit) {
      toast({
        title: t('campaigns.cannotEditTitle'),
        description: campaign.status !== 'draft' 
          ? t('campaigns.cannotEditDraft')
          : t('campaigns.cannotEditWithCalls'),
        variant: "destructive",
      });
      return;
    }
    
    setLocation(`/campaigns/${campaign.id}/edit`);
  };

  const filteredCampaigns = campaigns?.filter((campaign: Campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-2.5 overflow-hidden min-h-[88px] flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <defs>
                <pattern id="campaigns-header-pattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
                  <circle cx="35" cy="35" r="2" fill="currentColor" className="text-purple-500"/>
                  <path d="M35 0L35 30M0 35L30 35M35 35L35 65M40 35L70 35" stroke="currentColor" strokeWidth="1" className="text-purple-400"/>
                  <circle cx="35" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-purple-300"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campaigns-header-pattern)"/>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-28 w-5 h-5 bg-purple-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-28 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="flex items-center justify-between relative z-10 w-full">
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
                    <SheetContent side="left" className="w-[287.27px] p-0 bg-white/95 dark:bg-brand-900/95 backdrop-blur-sm sm:backdrop-blur-xl">
                      <Sidebar />
                    </SheetContent>
                  </Sheet>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-black dark:text-black spark-gradient-text">{t('campaigns.title')}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">{t('campaigns.subtitle')}</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-4">
            {/* Campaign Workflow Banner */}
            <CampaignWorkflowBanner />
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('campaigns.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800"
                />
              </div>
              <Button
                onClick={() => setLocation("/campaigns/new")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('campaigns.createNew')}
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-300">{t('campaigns.loading')}</p>
              </div>
            ) : filteredCampaigns?.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('campaigns.noCampaigns')}</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{t('campaigns.noCampaignsDesc')}</p>
                <button 
                  onClick={() => setLocation("/campaigns/new")} 
                  className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {t('campaigns.createFirst')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCampaigns?.map((campaign: Campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    onDelete={handleDeleteClick}
                    onEdit={handleEditClick}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('campaigns.deleteConfirmTitle')}</DialogTitle>
            <DialogDescription>
              {(() => {
                let message = t('campaigns.deleteConfirmMessage', { name: campaignToDelete?.name });
                // Ensure {name} and {{name}} are replaced (fallback if interpolation didn't work)
                const campaignName = campaignToDelete?.name || 'this campaign';
                message = message.replace(/\{name\}/g, campaignName);
                message = message.replace(/\{\{name\}\}/g, campaignName);
                return message;
              })()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteCampaignMutation.isPending}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteCampaignMutation.isPending}
            >
              {deleteCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('campaigns.deleting')}
                </>
              ) : (
                t('common.delete')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}