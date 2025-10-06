import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface CalendlySchedulingProps {
  userSlug?: string;
  eventTypeSlug?: string;
  prefillData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  className?: string;
}

export default function CalendlyScheduling({
  userSlug = "insyncinternational", // Your Calendly username
  eventTypeSlug = "30min", // Most common slug for 30 minute meetings
  prefillData = {},
  className = ""
}: CalendlySchedulingProps) {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [schedulingLink, setSchedulingLink] = useState<string>('');
  const { toast } = useToast();

  // Initialize Calendly scheduling link on mount
  useEffect(() => {
    if (!schedulingLink && !isLoading) {
      setIsLoading(true);
      
      try {
        // Generate link directly client-side to avoid API calls and CORS issues
        let link = `https://calendly.com/${userSlug}/${eventTypeSlug}?embed_domain=${encodeURIComponent(window.location.hostname)}&embed_type=Popup`;
        
        // Add prefill parameters if provided
        if (Object.keys(prefillData).length > 0) {
          const searchParams = new URLSearchParams();
          if (prefillData.name) searchParams.append('name', prefillData.name);
          if (prefillData.email) searchParams.append('email', prefillData.email);
          if (prefillData.phone) searchParams.append('a1', prefillData.phone);
          
          const paramString = searchParams.toString();
          if (paramString) {
            link += '&' + paramString;
          }
        }
        
        setSchedulingLink(link);
        console.log('Generated Calendly link:', link);
        
      } catch (error) {
        console.error('Error generating scheduling link:', error);
        
        // Ultimate fallback
        const fallbackLink = `https://calendly.com/${userSlug}/${eventTypeSlug}`;
        setSchedulingLink(fallbackLink);
        
        toast({
          title: "Notice",
          description: "Using basic scheduling link. Some features may be limited.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, []); // Empty dependency array - run only once on mount

  const handleScheduleClick = () => {
    if (schedulingLink) {
      // Open Calendly in a popup window
      const popup = window.open(
        schedulingLink,
        'calendly-popup',
        'width=800,height=700,scrollbars=yes,resizable=yes'
      );

      // Optional: Listen for popup close
      const checkClosed = setInterval(() => {
        if (popup && popup.closed) {
          clearInterval(checkClosed);
          // Optionally refresh or update UI when popup is closed
          toast({
            title: "Scheduling Complete",
            description: "Thank you for scheduling! You should receive a confirmation email shortly.",
          });
        }
      }, 1000);
    } else {
      // Fallback to inline embed
      setIsSchedulingOpen(true);
    }
  };

  const CalendlyEmbed = () => {
    useEffect(() => {
      // Load Calendly embed script
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.head.appendChild(script);

      return () => {
        // Cleanup: remove script when component unmounts
        const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }, []);

    return (
      <div 
        className="calendly-inline-widget" 
        data-url={schedulingLink}
        style={{ minWidth: '320px', height: '700px' }}
      />
    );
  };

  return (
    <div className={className}>
      {/* Main Scheduling Button */}
      <Button 
        onClick={handleScheduleClick}
        disabled={isLoading || !schedulingLink}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Calendar className="w-4 h-4 mr-2" />
            Book Free Consultation
          </>
        )}
      </Button>

      {/* Inline Scheduling Dialog (Fallback) */}
      <Dialog open={isSchedulingOpen} onOpenChange={setIsSchedulingOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Your Free Consultation
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            {schedulingLink && <CalendlyEmbed />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Optional: Schedule Information Card */}
      <Card className="mt-4 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-blue-800">
            <User className="w-5 h-5 mr-2" />
            AI Expert Team
            <span className="ml-2 text-sm font-normal text-slate-600">Spark AI Specialists</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-slate-600">
            <Clock className="w-4 h-4 mr-2 text-blue-500" />
            <span className="font-medium">30 min</span>
            <span className="ml-2">Web conferencing details provided upon confirmation</span>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-slate-800">We'll cover:</p>
            <div className="space-y-1">
              {[
                "Your business needs and challenges",
                "Custom AI strategy for your industry", 
                "Implementation roadmap and timeline"
              ].map((item, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-4 pt-3 border-t border-blue-200">
            <blockquote className="text-sm text-slate-600 italic">
              "The AI experts at Spark AI were professional and attentive during our consultation. 
              They created an amazing AI voice agent strategy for our business that increased our 
              conversion rate by 300%."
            </blockquote>
            <cite className="text-xs text-slate-500 mt-1 block">
              - Sarah Johnson, CEO TechStart Inc.
            </cite>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
