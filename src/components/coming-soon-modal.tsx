import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Sparkles, ExternalLink } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const { t } = useTranslation();

  const handlePaymentRedirect = () => {
    // Open payment link in new tab
    window.open('https://calendly.com/insyncinternational/payment', '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <DialogHeader className="text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {t('common.comingSoon.title')}
            </DialogTitle>
            
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
              {t('common.comingSoon.message')}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="mt-8 space-y-4">
          <Button 
            onClick={handlePaymentRedirect}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 mr-3" />
              {t('common.comingSoon.goToPayment')}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button 
            onClick={onClose} 
            variant="outline"
            className="w-full px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
          >
            {t('common.comingSoon.gotIt')}
          </Button>
        </div>
        
        {/* Bottom Gradient Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-b-2xl"></div>
      </DialogContent>
    </Dialog>
  );
}
