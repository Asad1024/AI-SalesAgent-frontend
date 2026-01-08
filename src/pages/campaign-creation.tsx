import CampaignManagement from "@/components/campaign-management";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/theme-toggle";
import LanguageSwitcher from "@/components/language-switcher";

export default function CampaignCreation() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-brand-50 via-brand-100 to-brand-50 dark:from-brand-900 dark:via-brand-800/20 dark:to-brand-900">
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
                  Create New Campaign
                </h2>
                <p className="text-black dark:text-black mt-2">Set up your AI voice calling campaign</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 bg-transparent">
          <CampaignManagement />
        </main>
      </div>
    </div>
  );
}
