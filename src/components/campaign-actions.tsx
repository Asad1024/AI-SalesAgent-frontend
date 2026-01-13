import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Rocket, Phone, Play, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import UpgradeModal from "@/components/upgrade-modal";

interface CampaignActionsProps {
  campaign: any;
  selectedVoiceId: string;
  uploadedLeads: any[];
}

export default function CampaignActions({ campaign, selectedVoiceId, uploadedLeads }: CampaignActionsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testFirstName, setTestFirstName] = useState("");
  const [testCallStatus, setTestCallStatus] = useState<"idle" | "calling" | "completed" | "failed">("idle");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const { toast } = useToast();

  // Test call mutation
  const testCallMutation = useMutation({
    mutationFn: (data: { phoneNumber: string; campaignId?: number; firstName?: string }) =>
      api.makeTestCall(data),
    onSuccess: (data) => {
      setTestCallStatus("completed");
      toast({
        title: t('campaignCreation.testCallSuccessful'),
        description: data.message || t('campaignCreation.testCallSuccessfulMessage'),
      });
      setTimeout(() => setTestCallStatus("idle"), 3000);
    },
    onError: (error: any) => {
      setTestCallStatus("failed");
      toast({
        title: t('campaignCreation.testCallFailed'),
        description: error.message || t('campaignCreation.testCallFailedMessage'),
        variant: "destructive",
      });
      setTimeout(() => setTestCallStatus("idle"), 3000);
    },
  });

  // Start campaign mutation
  const startCampaignMutation = useMutation({
    mutationFn: (campaignId: number) => api.startCampaign({ campaignId }),
    onSuccess: (data) => {
      toast({
        title: t('campaignCreation.campaignStarted'),
        description: data.message || t('campaignCreation.campaignStartedMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('campaignCreation.campaignStartFailed'),
        description: error.message || t('campaignCreation.campaignStartFailedMessage'),
        variant: "destructive",
      });
    },
  });

  const handleTestCall = () => {
    if (!testPhoneNumber.trim()) {
      toast({
        title: t('campaignCreation.phoneNumberRequired'),
        description: t('campaignCreation.phoneNumberRequiredMessage'),
        variant: "destructive",
      });
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
    if (!phoneRegex.test(testPhoneNumber.trim())) {
      toast({
        title: t('campaignCreation.invalidPhoneNumber'),
        description: t('campaignCreation.invalidPhoneNumberMessage'),
        variant: "destructive",
      });
      return;
    }

    if (!campaign) {
      toast({
        title: t('campaignCreation.noCampaign'),
        description: t('campaignCreation.noCampaignMessage2'),
        variant: "destructive",
      });
      return;
    }

    setTestCallStatus("calling");
    testCallMutation.mutate({
      phoneNumber: testPhoneNumber.trim(),
      campaignId: campaign.id,
      firstName: testFirstName.trim() || null
    });
  };

  const handleStartCampaign = () => {
    // Check if user has minutes available (can't predict required minutes since call duration is unknown)
    const userMinutes = user?.creditsBalance || 0;
    
    if (userMinutes <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    if (!campaign?.firstPrompt) {
      toast({
        title: t('campaignCreation.initialMessageRequired'),
        description: t('campaignCreation.initialMessageRequiredMessage'),
        variant: "destructive",
      });
      return;
    }

    if (!selectedVoiceId) {
      toast({
        title: t('campaignCreation.voiceRequired'),
        description: t('campaignCreation.voiceRequiredMessage'),
        variant: "destructive",
      });
      return;
    }

    if (!campaign?.knowledgeBaseId) {
      toast({
        title: t('dashboard.knowledgeBaseRequired'),
        description: t('campaignCreation.knowledgeBaseRequiredMessage'),
        variant: "destructive",
      });
      return;
    }

    if (uploadedLeads.length === 0) {
      toast({
        title: t('campaignCreation.leadsRequired'),
        description: t('campaignCreation.leadsRequiredMessage'),
        variant: "destructive",
      });
      return;
    }

    const confirmMessage = t('campaignCreation.startCampaignConfirmMessage2', {
      voiceId: selectedVoiceId,
      leadsCount: uploadedLeads.length,
      firstPrompt: campaign.firstPrompt,
      credits: requiredCredits
    });
    
    if (window.confirm(confirmMessage)) {
      startCampaignMutation.mutate(campaign.id);
    }
  };

  const estimatedDuration = Math.ceil(uploadedLeads.length * 2.5 / 60); // Assume 2.5 minutes per call average

  const isReadyToLaunch = campaign?.firstPrompt && selectedVoiceId && campaign?.knowledgeBaseId && uploadedLeads.length > 0;

  return (
    <>
      <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Campaign Launch</h3>
            <p className="text-sm text-muted-foreground font-medium">Test and start your campaign</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Test Call */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">Test Single Call</h4>
            <div className="flex flex-col space-y-3">
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="First Name (optional)"
                  value={testFirstName}
                  onChange={(e) => setTestFirstName(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex space-x-3">
                <Input
                  type="tel"
                  placeholder="+15551234567 or 5551234567 (US)"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleTestCall}
                  disabled={testCallMutation.isPending || testCallStatus === "calling" || !isReadyToLaunch}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {testCallStatus === "calling" ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calling...
                    </>
                  ) : testCallStatus === "completed" ? (
                    <>
                      <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                      Completed
                    </>
                  ) : testCallStatus === "failed" ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Failed
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Test Call
                    </>
                  )}
                </Button>
              </div>

              {/* Test Call Status */}
              {testCallStatus === "calling" && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-700">Making test call...</span>
                  </div>
                </div>
              )}

              {!isReadyToLaunch && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Complete all required steps to enable test calls:
                    <ul className="mt-2 list-disc list-inside">
                      {!campaign?.firstPrompt && <li>Set initial message</li>}
                      {!selectedVoiceId && <li>Select a voice</li>}
                      {!campaign?.knowledgeBaseId && <li>Upload knowledge base</li>}
                      {uploadedLeads.length === 0 && <li>Upload leads CSV</li>}
                    </ul>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Launch Campaign */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-800">Launch Campaign</h4>
            <div className="space-y-4">
              <Button
                onClick={handleStartCampaign}
                disabled={!isReadyToLaunch || startCampaignMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
              >
                {startCampaignMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Starting Campaign...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Campaign
                  </>
                )}
              </Button>

              {/* Campaign Requirements Status */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <h5 className="font-medium text-slate-700">Campaign Requirements:</h5>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${campaign?.firstPrompt ? 'bg-green-500' : 'bg-slate-300'}`}>
                      {campaign?.firstPrompt && <span className="text-white">✓</span>}
                    </div>
                    Initial Message {campaign?.firstPrompt ? 'Set' : 'Required'}
                  </li>
                  <li className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${selectedVoiceId ? 'bg-green-500' : 'bg-slate-300'}`}>
                      {selectedVoiceId && <span className="text-white">✓</span>}
                    </div>
                    Voice Selection {selectedVoiceId ? 'Complete' : 'Required'}
                  </li>
                  <li className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${campaign?.knowledgeBaseId ? 'bg-green-500' : 'bg-slate-300'}`}>
                      {campaign?.knowledgeBaseId && <span className="text-white">✓</span>}
                    </div>
                    {t('dashboard.knowledgeBase')} {campaign?.knowledgeBaseId ? t('dashboard.knowledgeBaseUploaded') : t('dashboard.knowledgeBaseRequired')}
                  </li>
                  <li className="flex items-center text-sm">
                    <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${uploadedLeads.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                      {uploadedLeads.length > 0 && <span className="text-white">✓</span>}
                    </div>
                    Leads CSV {uploadedLeads.length > 0 ? `(${uploadedLeads.length} leads)` : 'Required'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </>
  );
}
