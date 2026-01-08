import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Zap, AlertCircle } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [, setLocation] = useLocation();

  const handleUpgrade = () => {
    onClose();
    setLocation('/upgrade');
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Insufficient Credits</DialogTitle>
          <DialogDescription className="text-center pt-2">
            You don't have enough credits to start this campaign. Upgrade your plan to get more credits and unlock premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Our plans include:</span>
              <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                <li>Basic: 500 Credits - One-time</li>
                <li>Essential: 500 Credits/Seat/Month</li>
                <li>Premium: 2,500 Credits/Month</li>
              </ul>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            View Plans
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
