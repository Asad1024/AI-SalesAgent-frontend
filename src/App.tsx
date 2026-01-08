import { Route, Switch, Redirect } from "wouter";
import { useTranslation } from "react-i18next";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { CurrencyProvider } from "@/contexts/currency-context";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import Voices from "@/pages/voices";
import Analytics from "@/pages/analytics";
import Upgrade from "@/pages/upgrade";
import HomeOption2 from "@/pages/home-option2";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import { Loader2 } from "lucide-react";
import CampaignDetails from "./pages/campaign-details";
import CampaignCreation from "./pages/campaign-creation";
import CampaignEdit from "./pages/campaign-edit";
import LiveChatWidget from "@/components/live-chat-widget";

function AppRouter() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={HomeOption2} />
        <Route path="/home" component={HomeOption2} />
        {/* Hidden options - kept for reference but not accessible */}
        {/* <Route path="/home-option1" component={HomeOption1} /> */}
        {/* <Route path="/home-option2" component={HomeOption2} /> */}
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={user ? Dashboard : Login} />
        <Route path="/campaigns/new">
          {!user ? <Redirect to="/login" /> : <CampaignCreation />}
        </Route>
        <Route path="/campaigns/:id/edit">
          {(params) =>
            !user ? <Redirect to="/login" /> : <CampaignEdit id={params.id} />
          }
        </Route>
        <Route path="/campaigns/:id">
          {(params) =>
            !user ? <Redirect to="/login" /> : <CampaignDetails id={params.id} />
          }
        </Route>
        <Route path="/campaigns">
          {!user ? <Redirect to="/login" /> : <Campaigns />}
        </Route>
        <Route path="/voices" component={user ? Voices : Login} />
        <Route path="/analytics" component={user ? Analytics : Login} />
        <Route path="/upgrade" component={user ? Upgrade : Login} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Global Chat Widget - Available on all pages */}
      {/* <LiveChatWidget /> */}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <AppRouter />
            </TooltipProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
