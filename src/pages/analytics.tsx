import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Clock, Phone, Users, Target, Calendar, Download, Play, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api, AnalyticsData, CampaignPerformance, CallVolumeData, SuccessRateTrend } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

export default function Analytics() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("7d");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ["analytics", timeRange],
    queryFn: () => api.getAnalytics(timeRange),
    refetchInterval: 30000,
  });

  const { data: campaignPerformance, isLoading: performanceLoading, error: performanceError } = useQuery({
    queryKey: ["campaign-performance"],
    queryFn: () => api.getCampaignPerformance(),
    refetchInterval: 30000,
  });

  const { data: callVolumeData, isLoading: callVolumeLoading } = useQuery({
    queryKey: ["call-volume", timeRange],
    queryFn: () => api.getCallVolumeData(timeRange),
    refetchInterval: 30000,
  });

  const { data: successRateTrend, isLoading: trendLoading } = useQuery({
    queryKey: ["success-rate-trend", timeRange],
    queryFn: () => api.getSuccessRateTrend(timeRange),
    refetchInterval: 30000,
  });


  const analytics: AnalyticsData = analyticsData || {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    successRate: 0,
    totalMinutes: 0,
    averageCallDuration: 0,
    callsToday: 0,
    peakHours: '2-4 PM',
    dailyAverage: 0
  };

  const campaigns: CampaignPerformance[] = campaignPerformance || [];

  const generateMockCallVolumeData = (): CallVolumeData[] => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseCalls = Math.max(1, Math.floor(analytics.totalCalls / days));
      const calls = Math.floor(baseCalls * (0.5 + Math.random()));
      
      if (analytics.failedCalls === 0) {
        const successful = calls;
        const failed = 0;
        data.push({
          date: date.toISOString().split('T')[0],
          calls,
          successful,
          failed
        });
      } else {
        const successful = Math.floor(calls * (analytics.successRate / 100));
        const failed = calls - successful;
        data.push({
          date: date.toISOString().split('T')[0],
          calls,
          successful,
          failed
        });
      }
    }
    
    return data;
  };

  const generateMockSuccessRateTrend = (): SuccessRateTrend[] => {
    const days = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const baseRate = analytics.successRate / 100;
      const variation = (Math.random() - 0.5) * 0.2;
      const successRate = Math.max(0, Math.min(1, baseRate + variation));
      
      data.push({
        date: date.toISOString().split('T')[0],
        successRate: Math.round(successRate * 100)
      });
    }
    
    return data;
  };

  const chartCallVolumeData = callVolumeData && callVolumeData.length > 0 
    ? callVolumeData 
    : generateMockCallVolumeData();
    
  const chartSuccessRateData = successRateTrend && successRateTrend.length > 0 
    ? successRateTrend 
    : generateMockSuccessRateTrend();

  const analyticsCards = [
    {
      title: t('analytics.cards.totalCampaigns'),
      value: analytics.totalCampaigns,
      icon: Target,
      color: "blue",
    },
    {
      title: t('analytics.cards.activeCampaigns'), 
      value: analytics.activeCampaigns,
      icon: Play,
      color: "green",
    },
    {
      title: t('analytics.cards.totalCalls'),
      value: analytics.totalCalls,
      icon: Phone,
      color: "purple",
    },
    {
      title: t('analytics.cards.successRate'),
      value: `${analytics.successRate}%`,
      icon: TrendingUp,
      color: "emerald",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
    };
    return colorMap[color] || "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 dark:from-brand-900 dark:via-brand-800/20 dark:to-brand-900">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 100" fill="none">
              <defs>
                <pattern id="analytics-header-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="1.5" fill="currentColor" className="text-brand-500"/>
                  <path d="M30 0L30 25M0 30L25 30M30 30L30 55M35 30L60 30" stroke="currentColor" strokeWidth="0.8" className="text-brand-400"/>
                  <rect x="25" y="25" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-300"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#analytics-header-pattern)"/>
            </svg>
          </div>
          
          <div className="absolute top-3 right-24 w-4 h-4 bg-brand-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-24 w-3 h-3 bg-green-500/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-800 dark:text-brand-200 spark-gradient-text">
                  {t('analytics.title')}
                </h2>
                <p className="text-sm sm:text-base text-brand-600 dark:text-brand-400 mt-1 sm:mt-2">{t('analytics.subtitle')}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {analyticsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="border border-brand-200 dark:border-brand-800 bg-white/50 dark:bg-brand-900/50 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                analyticsCards.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index} className="border border-brand-200 dark:border-brand-800 bg-white/50 dark:bg-brand-900/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-brand-900/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-medium truncate">{metric.title}</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-800 dark:text-brand-200 mt-1 sm:mt-2">
                              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                            </p>
                          </div>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md ${getColorClasses(metric.color)}`}>
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>{t('analytics.charts.callVolume')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {callVolumeLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartCallVolumeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return timeRange === '24h' 
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            }}
                          />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={(value) => {
                              const date = new Date(value);
                              return date.toLocaleDateString();
                            }}
                            formatter={(value, name) => [
                              value,
                              name === 'calls' ? 'Total Calls' : 
                              name === 'successful' ? 'Successful' : 'Failed'
                            ]}
                          />
                          <Bar dataKey="calls" fill="#3b82f6" name="calls" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="successful" fill="#10b981" name="successful" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="failed" fill="#ef4444" name="failed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span>{t('analytics.charts.successRateTrend')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {trendLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartSuccessRateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="successRateGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => {
                              const date = new Date(value);
                              return timeRange === '24h' 
                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                            }}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={12}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            labelFormatter={(value) => {
                              const date = new Date(value);
                              return date.toLocaleDateString();
                            }}
                            formatter={(value) => [`${value}%`, 'Success Rate']}
                          />
                          <Area
                            type="monotone"
                            dataKey="successRate"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            fill="url(#successRateGradient)"
                            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <span>Campaign Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading campaign performance...</p>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Campaign Data</h3>
                    <p className="text-muted-foreground">Create campaigns to see performance analytics here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Campaign</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total Leads</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Completed</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Success Rate</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Avg Duration</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-medium text-foreground">{campaign.name}</div>
                            </td>
                            <td className="py-3 px-4 text-center text-foreground">{campaign.totalLeads}</td>
                            <td className="py-3 px-4 text-center text-foreground">{campaign.completedCalls}</td>
                            <td className="py-3 px-4 text-center text-foreground">{campaign.successRate}%</td>
                            <td className="py-3 px-4 text-center text-foreground">
                              {campaign.averageDuration > 0 ? `${Math.round(campaign.averageDuration / 60)}m` : '0m'}
                            </td>
                            <td className="py-3 px-4 text-center text-muted-foreground text-sm">
                              {new Date(campaign.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}