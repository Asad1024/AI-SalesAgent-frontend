import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Loader2, Shield, Clock, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface AIDemoCallMinimalProps {
  className?: string;
}

// Industry to use case mappings
const INDUSTRY_USE_CASES = {
  'real-estate': [
    { value: 'lead-qualification', label: 'Lead Qualification & Nurturing' },
    { value: 'property-inquiries', label: 'Property Inquiry Handling' },
    { value: 'appointment-scheduling', label: 'Showing Appointment Scheduling' },
    { value: 'follow-up-calls', label: 'Follow-up & Pipeline Management' },
    { value: 'market-updates', label: 'Market Update Calls' }
  ],
  'healthcare': [
    { value: 'appointment-booking', label: 'Appointment Booking & Scheduling' },
    { value: 'patient-reminders', label: 'Patient Reminder Calls' },
    { value: 'insurance-verification', label: 'Insurance Verification' },
    { value: 'prescription-refills', label: 'Prescription Refill Requests' },
    { value: 'wellness-checkups', label: 'Wellness Check-up Outreach' }
  ],
  'e-commerce': [
    { value: 'abandoned-cart', label: 'Abandoned Cart Recovery' },
    { value: 'order-follow-up', label: 'Order Follow-up & Upselling' },
    { value: 'customer-support', label: 'Customer Support & Returns' },
    { value: 'product-recommendations', label: 'Product Recommendations' },
    { value: 'loyalty-programs', label: 'Loyalty Program Enrollment' }
  ],
  'financial-services': [
    { value: 'loan-applications', label: 'Loan Application Follow-up' },
    { value: 'investment-consultation', label: 'Investment Consultation Booking' },
    { value: 'payment-reminders', label: 'Payment Reminder Calls' },
    { value: 'account-verification', label: 'Account Verification & Security' },
    { value: 'financial-planning', label: 'Financial Planning Outreach' }
  ],
  'automotive': [
    { value: 'service-reminders', label: 'Service Appointment Reminders' },
    { value: 'sales-follow-up', label: 'Sales Follow-up & Test Drives' },
    { value: 'parts-availability', label: 'Parts Availability Inquiries' },
    { value: 'warranty-calls', label: 'Warranty & Service Updates' },
    { value: 'trade-in-evaluation', label: 'Trade-in Value Assessment' }
  ],
  'education': [
    { value: 'enrollment-follow-up', label: 'Student Enrollment Follow-up' },
    { value: 'course-recommendations', label: 'Course Recommendations' },
    { value: 'parent-engagement', label: 'Parent Engagement Calls' },
    { value: 'scholarship-outreach', label: 'Scholarship & Aid Outreach' },
    { value: 'event-invitations', label: 'Event & Workshop Invitations' }
  ],
  'hospitality': [
    { value: 'booking-confirmations', label: 'Booking Confirmations & Upsells' },
    { value: 'guest-experience', label: 'Guest Experience Follow-up' },
    { value: 'event-planning', label: 'Event Planning Consultations' },
    { value: 'loyalty-rewards', label: 'Loyalty Rewards & Promotions' },
    { value: 'reservation-management', label: 'Reservation Management' }
  ],
  'legal': [
    { value: 'consultation-booking', label: 'Legal Consultation Booking' },
    { value: 'case-updates', label: 'Case Status Updates' },
    { value: 'document-collection', label: 'Document Collection Follow-up' },
    { value: 'client-intake', label: 'Initial Client Intake' },
    { value: 'payment-reminders', label: 'Payment & Billing Follow-up' }
  ]
};

const INDUSTRIES = [
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'education', label: 'Education' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'legal', label: 'Legal' }
];

export default function AIDemoCallMinimal({ className = "" }: AIDemoCallMinimalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    industry: '',
    useCase: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const { toast } = useToast();

  // Fetch industries from API
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await api.aiDemo.getIndustries();
        if (response.success) {
          setIndustries(response.industries);
        } else {
          console.error('Failed to fetch industries:', response.error);
          // Fallback to hardcoded industries if API fails
          setIndustries(Object.keys(INDUSTRY_USE_CASES).map(industryKey => ({
            value: industryKey,
            label: industryKey.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
            useCases: INDUSTRY_USE_CASES[industryKey as keyof typeof INDUSTRY_USE_CASES]
          })));
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        // Fallback to hardcoded industries
        setIndustries(Object.keys(INDUSTRY_USE_CASES).map(industryKey => ({
          value: industryKey,
          label: industryKey.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          useCases: INDUSTRY_USE_CASES[industryKey as keyof typeof INDUSTRY_USE_CASES]
        })));
      } finally {
        setLoadingIndustries(false);
      }
    };

    fetchIndustries();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Reset use case when industry changes
      if (field === 'industry') {
        updated.useCase = '';
      }
      
      return updated;
    });
  };

  const getUseCasesForIndustry = (industry: string) => {
    const industryData = industries.find(ind => ind.value === industry);
    return industryData?.useCases || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.industry || !formData.useCase) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to get your personalized demo call.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.aiDemo.scheduleCall({
        name: formData.name,
        phone: formData.phone,
        industry: formData.industry,
        useCase: formData.useCase
      });

      if (response.success) {
        toast({
          title: "Demo Call Scheduled! 📞",
          description: `Your AI agent will call ${formData.phone} in the next 60 seconds. Get ready to be amazed!`,
        });
        
        // Reset form
        setFormData({ name: '', phone: '', industry: '', useCase: '' });
      } else {
        throw new Error(response.error || 'Failed to schedule demo call');
      }

    } catch (error: any) {
      console.error('Error scheduling demo call:', error);
      toast({
        title: "Scheduling Failed",
        description: error.message || "Unable to schedule your demo call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name and Phone Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-white/90 border-white/20 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-500"
            required
          />
          <Input
            type="tel"
            placeholder="+971 00 000 0000"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="bg-white/90 border-white/20 text-slate-900 placeholder:text-slate-500 focus:bg-white focus:border-blue-500"
            required
          />
        </div>

        {/* Industry Field */}
        <Select
          value={formData.industry}
          onValueChange={(value) => handleInputChange('industry', value)}
        >
          <SelectTrigger className="bg-white/90 border-white/20 text-slate-900 focus:bg-white focus:border-blue-500">
            <SelectValue placeholder="Select Your Industry" />
          </SelectTrigger>
          <SelectContent>
            {loadingIndustries ? (
              <SelectItem value="loading" disabled>
                Loading industries...
              </SelectItem>
            ) : (
              industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Use Case Field - Only show if industry is selected */}
        {formData.industry && (
          <Select
            value={formData.useCase}
            onValueChange={(value) => handleInputChange('useCase', value)}
          >
            <SelectTrigger className="bg-white/90 border-white/20 text-slate-900 focus:bg-white focus:border-blue-500">
              <SelectValue placeholder="Select Your Use Case" />
            </SelectTrigger>
            <SelectContent>
                  {getUseCasesForIndustry(formData.industry).map((useCase: any) => (
                <SelectItem key={useCase.value} value={useCase.value}>
                  {useCase.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Scheduling Demo...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5 mr-2" />
              Get Free Demo Call
            </>
          )}
        </Button>

        {/* Minimal Trust Indicators */}
        <div className="flex items-center justify-center space-x-4 text-xs text-white/70 mt-3">
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            60s Setup
          </div>
          <div className="flex items-center">
            <CreditCard className="w-3 h-3 mr-1" />
            No Card Required
          </div>
        </div>
      </form>
    </div>
  );
}
