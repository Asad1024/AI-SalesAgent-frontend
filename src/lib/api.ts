import { apiRequest } from "./queryClient";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth-token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

function getAuthHeadersForFormData(): HeadersInit {
  const token = localStorage.getItem('auth-token');
  const headers: HeadersInit = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export interface CampaignStats {
  activeCampaigns: number;
  callsToday: number;
  successRate: string;
  totalMinutes: number;
}

export interface DashboardAnalytics {
  charts: {
    name: string;
    type: string;
    data: any;
  }[];
}

export interface FileUploadResponse {
  success: boolean;
  voice?: Voice;
  error?: string;
  leadsCount?: number;
  leads?: any[];
  message?: string;
}

export interface Voice {
  id: string;
  name: string;
  description: string;
  isCloned: boolean;
  sampleUrl?: string;
  settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  category?: 'premade' | 'cloned' | 'generated';
}

export interface Campaign {
  id: number;
  name: string;
  firstPrompt: string;
  systemPersona: string;
  selectedVoiceId?: string;
  status: string;
  totalLeads: number;
  completedCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
  createdAt: string;
  language?: string;
}

export interface Lead {
  id: number;
  campaignId: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  status: string;
  callDuration?: number;
  createdAt: string;
}

export interface DashboardChart {
  name: string;
  type: string;
}

export interface UpdateDashboardRequest {
  charts: DashboardChart[];
}

export interface ExperienceCallRequest {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  sector: string;
  agent: string;
}

const BASE_URL = 'https://aisparksalesagent-backend.onrender.com';

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login page instead of reloading
      window.location.href = '/login';
      return;
    }
    throw new Error(data.error || data.message || 'API request failed');
  }
  return data;
}

export const api = {
  getBaseUrl: () => BASE_URL,
  // GET requests
  getCampaigns: () => 
    fetch(`${BASE_URL}/api/campaigns`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(handleResponse).catch(() => {
      // Return demo campaigns if API fails
      return [
        {
          id: 1,
          name: "Demo Sales Campaign",
          firstPrompt: "Hi {name}, this is Sarah calling from our company. I hope I'm not catching you at a bad time? I wanted to reach out about something that might be really helpful for you. Do you have a quick moment to chat?",
          systemPersona: "You are Sarah, a friendly and professional sales representative. Be conversational, warm, and empathetic. Use natural speech patterns and listen actively to responses.",
          selectedVoiceId: "demo-voice-1",
          status: "active",
          totalLeads: 150,
          completedCalls: 45,
          successfulCalls: 12,
          failedCalls: 33,
          averageDuration: 180,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Follow-up Campaign",
          firstPrompt: "Hi {name}, this is Sarah calling to follow up on our previous conversation about our services. I wanted to see if you had any questions or if you're ready to move forward?",
          systemPersona: "You are Sarah, a follow-up specialist. Be persistent but respectful. Focus on addressing their concerns and moving them toward a decision.",
          selectedVoiceId: "demo-voice-2",
          status: "draft",
          totalLeads: 75,
          completedCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          averageDuration: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: "New Product Launch",
          firstPrompt: "Hello {name}, this is Sarah calling with some exciting news about our new product launch. I believe this could be perfect for your business. Do you have a few minutes to hear about this opportunity?",
          systemPersona: "You are Sarah, an enthusiastic product specialist. Be excited about the new product while being professional. Focus on the benefits and value proposition.",
          selectedVoiceId: "demo-voice-3",
          status: "paused",
          totalLeads: 200,
          completedCalls: 120,
          successfulCalls: 35,
          failedCalls: 85,
          averageDuration: 240,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
    }),
  
  getCampaignDetails: (id: string) => 
    fetch(`${BASE_URL}/api/campaigns/${id}/details`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(handleResponse).catch(() => {
      // Return demo campaign details if API fails
      const demoCampaigns = [
        {
          id: 1,
          name: "Demo Sales Campaign",
          firstPrompt: "Hi {name}, this is Sarah calling from our company. I hope I'm not catching you at a bad time? I wanted to reach out about something that might be really helpful for you. Do you have a quick moment to chat?",
          systemPersona: "You are Sarah, a friendly and professional sales representative. Be conversational, warm, and empathetic. Use natural speech patterns and listen actively to responses.",
          selectedVoiceId: "demo-voice-1",
          status: "active",
          totalLeads: 150,
          completedCalls: 45,
          successfulCalls: 12,
          failedCalls: 33,
          averageDuration: 180,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Follow-up Campaign",
          firstPrompt: "Hi {name}, this is Sarah calling to follow up on our previous conversation about our services. I wanted to see if you had any questions or if you're ready to move forward?",
          systemPersona: "You are Sarah, a follow-up specialist. Be persistent but respectful. Focus on addressing their concerns and moving them toward a decision.",
          selectedVoiceId: "demo-voice-2",
          status: "draft",
          totalLeads: 75,
          completedCalls: 0,
          successfulCalls: 0,
          failedCalls: 0,
          averageDuration: 0,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: "New Product Launch",
          firstPrompt: "Hello {name}, this is Sarah calling with some exciting news about our new product launch. I believe this could be perfect for your business. Do you have a few minutes to hear about this opportunity?",
          systemPersona: "You are Sarah, an enthusiastic product specialist. Be excited about the new product while being professional. Focus on the benefits and value proposition.",
          selectedVoiceId: "demo-voice-3",
          status: "paused",
          totalLeads: 200,
          completedCalls: 120,
          successfulCalls: 35,
          failedCalls: 85,
          averageDuration: 240,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      const campaign = demoCampaigns.find(c => c.id === parseInt(id));
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      // Generate demo call logs based on campaign data
      const demoCallLogs = [];
      const demoLeads = [];
      
      // Generate demo leads
      for (let i = 1; i <= Math.min(campaign.totalLeads, 20); i++) {
        demoLeads.push({
          id: i,
          firstName: `Lead ${i}`,
          lastName: `Customer ${i}`,
          contactNo: `+971501234${i.toString().padStart(3, '0')}`,
          status: i <= campaign.completedCalls ? 'completed' : 'pending'
        });
      }
      
      // Generate demo call logs for completed calls
      for (let i = 1; i <= campaign.completedCalls; i++) {
        const isSuccessful = i <= campaign.successfulCalls;
        demoCallLogs.push({
          id: i,
          leadId: i,
          phoneNumber: `+971501234${i.toString().padStart(3, '0')}`,
          status: isSuccessful ? 'completed' : 'failed',
          duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          elevenlabsConversationId: isSuccessful ? `demo-conversation-${i}` : null
        });
      }
      
      return {
        campaign,
        leads: demoLeads,
        callLogs: demoCallLogs,
        stats: {
          totalCalls: campaign.completedCalls,
          successfulCalls: campaign.successfulCalls,
          failedCalls: campaign.failedCalls,
          averageDuration: campaign.averageDuration
        }
      };
    }),

  getConversationDetails: (conversationId: string) =>
    fetch(`${BASE_URL}/api/conversations/${conversationId}/details`, {
        headers: getAuthHeaders(),
        credentials: 'include'
    }).then(handleResponse).catch(() => {
      // Return demo conversation details if API fails
      return {
        parsedTranscription: [
          {
            speaker: "agent",
            text: "Hi, this is Sarah calling from our company. I hope I'm not catching you at a bad time?"
          },
          {
            speaker: "customer", 
            text: "Hello, no it's fine. What is this about?"
          },
          {
            speaker: "agent",
            text: "I wanted to reach out about something that might be really helpful for your business. Do you have a quick moment to chat?"
          },
          {
            speaker: "customer",
            text: "Sure, I have a few minutes. What kind of help are you offering?"
          },
          {
            speaker: "agent",
            text: "We provide AI-powered solutions that can help automate your customer service and increase efficiency. Would you be interested in learning more?"
          },
          {
            speaker: "customer",
            text: "That sounds interesting. Can you tell me more about the pricing?"
          },
          {
            speaker: "agent",
            text: "Absolutely! We have flexible pricing plans starting from just $99 per month. I can send you more details via email if you'd like."
          },
          {
            speaker: "customer",
            text: "Yes, please send me the information. My email is customer@example.com"
          },
          {
            speaker: "agent",
            text: "Perfect! I'll send you all the details right away. Thank you for your time today!"
          }
        ]
      };
    }),

  getRecordingUrl: (callSid: string) =>
    fetch(`${BASE_URL}/api/calls/${callSid}/recording`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(handleResponse),

  getVoices: () => 
    fetch(`${BASE_URL}/api/voices`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(handleResponse).catch(() => {
      // Return demo voices if API fails
      return [
        {
          id: "demo-voice-1",
          name: "Sarah - Professional",
          description: "Friendly and professional female voice perfect for sales calls",
          isCloned: false,
          sampleUrl: "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream",
          settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true
          },
          category: "premade"
        },
        {
          id: "demo-voice-2",
          name: "Michael - Conversational",
          description: "Warm and conversational male voice ideal for follow-up calls",
          isCloned: false,
          sampleUrl: "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream",
          settings: {
            stability: 0.6,
            similarity_boost: 0.7,
            style: 0.2,
            use_speaker_boost: true
          },
          category: "premade"
        },
        {
          id: "demo-voice-3",
          name: "Emma - Enthusiastic",
          description: "Energetic and enthusiastic female voice for product launches",
          isCloned: false,
          sampleUrl: "https://api.elevenlabs.io/v1/text-to-speech/VR6AewLTigWG4xSOukaG/stream",
          settings: {
            stability: 0.4,
            similarity_boost: 0.9,
            style: 0.3,
            use_speaker_boost: true
          },
          category: "premade"
        }
      ];
    }),

  refreshConversation: (conversationId: string) =>
    fetch(`${BASE_URL}/api/conversations/${conversationId}/refresh`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include'
    }).then(handleResponse),
  
  getKnowledgeBase: () => 
    fetch(`${BASE_URL}/api/knowledge-base`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    }).then(handleResponse),

  // POST requests
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    console.log('API POST response status:', response.status);
    return handleResponse(response);
  },

  // Experience Zone - Make AI Call
  makeExperienceCall: async (data: ExperienceCallRequest) => {
    const response = await fetch(`${BASE_URL}/api/experience-call`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // File upload requests
  uploadPDF: async (file: File, campaignId: string) => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('campaignId', campaignId);

    const response = await fetch(`${BASE_URL}/api/upload/pdf`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  uploadCSV: async (file: File, campaignId: string) => {
    const formData = new FormData();
    formData.append('csv', file);
    formData.append('campaignId', campaignId);

    const response = await fetch(`${BASE_URL}/api/upload/csv`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  uploadVoiceSample: async (file: File, name: string, description?: string) => {
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    // Upload to the uploads route which handles voice cloning
    const response = await fetch(`${BASE_URL}/api/upload/voice`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  // Campaign actions
  updateAgent: async (campaignId: number, data: { firstPrompt?: string; systemPersona?: string; selectedVoiceId?: string; knowledgeBaseIds?: string[] }) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/update-agent`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  makeTestCall: async (data: { phoneNumber: string; campaignId?: number; firstName?: string }) => {
    const response = await fetch(`${BASE_URL}/api/make-outbound-call`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  startCampaign: async (campaignData: any) => {
    const response = await fetch(`${BASE_URL}/api/start-campaign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(campaignData),
    });
    return handleResponse(response);
  },

  getCampaignStatus: async (campaignId: number) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  updateCampaignProgress: async (campaignId: number, progress: any) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(progress),
    });
    return handleResponse(response);
  },

  cloneVoice: async (file: File, name: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(`${BASE_URL}/api/clone-voice`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      credentials: 'include',
      body: formData,
    });
    return handleResponse(response);
  },

  // Delete knowledge base file
  deleteKnowledgeBaseFile: async (fileId: string, elevenlabsId?: string) => {
    const response = await fetch(`${BASE_URL}/api/upload/knowledge-base/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ elevenlabsId }),
    });
    return handleResponse(response);
  },

  // Call tracking and history
  getActiveCalls: async () => {
    const response = await fetch(`${BASE_URL}/api/calls/active`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getCallStatus: async (callId: string) => {
    const response = await fetch(`${BASE_URL}/api/calls/${callId}/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  getCallHistory: async () => {
    const response = await fetch(`${BASE_URL}/api/calls/history`, {
      method: 'GET',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // Replace the mock getStats with real analytics
  getStats: async (): Promise<CampaignStats> => {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/dashboard`, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data: DashboardAnalytics = await response.json();
      
      // Extract values from the ElevenLabs response
      const stats: CampaignStats = {
        activeCampaigns: 0,
        callsToday: 0,
        successRate: "0%",
        totalMinutes: 0
      };

      if (data.charts && Array.isArray(data.charts)) {
        data.charts.forEach(chart => {
          switch (chart.name) {
            case "active_campaigns":
              stats.activeCampaigns = parseInt(chart.data) || 0;
              break;
            case "calls_today":
              stats.callsToday = parseInt(chart.data) || 0;
              break;
            case "success_rate":
              stats.successRate = typeof chart.data === 'number' 
                ? `${Math.round(chart.data * 100)}%` 
                : '0%';
              break;
            case "total_minutes":
              stats.totalMinutes = parseInt(chart.data) || 0;
              break;
          }
        });
      }

      return stats;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Return demo stats if the API call fails
      return {
        activeCampaigns: 3,
        callsToday: 45,
        successRate: "27%",
        totalMinutes: 180
      };
    }
  },

  updateCampaign: async (campaignId: number, updates: {
    name?: string;
    status?: string;
    firstPrompt?: string;
    systemPersona?: string;
  }) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  updateCampaignLeads: async (campaignId: number, leads: any[]) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/leads`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ leads }),
    });
    return handleResponse(response);
  },

  fixCallLogs: async (campaignId: number) => {
    const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/fix-call-logs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  deleteCampaign: async (campaignId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || 'Failed to delete campaign');
      }

      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete campaign');
    }
  },

  // Add updateDashboardSettings method
  updateDashboardSettings: async (settings: UpdateDashboardRequest) => {
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/dashboard/settings`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update dashboard settings');
      }

      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update dashboard settings');
    }
  },

  deleteKnowledgeBase: async (id: number, campaignId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/upload/knowledge-base/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ campaignId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete knowledge base file');
      }

      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete knowledge base file');
    }
  },

  deleteLeads: async (campaignId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${campaignId}/leads`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete leads');
      }

      return response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete leads');
    }
  },

  // Calendly API endpoints
  calendly: {
    // Public scheduling endpoint for landing pages
    getPublicSchedulingLink: async (eventType: string = '30min', prefillData?: any) => {
      const params = new URLSearchParams();
      params.append('eventType', eventType);
      
      if (prefillData) {
        params.append('prefill', JSON.stringify(prefillData));
      }
      
      const response = await fetch(`${BASE_URL}/api/calendly/public/schedule-link?${params}`, {
        method: 'GET'
      });
      
      return handleResponse(response);
    },

    // Capture lead information and get personalized scheduling link
    captureLeadAndSchedule: async (leadData: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      message?: string;
      eventType?: string;
    }) => {
      const response = await fetch(`${BASE_URL}/api/calendly/public/lead-capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      return handleResponse(response);
    },

    // Admin/authenticated endpoints
    getAuthUrl: async () => {
      const response = await fetch(`${BASE_URL}/api/calendly/auth/url`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      return handleResponse(response);
    },

    exchangeToken: async (code: string) => {
      const response = await fetch(`${BASE_URL}/api/calendly/auth/token`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ code }),
      });
      
      return handleResponse(response);
    },

    getCurrentUser: async (accessToken: string) => {
      const response = await fetch(`${BASE_URL}/api/calendly/user/me?accessToken=${encodeURIComponent(accessToken)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      return handleResponse(response);
    },

    getEventTypes: async (accessToken: string, userUri: string) => {
      const response = await fetch(`${BASE_URL}/api/calendly/event-types?accessToken=${encodeURIComponent(accessToken)}&userUri=${encodeURIComponent(userUri)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      return handleResponse(response);
    },

    getScheduledEvents: async (accessToken: string, userUri: string, options: {
      minStartTime?: string;
      maxStartTime?: string;
      count?: number;
    } = {}) => {
      const params = new URLSearchParams();
      params.append('accessToken', accessToken);
      params.append('userUri', userUri);
      
      if (options.minStartTime) params.append('minStartTime', options.minStartTime);
      if (options.maxStartTime) params.append('maxStartTime', options.maxStartTime);
      if (options.count) params.append('count', options.count.toString());
      
      const response = await fetch(`${BASE_URL}/api/calendly/scheduled-events?${params}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      return handleResponse(response);
    },

    // Public scheduling link generation (no auth required)
    generateSchedulingLink: async (eventTypeSlug: string, userSlug: string, options: any = {}) => {
      const response = await fetch(`${BASE_URL}/api/calendly/scheduling-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventTypeSlug, userSlug, options }),
      });
      
      return handleResponse(response);
    },

    setupWebhook: async (accessToken: string, webhookUrl: string, events?: string[]) => {
      const response = await fetch(`${BASE_URL}/api/calendly/webhooks/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ accessToken, webhookUrl, events }),
      });
      
      return handleResponse(response);
    },

    getAvailableTimes: async (accessToken: string, eventTypeUri: string, startDate: string, endDate: string) => {
      const params = new URLSearchParams();
      params.append('accessToken', accessToken);
      params.append('eventTypeUri', eventTypeUri);
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      
      const response = await fetch(`${BASE_URL}/api/calendly/available-times?${params}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      return handleResponse(response);
    },
  },

  // AI Demo Call API endpoints
  aiDemo: {
    scheduleCall: async (demoData: {
      name: string;
      phone: string;
      industry: string;
      useCase: string;
    }) => {
      const response = await fetch(`${BASE_URL}/api/ai-demo/schedule-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });
      
      return handleResponse(response);
    },

    getIndustries: async () => {
      const response = await fetch(`${BASE_URL}/api/ai-demo/industries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return handleResponse(response);
    },
  },
};
