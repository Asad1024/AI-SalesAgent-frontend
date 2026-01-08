import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye, TrendingUp, Users, Phone, Square, Play, Loader2 } from "lucide-react";
import { api, type Campaign } from "@/lib/api";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { CampaignCard } from "@/components/campaign-card";

export default function CampaignsOverview() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  const { data: campaignsData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: () => api.getCampaigns(),
    refetchInterval: 30000, // Refresh every 30 seconds (reduced frequency)
    retry: 1, // Retry once on failure
    retryDelay: 500, // Wait 0.5 seconds between retries
    staleTime: 15000, // Consider data stale after 15 seconds
    gcTime: 60000, // Keep in cache for 60 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce load
  });

  // Handle both array response and object with campaigns property
  const campaignsArray = Array.isArray(campaignsData) 
    ? campaignsData 
    : (campaignsData?.campaigns || []);
  const allCampaigns = campaignsArray as Campaign[];
  const displayedCampaigns = allCampaigns.slice(0, 3); // Show only 3 most recent

  const deleteCampaignMutation = useMutation({
    mutationFn: (id: number) => api.deleteCampaign(id),
    onSuccess: () => {
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
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
    const canEdit = campaign.status === 'draft' && (campaign.completedCalls || 0) === 0;
    
    if (!canEdit) {
      toast({
        title: "Cannot Edit Campaign",
        description: campaign.status !== 'draft' 
          ? "Only draft campaigns can be edited" 
          : "Cannot edit campaigns with completed calls",
        variant: "destructive",
      });
      return;
    }
    
    setLocation(`/campaigns/${campaign.id}/edit`);
  };

  const getTotalStats = () => {
    if (!allCampaigns || allCampaigns.length === 0) {
      return { total: 0, active: 0, completed: 0, totalCalls: 0 };
    }
    
    return {
      total: allCampaigns.length,
      active: allCampaigns.filter(c => c.status === 'active').length,
      completed: allCampaigns.filter(c => c.status === 'completed').length,
      totalCalls: allCampaigns.reduce((sum, c) => sum + (c.completedCalls || 0), 0)
    };
  };

  const stats = getTotalStats();

  // Show error state with retry button
  if (error && !campaignsData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-4">
            Failed to load campaigns. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Stats Overview */}
      {isLoading && !campaignsData ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border bg-card/50 backdrop-blur-sm animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-7 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">{t('dashboard.totalCampaigns')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

        <Card className="border border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">{t('dashboard.active')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Square className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">{t('common.completed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalCalls}</p>
                <p className="text-sm text-muted-foreground">{t('dashboard.totalCalls')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Campaigns Display - No Title */}
      <div className="space-y-4">
        {isLoading && !campaignsData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border bg-card/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayedCampaigns.length === 0 ? (
          <Card className="border border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('dashboard.noCampaignsYet')}</h3>
              <p className="text-muted-foreground mb-4">{t('dashboard.createNewCampaign')}</p>
              <Button 
                onClick={() => setLocation('/campaigns/new')}
                className="bg-primary hover:bg-primary/90"
              >
                {t('dashboard.createCampaign')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {displayedCampaigns.map((campaign: Campaign) => (
                <CampaignCard
                key={campaign.id} 
                  campaign={campaign}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditClick}
                />
            ))}
          </div>
            {allCampaigns.length > 3 && (
              <div className="flex justify-center pt-6">
                <Button
                  onClick={() => setLocation('/campaigns')}
                  variant="outline"
                  className="px-6 py-2 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>{t('dashboard.viewAll')}</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the "{campaignToDelete?.name}" campaign.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteCampaignMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteCampaignMutation.isPending}
            >
              {deleteCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
