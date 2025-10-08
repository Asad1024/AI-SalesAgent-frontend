import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Clock, Phone, Users, Target, Calendar, Download, Play, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/lib/api";
import Sidebar from "@/components/sidebar";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";
import { useTranslation } from "react-i18next";

export default function Analytics() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("7d");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: campaignsData } = useQuery({
    queryKey: ["/api/campaigns"],
    queryFn: () => api.getCampaigns(),
  });

  const campaigns = campaignsData?.campaigns || [];

  // Calculate analytics data
  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c: any) => c.status === "active").length;
  const totalCalls = campaigns.reduce((sum: number, c: any) => sum + (c.completedCalls || 0), 0);
  const successfulCalls = campaigns.reduce((sum: number, c: any) => sum + (c.successfulCalls || 0), 0);
  const failedCalls = campaigns.reduce((sum: number, c: any) => sum + (c.failedCalls || 0), 0);
  const successRate = totalCalls > 0 ? ((successfulCalls / totalCalls) * 100).toFixed(1) : "0";

  const analyticsCards = [
    {
      title: t('analytics.cards.totalCampaigns'),
      value: totalCampaigns,
      icon: Target,
      color: "blue",
      change: "+12%",
    },
    {
      title: t('analytics.cards.activeCampaigns'), 
      value: activeCampaigns,
      icon: Play,
      color: "green",
      change: "+8%",
    },
    {
      title: t('analytics.cards.totalCalls'),
      value: totalCalls,
      icon: Phone,
      color: "purple",
      change: "+23%",
    },
    {
      title: t('analytics.cards.successRate'),
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "emerald",
      change: "+5%",
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="relative bg-white/80 dark:bg-brand-900/80 backdrop-blur-xl border-b border-brand-200/50 dark:border-brand-800/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
          {/* Background Pattern */}
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
          
          {/* Floating Elements */}
          <div className="absolute top-3 right-24 w-4 h-4 bg-brand-500/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-3 left-24 w-3 h-3 bg-green-500/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {analyticsCards.map((metric, index) => {
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
                          <p className="text-xs sm:text-sm text-brand-500 mt-1">{metric.change}</p>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md ${getColorClasses(metric.color)}`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Call Volume Chart */}
              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>Call Volume</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Call volume chart</p>
                      <p className="text-sm text-muted-foreground/70">Chart visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate Trend */}
              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span>Success Rate Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-muted/20 rounded-xl">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Success rate trend</p>
                      <p className="text-sm text-muted-foreground/70">Trend visualization would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Performance Table */}
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
                {campaigns.length === 0 ? (
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
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total Leads</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Completed</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Success Rate</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign: any) => {
                          const campaignSuccessRate = campaign.completedCalls > 0 
                            ? ((campaign.successfulCalls || 0) / campaign.completedCalls * 100).toFixed(1)
                            : "0";
                          
                          return (
                            <tr key={campaign.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-medium text-foreground">{campaign.name}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  campaign.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                  campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                  campaign.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center text-foreground">{campaign.totalLeads}</td>
                              <td className="py-3 px-4 text-center text-foreground">{campaign.completedCalls || 0}</td>
                              <td className="py-3 px-4 text-center text-foreground">{campaignSuccessRate}%</td>
                              <td className="py-3 px-4 text-center text-muted-foreground text-sm">
                                {new Date(campaign.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Average Call Duration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">2.4m</p>
                    <p className="text-sm text-muted-foreground mt-1">Per call average</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Peak Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">2-4 PM</p>
                    <p className="text-sm text-muted-foreground mt-1">Best call times</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>Daily Average</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{Math.round(totalCalls / 7)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Calls per day</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}