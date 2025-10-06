import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Clock, CreditCard, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface AIDemoCallProps {
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

export default function AIDemoCall({ className = "" }: AIDemoCallProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    industry: '',
    useCase: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [callScheduled, setCallScheduled] = useState(false);
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
        setCallScheduled(true);
        toast({
          title: "Demo Call Scheduled! 📞",
          description: `Your AI agent will call ${formData.phone} in the next 60 seconds. Get ready to be amazed!`,
        });
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

  const selectedIndustryLabel = INDUSTRIES.find(ind => ind.value === formData.industry)?.label;
  const selectedUseCaseLabel = getUseCasesForIndustry(formData.industry).find((uc: any) => uc.value === formData.useCase)?.label;

  if (callScheduled) {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Demo Call Scheduled! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-600 dark:text-slate-400">
            Your AI agent will call <strong>{formData.phone}</strong> in the next <strong>60 seconds</strong>.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Your Demo Details:</h4>
            <div className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
              <p><strong>Industry:</strong> {selectedIndustryLabel}</p>
              <p><strong>Use Case:</strong> {selectedUseCaseLabel}</p>
              <p><strong>Script:</strong> AI-generated for your specific scenario</p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              60 Second Setup
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              Real AI Demo
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            📱 Keep your phone ready and experience the magic of AI-powered conversations!
          </p>

          <Button 
            onClick={() => {
              setCallScheduled(false);
              setFormData({ name: '', phone: '', industry: '', useCase: '' });
            }}
            variant="outline"
            className="mt-4"
          >
            Schedule Another Demo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-lg mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
          Experience the Magic – Get a Free AI Demo Call Tailored to Your Industry
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-slate-600 dark:text-slate-400 text-justify mb-6">
          Our AI agent will call you in just <strong>60 seconds</strong> to showcase how it handles real customer conversations, specific to your industry and use case. Experience how it qualifies leads, answers questions, and boosts conversion — automatically.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+971 00 000 0000"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          {/* Industry Field */}
          <div>
            <Label htmlFor="industry">Your Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleInputChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your industry" />
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
          </div>

          {/* Use Case Field - Only show if industry is selected */}
          {formData.industry && (
            <div>
              <Label htmlFor="useCase">Your Use Case</Label>
              <Select
                value={formData.useCase}
                onValueChange={(value) => handleInputChange('useCase', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your specific use case" />
                </SelectTrigger>
                <SelectContent>
                  {getUseCasesForIndustry(formData.industry).map((useCase: any) => (
                    <SelectItem key={useCase.value} value={useCase.value}>
                      {useCase.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Scheduling Your Demo...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Get Free Demo Call
              </>
            )}
          </Button>
        </form>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1 text-green-500" />
            100% Secure
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-blue-500" />
            60 Second Setup
          </div>
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-1 text-purple-500" />
            No Credit Card Required
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
