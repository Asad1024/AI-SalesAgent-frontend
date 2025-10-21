import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { 
  FileText, 
  Bot, 
  Volume2, 
  Users, 
  Upload, 
  Play, 
  Pause,
  CheckCircle, 
  Circle,
  Plus,
  ArrowUp,
  FileIcon,
  Rocket,
  Phone,
  Trash2,
  Square,
  RotateCcw
} from 'lucide-react';

interface CampaignManagementProps {
  campaignId?: string;
}

interface Campaign {
  id: string;
  name: string;
  knowledgeBase: File[];
  aiConfig: {
    initialMessage: string;
    systemPersona: string;
  };
  selectedVoice: string;
  leads: File[];
}

export default function CampaignManagement({ campaignId }: CampaignManagementProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(campaignId ? 3 : 1);
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [knowledgeBaseFiles, setKnowledgeBaseFiles] = useState<any[]>([]);
  const [leadsFile, setLeadsFile] = useState<File | null>(null);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCloneForm, setShowCloneForm] = useState(false);
  const [cloneName, setCloneName] = useState('');
  const [cloneDescription, setCloneDescription] = useState('');
  const [voiceSearchTerm, setVoiceSearchTerm] = useState('');
  const [testCallData, setTestCallData] = useState({
    firstName: '',
    phoneNumber: '+971528588562'
  });
  const [campaignStatus, setCampaignStatus] = useState<any>(null);
  const [showCampaignStatus, setShowCampaignStatus] = useState(false);
  const [statusRefreshInterval, setStatusRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [showCSVPreview, setShowCSVPreview] = useState(false);
  const [csvLeads, setCsvLeads] = useState<any[]>([]);
  const [editingLeadIndex, setEditingLeadIndex] = useState<number | null>(null);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [selectedScript, setSelectedScript] = useState('friendly');
  const [customScript, setCustomScript] = useState('');
  const [campaignControlStatus, setCampaignControlStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');
  const [isUpdatingAgent, setIsUpdatingAgent] = useState(false);

  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n?.language || 'en';
  const normalizedLanguage = currentLanguage.split('-')[0].toLowerCase();
  const [defaultInitialMessage, setDefaultInitialMessage] = useState(() => t('campaignCreation.defaultInitialMessage'));
  const [defaultSystemPersona, setDefaultSystemPersona] = useState(() => t('campaignCreation.defaultSystemPersona'));
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setDefaultInitialMessage(t('campaignCreation.defaultInitialMessage'));
      setDefaultSystemPersona(t('campaignCreation.defaultSystemPersona'));
      if (currentCampaign) {
        const newDefaultMessage = t('campaignCreation.defaultInitialMessage');
        updateAIConfigWithScript('initialMessage', newDefaultMessage);
      }
    };
    
    i18n?.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n?.off('languageChanged', handleLanguageChange);
    };
    }, [i18n, currentCampaign]);
  useEffect(() => {
    setDefaultInitialMessage(t('campaignCreation.defaultInitialMessage'));
    setDefaultSystemPersona(t('campaignCreation.defaultSystemPersona'));
  }, [currentLanguage, t]);
  const queryClient = useQueryClient();

  const conversationScripts = {
    friendly: {
      name: "Friendly & Conversational",
      description: "Warm, natural conversation with empathy",
      opening: "Hi {name}, this is Sarah calling. I hope I'm not catching you at a bad time? I wanted to reach out about something that might be really helpful for you. Do you have a quick moment to chat?",
      system: "You are Sarah, a friendly and professional sales representative. Be conversational, warm, and empathetic. Use natural speech patterns and listen actively to responses."
    },
    professional: {
      name: "Professional & Direct",
      description: "Business-focused with clear value proposition",
      opening: "Hello {name}, this is Sarah from our company. I'm calling because I believe we can help you with {service}. Do you have a few minutes to discuss this?",
      system: "You are Sarah, a professional sales representative. Be direct but respectful. Focus on value proposition and business benefits."
    },
    consultative: {
      name: "Consultative Approach",
      description: "Question-based selling to understand needs",
      opening: "Hi {name}, this is Sarah. I'm calling to learn more about your current situation with {topic}. Would you be open to a brief conversation about this?",
      system: "You are Sarah, a consultative sales representative. Ask questions to understand their needs first, then provide solutions. Be patient and educational."
    },
    urgent: {
      name: "Urgent & Time-Sensitive",
      description: "Creates urgency with limited-time offers",
      opening: "Hi {name}, this is Sarah calling with some time-sensitive information that could really benefit you. Do you have just 2 minutes to hear about this opportunity?",
      system: "You are Sarah, a sales representative with time-sensitive information. Create appropriate urgency while being respectful of their time."
    },
    followup: {
      name: "Follow-up Call",
      description: "For returning leads and previous contacts",
      opening: "Hi {name}, this is Sarah calling to follow up on our previous conversation about {topic}. I wanted to see if you had any questions or if you're ready to move forward?",
      system: "You are Sarah, following up on a previous conversation. Be familiar but professional. Reference previous discussions and check on their decision-making process."
    }
  };

  // Fetch campaigns for "select existing" screen
  const { data: campaignsData, isLoading: isCampaignsLoading, error: campaignsError } = useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: () => api.getCampaigns(),
    enabled: !campaignId, // Only run when creating a new campaign
  });
  
  // Fetch specific campaign details when editing
  const { data: campaignDetails, isLoading: isCampaignDetailsLoading } = useQuery({
    queryKey: [`/api/campaigns/${campaignId}`],
    queryFn: () => api.getCampaignDetails(campaignId!),
    enabled: !!campaignId, // Only run when campaignId is provided
  });

  const isLoading = isCampaignsLoading || isCampaignDetailsLoading;

  // Effect to populate component state when editing an existing campaign
  useEffect(() => {
    if (campaignDetails?.campaign) {
      const campaign = campaignDetails.campaign;
      setCurrentCampaign(campaign);
      setSelectedVoice(campaign.selectedVoiceId || '');

      if (campaign.knowledgeBase?.length > 0) {
        setKnowledgeBaseFiles(campaign.knowledgeBase);
      }

      if (campaign.leads?.length > 0) {
        setCsvLeads(campaign.leads);
        // Create a mock file for display purposes
        setLeadsFile({ name: `Existing leads (${campaign.leads.length})` } as File);
      }
    }
  }, [campaignDetails]);

  const campaigns = campaignsData || [];

  // Fetch voices from backend
  const { data: voices = [], isLoading: voicesLoading, error: voicesError } = useQuery({
    queryKey: ['/api/voices'],
    queryFn: () => api.getVoices(),
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: (campaignData: any) => api.post('/api/campaigns', campaignData),
    onSuccess: (data) => {
      toast({
        title: "Campaign Created",
        description: "Campaign has been created successfully.",
      });
      setCurrentCampaign(data);
      setNewCampaignName('');
      setIsCreatingCampaign(false);
      setCurrentStep(3);
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      const rawLanguage = i18n?.language || 'en';
      const currentLanguage = rawLanguage.split('-')[0].toLowerCase();
      const campaignData = {
        name: newCampaignName,
        firstPrompt: defaultInitialMessage,
        systemPersona: defaultSystemPersona,
        language: currentLanguage
      };
      createCampaignMutation.mutate(campaignData);
    }
  };

  // PDF upload mutation
  const pdfUploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadPDF(file, currentCampaign?.id?.toString() || '1'),
    onSuccess: (data) => {
      toast({
        title: "PDF Uploaded",
        description: "Knowledge base has been uploaded successfully.",
      });

      // Normalize backend response: prefer data.knowledgeBase
      const uploadedKb = (data as any)?.knowledgeBase || (data as any)?.file || data;

      // Update local KB list immediately
      if (uploadedKb) {
        setKnowledgeBaseFiles((prev: any[]) => [...(prev || []), uploadedKb]);
      }
      
      // Update campaign state to include knowledge base
      if (currentCampaign && uploadedKb) {
        setCurrentCampaign({
          ...currentCampaign,
          knowledgeBase: [...(currentCampaign.knowledgeBase || []), uploadedKb]
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload PDF.",
        variant: "destructive",
      });
    },
  });

  // CSV upload mutation
  const csvUploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadCSV(file, currentCampaign?.id?.toString() || '1'),
    onSuccess: (data) => {
      toast({
        title: "CSV Uploaded",
        description: `Successfully uploaded ${data.leadsCount || 0} leads.`,
      });
      setLeadsFile({ name: `Uploaded CSV (${data.leadsCount || 0} leads)`, leads: data.leads } as any);
      
      // Store CSV leads for preview
      if (data.leads && data.leads.length > 0) {
        setCsvLeads(data.leads);
        setShowCSVPreview(true); // Auto-open preview for editing
      }

      // Update campaign state to include leads
      if (currentCampaign) {
        setCurrentCampaign({
          ...currentCampaign,
          leads: data.leads || []
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV.",
        variant: "destructive",
      });
    },
  });

  // Test call mutation
  const testCallMutation = useMutation({
    mutationFn: (data: any) => api.makeTestCall(data),
    onSuccess: (data) => {
      toast({
        title: "Test Call Initiated",
        description: `Call initiated to ${testCallData.phoneNumber}. Status: ${data.status}`,
      });
      
    },
    onError: (error: any) => {
      toast({
        title: "Test Call Failed",
        description: error.message || "Failed to make test call.",
        variant: "destructive",
      });
    },
  });

  // Start campaign mutation
  const startCampaignMutation = useMutation({
    mutationFn: (campaignData: any) => api.startCampaign(campaignData),
    onSuccess: async (data) => {
      toast({
        title: "Campaign Started",
        description: data.message || "Campaign has been started successfully.",
      });
      
      // Fetch campaign status after starting
      try {
        const campaignId = data.campaign?.id || currentCampaign?.id;
        const status = await api.getCampaignStatus(campaignId);
        setCampaignStatus(status);
        setShowCampaignStatus(true);
        
        // Set up auto-refresh every 3 seconds
        const interval = setInterval(() => {
          api.getCampaignStatus(campaignId).then((status) => {
            setCampaignStatus(status);
            
            // Stop refreshing if campaign is completed
            if (status.status === 'completed') {
              clearInterval(interval);
              setStatusRefreshInterval(null);
            }
          }).catch((error) => {
            console.error('Failed to refresh campaign status:', error);
          });
        }, 3000);
        
        setStatusRefreshInterval(interval);
      } catch (error) {
        console.error('Failed to fetch campaign status:', error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: any) => {
      toast({
        title: "Campaign Start Failed",
        description: error.message || "Failed to start campaign.",
        variant: "destructive",
      });
    },
  });

  // Clone voice mutation
  const cloneVoiceMutation = useMutation({
    mutationFn: (data: { file: File; name: string; description?: string }) => 
      api.cloneVoice(data.file, data.name, data.description),
    onSuccess: (data) => {
      toast({
        title: "Voice Cloned",
        description: "Voice has been cloned successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/voices'] });
    },
    onError: (error: any) => {
      toast({
        title: "Voice Cloning Failed",
        description: error.message || "Failed to clone voice.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (files: FileList | null, type: 'knowledge' | 'leads') => {
    if (!files || !currentCampaign) return;
    
    if (type === 'knowledge') {
      pdfUploadMutation.mutate(files[0]);
    } else {
      csvUploadMutation.mutate(files[0]);
    }
  };

  // Helper function to cleanup audio
  const cleanupAudio = (audioToClean: HTMLAudioElement) => {
    audioToClean.pause();
    audioToClean.currentTime = 0;
    audioToClean.src = '';
    audioToClean.load();
    setPlayingVoice(null);
    setAudioElement(null);
    setIsPlaying(false);
  };

  // Delete knowledge base file
  const deleteKnowledgeBaseFile = (fileToDelete: any, index: number) => {
    // If the file has an ID, it's an existing file that needs to be deleted via API
    if (fileToDelete?.id && currentCampaign?.id) {
      api.deleteKnowledgeBase(fileToDelete.id, currentCampaign.id)
        .then(() => {
          toast({
            title: "File Deleted",
            description: "Knowledge base file has been removed successfully.",
          });
          // Optimistically remove from local state
          setKnowledgeBaseFiles((prev: any[]) => (prev || []).filter((f: any) => f && f.id !== fileToDelete.id));
          setCurrentCampaign((prev: any) => prev ? { ...prev, knowledgeBase: (prev.knowledgeBase || []).filter((f: any) => f && f.id !== fileToDelete.id) } : prev);
          // Refetch to ensure consistency
          queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${currentCampaign.id}`] });
          queryClient.invalidateQueries({ queryKey: ['/api/knowledge-base'] });
        })
        .catch((error) => {
          toast({
            title: "Delete Failed",
            description: error.message || "Failed to delete file",
            variant: "destructive",
          });
        });
    } else {
      // It's a newly uploaded file (File object), just remove it from local state
      const newFiles = (knowledgeBaseFiles || []).filter((_: any, i: number) => i !== index);
      setKnowledgeBaseFiles(newFiles);
      setCurrentCampaign((prev: any) => prev ? { ...prev, knowledgeBase: (prev.knowledgeBase || []).filter((_: any, i: number) => i !== index) } : prev);
      toast({
        title: "File Removed",
        description: "The selected file has been removed.",
      });
    }
  };

  // Delete leads file
  const deleteLeadsFile = () => {
    setLeadsFile(null);
    setCsvLeads([]);
    setShowCSVPreview(false);

    // Update campaign state
      if (currentCampaign) {
        setCurrentCampaign({
          ...currentCampaign,
        leads: []
      });
    }

    toast({
      title: "File Deleted",
      description: "Leads file has been removed.",
    });
  };

  const handleEditLead = (index: number, lead: any) => {
    setEditingLeadIndex(index);
    setEditedPhone(lead.contactNo);
    setEditedName(lead.firstName);
    setEditedLastName(lead.lastName || '');
    setEditedEmail(lead.email || '');
  };

  const handleSaveLeadEdit = async () => {
    if (editingLeadIndex !== null && editedPhone.trim() && editedName.trim()) {
      const updatedLeads = [...csvLeads];
      const leadToUpdate = updatedLeads[editingLeadIndex];
      
      leadToUpdate.firstName = editedName.trim();
      leadToUpdate.lastName = editedLastName.trim();
      leadToUpdate.email = editedEmail.trim();
      leadToUpdate.contactNo = editedPhone.trim();
      
      setCsvLeads(updatedLeads);

      // Update campaign state
      if (currentCampaign) {
        setCurrentCampaign({
          ...currentCampaign,
          leads: updatedLeads
        });
      }

      if (currentCampaign && currentCampaign.id) {
        try {
          await api.updateCampaignLeads(currentCampaign.id, updatedLeads);
          toast({
            title: "Updated",
            description: "Updated.",
          });
        } catch (error) {
          console.error('Error');
          toast({
            title: "Failed",
            description: "Failed.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Updated",
          description: "Updated.",
        });
      }

      setEditingLeadIndex(null);
      setEditedPhone('');
      setEditedName('');
      setEditedLastName('');
      setEditedEmail('');
    }
  };

  const handleCancelEdit = () => {
    setEditingLeadIndex(null);
    setEditedPhone('');
    setEditedName('');
    setEditedLastName('');
    setEditedEmail('');
  };

  const handleDeleteLead = (index: number) => {
    const updatedLeads = csvLeads.filter((_, i) => i !== index);
    setCsvLeads(updatedLeads);

    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        leads: updatedLeads
      });
    }

    if (updatedLeads.length === 0) {
      setLeadsFile(null);
      setShowCSVPreview(false);
    } else {
      setLeadsFile({ name: `Uploaded CSV (${updatedLeads.length} leads)`, leads: updatedLeads } as any);
    }

    toast({
      title: "Lead Deleted",
      description: `Lead removed from the list. ${updatedLeads.length} leads remaining.`,
    });
  };

  // Add country code to phone if missing
  const addCountryCode = (phone: string, countryCode: string = '+971') => {
    if (!phone.startsWith('+')) {
      return countryCode + phone.replace(/^0+/, ''); // Remove leading zeros
    }
    return phone;
  };

  // Apply country code to all leads
  const applyCountryCodeToAll = (countryCode: string = '+971') => {
    const updatedLeads = csvLeads.map(lead => ({
      ...lead,
      contactNo: addCountryCode(lead.contactNo, countryCode)
    }));
    setCsvLeads(updatedLeads);

    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        leads: updatedLeads
      });
    }

    toast({
      title: "Updated",
      description: `Applied ${countryCode} to all phone numbers.`,
    });
  };

  // Get current script configuration
  const getCurrentScript = () => {
    if (selectedScript === 'custom' && customScript) {
      return {
        name: "Custom Script",
        description: "Your custom conversation script",
        opening: customScript,
        system: "You are Sarah, a professional sales representative. Follow the custom script provided while maintaining natural conversation flow."
      };
    }
    return conversationScripts[selectedScript as keyof typeof conversationScripts];
  };

  // Update AI config with script
  const updateAIConfigWithScript = (field: string, value: string) => {
    if (currentCampaign) {
      const script = getCurrentScript();
      const updatedConfig = {
        ...currentCampaign.aiConfig,
        [field]: value,
        scriptType: selectedScript,
        scriptOpening: script.opening,
        scriptSystem: script.system
      };
      
      setCurrentCampaign({
        ...currentCampaign,
        aiConfig: updatedConfig,
        firstPrompt: field === 'initialMessage' ? value : currentCampaign.firstPrompt,
        systemPersona: field === 'systemPersona' ? value : currentCampaign.systemPersona
      });
    }
  };

  const handleVoicePreview = async (voice: any) => {
    try {
      // If clicking the same voice that's currently playing
      if (playingVoice === (voice.voice_id || voice.id) && audioElement) {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          try {
            await audioElement.play();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error resuming playback:', error);
            cleanupAudio(audioElement);
            toast({
              title: "Playback Failed",
              description: "Failed to resume playback. Please try again.",
              variant: "destructive",
            });
          }
        }
        return;
      }

      // Stop current playback if any
      if (audioElement) {
        cleanupAudio(audioElement);
      }

      const previewUrl = voice.preview_url || voice.sampleUrl;
      if (!previewUrl) {
        toast({
          title: "Preview Unavailable",
          description: "No preview available for this voice.",
          variant: "destructive",
        });
        return;
      }

      // Create and set up new audio element
      const audio = new Audio();
      
      // Add loading state
      const loadingToast = toast({
        title: "Loading Preview",
        description: "Preparing voice sample...",
      });

      let isLoading = true;
      let hasError = false;

      const cleanup = () => {
        isLoading = false;
        loadingToast.dismiss();
        if (audio) {
          cleanupAudio(audio);
        }
      };

      // Set up audio event handlers before setting the source
      audio.addEventListener('canplaythrough', () => {
        if (isLoading && !hasError) {
          loadingToast.dismiss();
          audio.play().then(() => {
            setPlayingVoice(voice.voice_id || voice.id);
            setAudioElement(audio);
            setIsPlaying(true);
          }).catch((error) => {
            console.error('Error playing audio:', error);
            hasError = true;
            cleanup();
            toast({
              title: "Playback Failed",
              description: "Failed to play voice preview. Please try again.",
              variant: "destructive",
            });
          });
        }
      });

      audio.addEventListener('error', () => {
        console.error('Audio loading error');
        hasError = true;
        cleanup();
        toast({
          title: "Preview Failed",
          description: "Failed to load voice preview. Please try again.",
          variant: "destructive",
        });
      });

      audio.addEventListener('ended', () => {
        setPlayingVoice(null);
        setAudioElement(null);
        setIsPlaying(false);
      });

      // Set the source and start loading
      audio.src = previewUrl;
      audio.load();
    } catch (error) {
      console.error('Error in handleVoicePreview:', error);
      toast({
        title: "Preview Error",
        description: "An error occurred while loading the preview.",
        variant: "destructive",
      });
    }
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        selectedVoice: voiceId,
        selectedVoiceId: voiceId
      });
    }
  };

  const handleVoiceClone = (file: File) => {
    if (!cloneName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the cloned voice.",
        variant: "destructive",
      });
      return;
    }

    cloneVoiceMutation.mutate({
      file,
      name: cloneName.trim(),
      description: cloneDescription.trim() || undefined,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVoiceClone(file);
    }
  };

  const handleTestCall = () => {
    if (!testCallData.phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number for the test call.",
        variant: "destructive",
      });
      return;
    }

    if (!currentCampaign) {
      toast({
        title: "No Campaign",
        description: "Please create a campaign first.",
        variant: "destructive",
      });
      return;
    }

    const callData = {
      phoneNumber: testCallData.phoneNumber.trim(),
      campaignId: currentCampaign?.id,
      firstName: testCallData.firstName.trim() || "Customer"
    };
    
    testCallMutation.mutate(callData);
  };

  const handleLaunchCampaign = () => {
    if (!currentCampaign) {
      toast({
        title: "No Campaign",
        description: "Please create a campaign first.",
        variant: "destructive",
      });
      return;
    }

    const confirmMessage = `Are you sure you want to start the campaign "${currentCampaign.name}"?\n\nThis will:\n- Use the selected voice\n- Process uploaded leads\n- Use the uploaded knowledge base\n- Start making calls immediately`;
    
    if (window.confirm(confirmMessage)) {
      // Prepare full campaign data with all settings
      const campaignData = {
        campaignId: currentCampaign.id,
        name: currentCampaign.name,
        firstPrompt: currentCampaign.aiConfig?.initialMessage || currentCampaign.firstPrompt || '',
        systemPersona: currentCampaign.aiConfig?.systemPersona || currentCampaign.systemPersona || '',
        selectedVoice: currentCampaign.selectedVoice || currentCampaign.selectedVoiceId || '',
        scriptType: selectedScript,
        scriptOpening: getCurrentScript().opening,
        scriptSystem: getCurrentScript().system,
        knowledgeBase: currentCampaign.knowledgeBase || [],
        leads: currentCampaign.leads || [],
        aiConfig: currentCampaign.aiConfig || {}
      };
      
      startCampaignMutation.mutate(campaignData);
      setCampaignControlStatus('running');
    }
  };

  const handleStopCampaign = () => {
    if (currentCampaign?.id) {
      const confirmMessage = `Are you sure you want to stop the campaign "${currentCampaign.name}"?\n\nThis will:\n- Stop all ongoing calls\n- Prevent new calls from starting\n- Keep campaign data intact`;
      
      if (window.confirm(confirmMessage)) {
        api.post(`/api/campaigns/${currentCampaign.id}/stop`, {})
          .then(() => {
            setCampaignControlStatus('stopped');
            toast({
              title: "Stopped",
              description: "stopped.",
            });
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: "Error.",
              variant: "destructive"
            });
          });
      }
    }
  };

  const handlePauseCampaign = () => {
    if (currentCampaign?.id) {
      const confirmMessage = `Are you sure you want to pause the campaign "${currentCampaign.name}"?\n\nThis will:\n- Pause ongoing calls\n- Prevent new calls from starting\n- Allow resuming later`;
      
      if (window.confirm(confirmMessage)) {
        api.post(`/api/campaigns/${currentCampaign.id}/pause`, {})
          .then(() => {
            setCampaignControlStatus('paused');
            toast({
              title: "Paused",
              description: "paused.",
            });
          })
          .catch((error) => {
            toast({
              title: "Error",
              description: "Error.",
              variant: "destructive"
            });
          });
      }
    }
  };

  const handleResumeCampaign = () => {
    if (currentCampaign?.id) {
      api.post(`/campaigns/${currentCampaign.id}/resume`, {})
        .then(() => {
          setCampaignControlStatus('running');
          toast({
            title: "Resumed",
            description: "resumed.",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Error.",
            variant: "destructive"
          });
        });
    }
  };

  const updateAIConfig = (field: 'initialMessage' | 'systemPersona', value: string) => {
    if (currentCampaign) {
      setCurrentCampaign({
        ...currentCampaign,
        aiConfig: {
          ...currentCampaign.aiConfig,
          [field]: value
        },
        firstPrompt: field === 'initialMessage' ? value : currentCampaign.firstPrompt,
        systemPersona: field === 'systemPersona' ? value : currentCampaign.systemPersona
      });
    }
  };

  const getCompletionStatus = () => {
    if (!currentCampaign) return { testCall: false, launch: false };
    
    try {
      const hasInitialMessage = (currentCampaign.aiConfig?.initialMessage?.trim() || '') !== '' || 
                               (currentCampaign.firstPrompt?.trim() || '') !== '';
      const hasVoice = (currentCampaign.selectedVoice || '') !== '' || 
                       (currentCampaign.selectedVoiceId || '') !== '';
      const hasKnowledgeBase = (currentCampaign.knowledgeBase?.length || 0) > 0 || 
                              !!currentCampaign.knowledgeBaseId || knowledgeBaseFiles.length > 0;
      const hasLeads = (currentCampaign.leads?.length || 0) > 0 || !!leadsFile;
    
    return {
        testCall: hasInitialMessage && hasVoice && hasKnowledgeBase,
      launch: hasInitialMessage && hasVoice && hasKnowledgeBase && hasLeads
    };
    } catch (error) {
      console.error('Error in getCompletionStatus:', error);
      return { testCall: false, launch: false };
    }
  };

  const completionStatus = getCompletionStatus();

  const filteredVoices = voices.filter((voice: any) => {
    if (voiceSearchTerm.trim()) {
      const searchLower = voiceSearchTerm.toLowerCase();
      const matchesSearch = (
        voice.name?.toLowerCase().includes(searchLower) ||
        voice.description?.toLowerCase().includes(searchLower) ||
        voice.labels?.accent?.toLowerCase().includes(searchLower) ||
        voice.labels?.gender?.toLowerCase().includes(searchLower) ||
        voice.labels?.age?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }
    
    const voiceLanguage = voice.language?.toLowerCase() || '';
    const voiceLabels = voice.labels || {};
    const languageKeywords = {
      'tr': ['turkish', 'türkçe', 'istanbul', 'ankara', 'izmir'],
      'ar': ['arabic', 'عربي', 'arab', 'saudi', 'dubai', 'uae'],
      'en': ['english', 'american', 'british', 'australian', 'canadian'],
      'az': ['azerbaijani', 'azərbaycan', 'baku']
    };
    
    const currentLangKeywords = languageKeywords[normalizedLanguage as keyof typeof languageKeywords] || [];
    
    const matchesLanguage = 
      voiceLanguage === normalizedLanguage ||
      voiceLanguage.includes(normalizedLanguage) ||
      currentLangKeywords.some(keyword => 
        voiceLanguage.includes(keyword) ||
        voiceLabels.accent?.toLowerCase().includes(keyword) ||
        voiceLabels.description?.toLowerCase().includes(keyword) ||
        voice.description?.toLowerCase().includes(keyword)
      );
    
    return matchesLanguage;
  });

  if (isLoading && campaignId) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading campaign...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white/50 dark:bg-brand-900/50 backdrop-blur-sm rounded-lg shadow-lg border border-brand-200/50 dark:border-brand-800/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-800 dark:text-brand-200">{t('dashboard.campaignManagement')}</h1>
            {currentCampaign && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-brand-600 dark:text-brand-400">Campaign: {currentCampaign.name}</span>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                >
                  Change Campaign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaign Selection</h2>
              <p className="text-gray-600">Create a new campaign or select an existing one.</p>
            </div>
          </div>

          <div className="text-center py-12">
            {!isCreatingCampaign ? (
              <button
                onClick={() => setIsCreatingCampaign(true)}
                className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>{t('dashboard.createNewCampaignButton')}</span>
              </button>
            ) : (
              <div className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleCreateCampaign}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.existingCampaigns')}</h3>
            {campaigns.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('dashboard.noExistingCampaigns')}</p>
            ) : (
              <div className="space-y-2">
                {campaigns.map((campaign: any) => (
                  <div
                    key={campaign.id}
                    onClick={() => {
                      setLocation(`/campaigns/${campaign.id}/edit`);
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-500">Created {new Date().toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {currentStep === 3 && currentCampaign && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-brand-800/30 rounded-lg p-4 border border-brand-200/50 dark:border-brand-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-200">{t('dashboard.knowledgeBase')}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400">{t('dashboard.uploadPdfFiles')}</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-brand-300 dark:border-brand-600 rounded-lg p-4 text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors">
                <ArrowUp className="h-6 w-6 text-brand-400 mx-auto mb-2" />
                <p className="text-xs text-brand-600 dark:text-brand-400 mb-2">Drop your PDF files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files, 'knowledge')}
                  className="hidden"
                  id="knowledge-upload"
                />
                <label
                  htmlFor="knowledge-upload"
                  className="inline-flex items-center space-x-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1.5 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-colors cursor-pointer text-xs"
                >
                  <FileIcon className="h-4 w-4" />
                  <span>Choose Files</span>
                </label>
              </div>
              
              {knowledgeBaseFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-brand-600 dark:text-brand-400 mb-2">Uploaded files:</p>
                  {knowledgeBaseFiles
                    .filter((f: any) => !!f)
                    .map((file: any, index: number) => (
                    <div key={(file?.id ?? file?.name ?? `kb-${index}`)} className="flex items-center justify-between p-2 bg-brand-50 dark:bg-brand-800/30 rounded-lg mb-1">
                      <div className="flex items-center space-x-2 text-xs text-brand-700 dark:text-brand-300">
                      <FileIcon className="h-3 w-3" />
                      <span>{file?.filename || file?.name || 'File'}</span>
                      </div>
                      <button
                        onClick={() => file && deleteKnowledgeBaseFile(file, index)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 hover:text-red-700 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {knowledgeBaseFiles.length === 0 && (
                <p className="text-xs text-brand-500 dark:text-brand-400 mt-3">No knowledge base files uploaded yet.</p>
              )}
            </div>

            <div className="bg-white/50 dark:bg-brand-800/30 rounded-lg p-4 border border-brand-200/50 dark:border-brand-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-200">{t('dashboard.aiConfiguration')}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400">{t('dashboard.setupAiAgent')}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-brand-700 dark:text-brand-300 mb-1">
                    Conversation Script
                  </label>
                  <select
                    value={selectedScript}
                    onChange={(e) => setSelectedScript(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-brand-800"
                  >
                    {Object.entries(conversationScripts).map(([key, script]) => (
                      <option key={key} value={key}>
                        {script.name} - {script.description}
                      </option>
                    ))}
                    <option value="custom">Custom Script</option>
                  </select>
                  
                  {selectedScript !== 'custom' && (
                    <div className="mt-2 p-2 bg-brand-50 dark:bg-brand-800/30 border border-brand-200 dark:border-brand-700 rounded-lg">
                      <p className="text-xs text-brand-800 dark:text-brand-200">
                        <strong>Script Preview:</strong> {getCurrentScript().opening}
                      </p>
                    </div>
                  )}
                  
                  {selectedScript === 'custom' && (
                    <div className="mt-2">
                      <textarea
                        value={customScript}
                        onChange={(e) => setCustomScript(e.target.value)}
                        placeholder="Enter your custom opening message..."
                        rows={2}
                        className="w-full px-2 py-1.5 text-xs border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-brand-800"
                      />
                      <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Use {"{name}"} for the lead's name.</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-brand-700 dark:text-brand-300 mb-1">
                    Initial Message (Override)
                  </label>
                  <div className="relative">
                    <div className="w-full px-2 py-1.5 text-xs border border-brand-300 dark:border-brand-600 rounded-lg bg-white dark:bg-brand-800 min-h-[32px] flex items-center">
                      {(() => {
                        const currentValue = currentCampaign.aiConfig?.initialMessage || currentCampaign.firstPrompt || '';
                        const match = currentValue.match(/(.*?)\{\{first_name\}\}(.*)/s);
                        let prefix = '';
                        let suffix = currentValue;

                        if (match) {
                          prefix = match[1];
                          suffix = match[2];
                        }

                        return (
                          <>
                            <input
                              type="text"
                              placeholder=""
                              className="border-none outline-none bg-transparent text-slate-900 placeholder-slate-400 min-w-[4ch] flex-shrink"
                              value={prefix}
                              onChange={(e) => {
                                const newValue = `${e.target.value}{{first_name}}${suffix}`;
                                updateAIConfigWithScript('initialMessage', newValue);
                              }}
                              style={{ width: `${Math.max(4, prefix.length)}ch` }}
                            />
                            <span className="text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1 py-0.5 rounded text-xs font-medium">
                              FIRST NAME
                            </span>
                            <input
                              type="text"
                              placeholder=""
                              className="border-none outline-none bg-transparent text-slate-900 placeholder-slate-400 min-w-[4ch] flex-grow"
                              value={suffix}
                              onChange={(e) => {
                                const newValue = `${prefix}{{first_name}}${e.target.value}`;
                                updateAIConfigWithScript('initialMessage', newValue);
                              }}
                              style={{ width: `${Math.max(4, suffix.length)}ch` }}
                            />
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Leave empty to use the selected script's opening message.</p>
                </div>

                <button
                  onClick={async () => {
                    if (!currentCampaign || isUpdatingAgent) return;
                    setIsUpdatingAgent(true);
                    try {
                      const knowledgeBaseIds = (currentCampaign.knowledgeBase || []).map((f: any) => f.elevenlabsDocId).filter(Boolean);
                      await api.updateAgent(Number(currentCampaign.id), {
                        firstPrompt: currentCampaign.aiConfig?.initialMessage || currentCampaign.firstPrompt,
                        systemPersona: currentCampaign.aiConfig?.systemPersona || currentCampaign.systemPersona,
                        selectedVoiceId: currentCampaign.selectedVoice || currentCampaign.selectedVoiceId,
                        knowledgeBaseIds,
                      });
                      toast({ title: 'Agent Updated', description: 'Agent configuration saved.' });
                    } catch (err: any) {
                      toast({ title: 'Update Failed', description: err?.message || 'Could not update agent.', variant: 'destructive' });
                    } finally {
                      setIsUpdatingAgent(false);
                    }
                  }}
                  disabled={isUpdatingAgent}
                  className={`w-full text-white px-3 py-2 rounded-lg transition-colors text-xs ${
                    isUpdatingAgent
                      ? 'bg-brand-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700'
                  }`}
                >
                  {isUpdatingAgent ? 'Updating...' : 'Update Agent'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/50 dark:bg-brand-800/30 rounded-lg p-4 border border-brand-200/50 dark:border-brand-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <Volume2 className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-200">{t('dashboard.aiVoiceSelection')}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400">{t('dashboard.chooseFromPremium')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex space-x-1">
                  <button className="px-3 py-1.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-colors text-xs">
                    Voice Library
                  </button>
                  <button 
                    onClick={() => setShowCloneForm(!showCloneForm)}
                    className="px-3 py-1.5 border border-brand-300 dark:border-brand-600 text-brand-700 dark:text-brand-300 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-800/30 transition-colors text-xs"
                  >
                    {showCloneForm ? 'Cancel' : 'Clone Voice'}
                  </button>
                </div>
                
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search voices by name, accent, gender, or age..."
                    value={voiceSearchTerm}
                    onChange={(e) => setVoiceSearchTerm(e.target.value)}
                    className="w-full px-2 py-1.5 border border-brand-300 dark:border-brand-600 rounded-lg text-xs focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-brand-800"
                  />
                  {voiceSearchTerm && (
                    <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">
                      Showing {filteredVoices.length} of {voices.length} voices
                    </p>
                  )}
                </div>
                
                {showCloneForm && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Clone Your Voice</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Voice Name
                        </label>
                        <input
                          type="text"
                          value={cloneName}
                          onChange={(e) => setCloneName(e.target.value)}
                          placeholder="Enter voice name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={cloneDescription}
                          onChange={(e) => setCloneDescription(e.target.value)}
                          placeholder="Enter description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Audio File
                        </label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileInput}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                  {filteredVoices.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No voices found matching your search.</p>
                      <p className="text-xs mt-1">Try a different search term or clear the search.</p>
                    </div>
                  ) : (
                    filteredVoices.map((voice: any) => (
                      <div
                        key={voice.voice_id || voice.id}
                        onClick={() => handleVoiceSelect(voice.voice_id || voice.id)}
                      className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer transition-colors ${
                          selectedVoice === (voice.voice_id || voice.id)
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-800/30'
                          : 'border-brand-200 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-800/20'
                      }`}
                    >
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-brand-800 dark:text-brand-200 truncate text-xs">{voice.name}</span>
                            {voice.category && (
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                voice.category === 'premade' ? 'bg-brand-100 text-brand-800 dark:bg-brand-700 dark:text-brand-200' :
                                voice.category === 'cloned' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                voice.category === 'professional' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {voice.category}
                              </span>
                            )}
                          </div>
                          {voice.description && (
                            <span className="text-xs text-brand-500 dark:text-brand-400 mt-1 line-clamp-2">{voice.description}</span>
                          )}
                          {voice.labels && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {voice.labels.accent && (
                                <span className="px-1 py-0.5 text-xs bg-brand-100 dark:bg-brand-800/30 text-brand-600 dark:text-brand-400 rounded">
                                  {voice.labels.accent}
                                </span>
                              )}
                              {voice.labels.gender && (
                                <span className="px-1 py-0.5 text-xs bg-brand-100 dark:bg-brand-800/30 text-brand-600 dark:text-brand-400 rounded">
                                  {voice.labels.gender}
                                </span>
                              )}
                              {voice.labels.age && (
                                <span className="px-1 py-0.5 text-xs bg-brand-100 dark:bg-brand-800/30 text-brand-600 dark:text-brand-400 rounded">
                                  {voice.labels.age}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVoicePreview(voice);
                          }}
                          className="p-1 hover:bg-brand-100 dark:hover:bg-brand-800/30 rounded flex-shrink-0 ml-2"
                        >
                          {playingVoice === (voice.voice_id || voice.id) && isPlaying ? (
                            <Pause className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                          ) : (
                        <Play className="h-3 w-3 text-brand-600 dark:text-brand-400" />
                          )}
                      </button>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-brand-800/30 rounded-lg p-4 border border-brand-200/50 dark:border-brand-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-800 dark:text-brand-200">{t('dashboard.leadsManagement')}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400">{t('dashboard.uploadAndManageLeads')}</p>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-brand-300 dark:border-brand-600 rounded-lg p-3 text-center hover:border-brand-400 dark:hover:border-brand-500 transition-colors">
                <FileIcon className="h-5 w-5 text-brand-400 mx-auto mb-2" />
                <p className="text-xs text-brand-600 dark:text-brand-400 mb-2">
                  Upload CSV files with the following columns:
                </p>
                <div className="text-xs text-brand-500 dark:text-brand-400 mb-3 space-y-1">
                  <p><strong>Required:</strong> first_name, contact_no</p>
                  <p><strong>Optional:</strong> last_name, email</p>
                  <p><em>Note:</em> Country code (+971) will be auto-added to UAE numbers</p>
                </div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e.target.files, 'leads')}
                  className="hidden"
                  id="leads-upload"
                />
                <label
                  htmlFor="leads-upload"
                  className="inline-flex items-center space-x-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white px-3 py-1.5 rounded-lg hover:from-brand-600 hover:to-brand-700 transition-colors cursor-pointer text-xs"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload CSV File</span>
                </label>
              </div>
              
              {leadsFile && (
                <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-800 dark:text-purple-200">{leadsFile.name}</span>
                      {csvLeads.length > 0 && (
                        <span className="text-xs bg-brand-100 dark:bg-brand-800/30 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded">
                          {csvLeads.length} leads loaded
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {csvLeads.length > 0 && (
                        <button
                          onClick={() => setShowCSVPreview(true)}
                          className="text-xs bg-gradient-to-r from-brand-500 to-brand-600 text-white px-2 py-1 rounded hover:from-brand-600 hover:to-brand-700 transition-colors"
                        >
                          Preview & Edit
                        </button>
                      )}
                      <button
                        onClick={deleteLeadsFile}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 hover:text-red-700 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && currentCampaign && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaign Launch</h2>
              <p className="text-gray-600">Test and start your campaign.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Single Call</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name (optional)
                  </label>
                  <input
                    type="text"
                    value={testCallData.firstName}
                    onChange={(e) => setTestCallData({...testCallData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={testCallData.phoneNumber}
                    onChange={(e) => setTestCallData({...testCallData, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleTestCall}
                  disabled={!completionStatus.testCall || testCallMutation.isPending}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    completionStatus.testCall && !testCallMutation.isPending
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {testCallMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Calling...</span>
                    </>
                  ) : (
                    <>
                  <Phone className="h-4 w-4" />
                  <span>Test Call</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Complete all required steps to enable test calls:
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Set initial message', completed: (currentCampaign.aiConfig?.initialMessage?.trim() || currentCampaign.firstPrompt?.trim() || '') !== '' },
                    { label: 'Select a voice', completed: (currentCampaign.selectedVoice || currentCampaign.selectedVoiceId || '') !== '' },
                    { label: 'Upload knowledge base', completed: (currentCampaign.knowledgeBase?.length || 0) > 0 || !!currentCampaign.knowledgeBaseId },
                    { label: 'Upload leads CSV', completed: (currentCampaign.leads?.length || 0) > 0 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-purple-700' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Control</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={handleLaunchCampaign}
                  disabled={!completionStatus.launch || startCampaignMutation.isPending || campaignControlStatus === 'running'}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    completionStatus.launch && !startCampaignMutation.isPending && campaignControlStatus !== 'running'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {startCampaignMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                <button
                  onClick={campaignControlStatus === 'paused' ? handleResumeCampaign : handlePauseCampaign}
                  disabled={campaignControlStatus === 'stopped'}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    campaignControlStatus === 'stopped'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : campaignControlStatus === 'paused'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {campaignControlStatus === 'paused' ? (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleStopCampaign}
                  disabled={campaignControlStatus === 'stopped'}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    campaignControlStatus === 'stopped'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    campaignControlStatus === 'running' ? 'bg-green-500' :
                    campaignControlStatus === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    Status: {campaignControlStatus === 'running' ? 'Running' : 
                            campaignControlStatus === 'paused' ? 'Paused' : 'Stopped'}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => window.location.href = '/campaigns'}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Users className="h-4 w-4" />
                  <span>View Existing Campaigns</span>
                </button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Campaign Requirements:
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Initial Message Required', completed: (currentCampaign.aiConfig?.initialMessage?.trim() || currentCampaign.firstPrompt?.trim() || '') !== '' },
                    { label: 'Voice Selection Required', completed: (currentCampaign.selectedVoice || currentCampaign.selectedVoiceId || '') !== '' },
                    { label: 'Knowledge Base Required', completed: (currentCampaign.knowledgeBase?.length || 0) > 0 || !!currentCampaign.knowledgeBaseId },
                    { label: 'Leads CSV Required', completed: (currentCampaign.leads?.length || 0) > 0 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-purple-700' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep > 1 && (
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          {currentStep === 3 && currentCampaign && (
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Launch
            </button>
          )}
        </div>
      )}

      {/* Campaign Status Display */}
      {showCampaignStatus && campaignStatus && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Rocket className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900">Campaign Active</h3>
              <p className="text-purple-700">Your campaign is now making calls!</p>
            </div>
          </div>
          
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
             <div className="bg-white rounded-lg p-3 text-center">
               <div className="text-2xl font-bold text-purple-600">{campaignStatus.totalLeads || 0}</div>
               <div className="text-sm text-gray-600">Total Leads</div>
             </div>
             <div className="bg-white rounded-lg p-3 text-center">
               <div className="text-2xl font-bold text-blue-600">{campaignStatus.completedCalls || 0}</div>
               <div className="text-sm text-gray-600">Calls Made</div>
             </div>
             <div className="bg-white rounded-lg p-3 text-center">
               <div className="text-2xl font-bold text-purple-600">{campaignStatus.successfulCalls || 0}</div>
               <div className="text-sm text-gray-600">Successful</div>
             </div>
             <div className="bg-white rounded-lg p-3 text-center">
               <div className="text-2xl font-bold text-orange-600">{campaignStatus.pendingCalls || 0}</div>
               <div className="text-sm text-gray-600">Pending</div>
             </div>
           </div>

           {/* Enhanced Lead Details */}
           {currentCampaign?.leads && currentCampaign.leads.length > 0 && (
             <div className="bg-white rounded-lg p-4 mb-4">
               <h4 className="font-semibold text-gray-900 mb-3">📋 Leads from CSV</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                 {currentCampaign.leads.map((lead: any, index: number) => (
                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                     <div>
                       <span className="font-medium text-gray-900">{lead.name || `Lead ${index + 1}`}</span>
                       <span className="text-sm text-gray-500 ml-2">({lead.phone || lead.phoneNumber})</span>
                     </div>
                     <div className="text-xs text-gray-500">
                       {index < (campaignStatus.completedCalls || 0) ? (
                         <span className="text-purple-600">✅ Called</span>
                       ) : (
                         <span className="text-orange-600">⏳ Pending</span>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">{campaignStatus.progressPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${campaignStatus.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>

           {/* Call History */}
           {campaignStatus.callHistory && campaignStatus.callHistory.length > 0 && (
             <div className="bg-white rounded-lg p-4 mb-4">
               <h4 className="font-semibold text-gray-900 mb-3">📞 Call History</h4>
               <div className="space-y-2 max-h-48 overflow-y-auto">
                 {campaignStatus.callHistory.map((call: any, index: number) => (
                   <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                     <div className="flex items-center space-x-3">
                       <div className={`w-2 h-2 rounded-full ${call.success ? 'bg-purple-500' : 'bg-red-500'}`}></div>
                       <div>
                         <span className="font-medium text-gray-900">{call.leadName}</span>
                         <span className="text-sm text-gray-500 ml-2">({call.phone})</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-xs text-gray-500">
                         {new Date(call.timestamp).toLocaleTimeString()}
                       </div>
                       <div className={`text-xs ${call.success ? 'text-purple-600' : 'text-red-600'}`}>
                         {call.success ? `✅ ${call.status}` : `❌ Failed`}
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           <div className="mt-4 flex items-center justify-between">
             <div className="text-sm text-gray-600">
               <p>Status: <span className="font-medium text-purple-600 capitalize">{campaignStatus.status}</span></p>
               {campaignStatus.startedAt && (
                 <p>Started: {new Date(campaignStatus.startedAt).toLocaleString()}</p>
               )}
               {campaignStatus.lastCallAt && (
                 <p>Last Call: {new Date(campaignStatus.lastCallAt).toLocaleString()}</p>
               )}
             </div>
             <button
               onClick={() => {
                 setShowCampaignStatus(false);
                 if (statusRefreshInterval) {
                   clearInterval(statusRefreshInterval);
                   setStatusRefreshInterval(null);
                 }
               }}
               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
             >
               Close
             </button>
           </div>
        </div>
      )}

      {/* Enhanced CSV Preview Modal */}
      {showCSVPreview && csvLeads.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📋 CSV Leads Preview & Edit</h3>
              <button
                onClick={() => setShowCSVPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Found <span className="font-semibold text-purple-600">{csvLeads.length}</span> leads in your CSV file:
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Required: first_name, contact_no | Optional: last_name, email
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => applyCountryCodeToAll('+971')}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Add +971 to All
                </button>
                <button
                  onClick={() => applyCountryCodeToAll('+1')}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Add +1 to All
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <div className="divide-y divide-gray-200">
                {csvLeads.map((lead, index) => (
                  <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteLead(index)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 hover:text-red-700 transition-colors"
                            title="Delete lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          {editingLeadIndex === index ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="First Name"
                                />
                                <input
                                  type="text"
                                  value={editedLastName}
                                  onChange={(e) => setEditedLastName(e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Last Name (optional)"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="tel"
                                  value={editedPhone}
                                  onChange={(e) => setEditedPhone(e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="+971xxxxxxxx"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="email"
                                  value={editedEmail}
                                  onChange={(e) => setEditedEmail(e.target.value)}
                                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Email (optional)"
                                />
                              </div>
                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={handleSaveLeadEdit}
                                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">{lead.firstName}</p>
                                {lead.lastName && (
                                  <p className="text-sm text-gray-600">{lead.lastName}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-sm text-gray-500">{lead.contactNo}</p>
                                <button
                                  onClick={() => handleEditLead(index, lead)}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                >
                                  Edit
                                </button>
                                {lead.originalPhone && lead.originalPhone !== lead.contactNo && (
                                  <span className="text-xs text-orange-600">(Modified)</span>
                                )}
                              </div>
                              {lead.email && (
                                <p className="text-xs text-gray-400 mt-1">{lead.email}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!lead.contactNo.startsWith('+') && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            No Country Code
                          </span>
                        )}
                        <span className="text-xs bg-purple-100 text-green-800 px-2 py-1 rounded-full">
                          Valid
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>✅ {csvLeads.filter(l => l.contactNo.startsWith('+')).length} with country codes</p>
                <p>⚠️ {csvLeads.filter(l => !l.contactNo.startsWith('+')).length} missing country codes</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowCSVPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCSVPreview(false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
