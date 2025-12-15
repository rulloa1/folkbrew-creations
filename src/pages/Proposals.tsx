import { useState } from 'react';
import { FileText, Download, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  label: string;
  price: number;
  period?: string;
}

const SERVICES: Service[] = [
  { id: 'web', label: 'Web Development', price: 2500 },
  { id: 'automation', label: 'AI Automation', price: 997, period: '/month' },
  { id: 'leads', label: 'Lead Generation', price: 750, period: '/month' },
];

const BUDGET_RANGES = [
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

const TIMELINES = [
  'Urgent (1-2 weeks)',
  'Soon (2-4 weeks)',
  'Flexible (1-3 months)',
  'Planning phase (3+ months)',
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industry: string;
  services: string[];
  budget: string;
  timeline: string;
  requirements: string;
  currentChallenges: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Proposals() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    services: [],
    budget: '',
    timeline: '',
    requirements: '',
    currentChallenges: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (formData.services.length === 0) newErrors.services = 'Select at least one service';
    if (!formData.budget) newErrors.budget = 'Budget range is required';
    if (!formData.timeline) newErrors.timeline = 'Timeline is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Please describe your requirements';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId],
    }));
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedServices = SERVICES.filter(s => formData.services.includes(s.id));

      // For now, we'll simulate a successful submission
      // In production, this would call your backend API
      const proposalId = `PROP-${Date.now()}`;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setGeneratedProposal({ proposalId });
      
      toast({
        title: 'Success!',
        description: 'Proposal request submitted successfully. We will contact you soon!',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        industry: '',
        services: [],
        budget: '',
        timeline: '',
        requirements: '',
        currentChallenges: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit proposal request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">Proposal Generator</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Get a customized proposal for your business needs in minutes
          </p>
        </div>

        {/* Status Messages */}
        {generatedProposal && (
          <Alert className="mb-8 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Proposal request submitted successfully! We will contact you at {formData.email} shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Tell us about your project and requirements</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      className={errors.companyName ? 'border-red-500' : ''}
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., SaaS, E-commerce, Healthcare"
                    />
                  </div>
                </div>
              </div>

              {/* Services Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Services Needed *</h3>
                {errors.services && <p className="text-red-500 text-sm mb-4">{errors.services}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SERVICES.map(service => (
                    <div
                      key={service.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.services.includes(service.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => handleServiceChange(service.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.services.includes(service.id)}
                          onCheckedChange={() => handleServiceChange(service.id)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{service.label}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            ${service.price.toLocaleString()}
                            {service.period && <span>{service.period}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">Budget Range *</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                    <SelectTrigger className={errors.budget ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map(range => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                    <SelectTrigger className={errors.timeline ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select a timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map(timeline => (
                        <SelectItem key={timeline} value={timeline}>
                          {timeline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label htmlFor="requirements">Project Requirements *</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Describe your project requirements, goals, and specific needs..."
                  className={`min-h-32 ${errors.requirements ? 'border-red-500' : ''}`}
                />
                {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
              </div>

              {/* Current Challenges */}
              <div>
                <Label htmlFor="currentChallenges">Current Challenges (Optional)</Label>
                <Textarea
                  id="currentChallenges"
                  name="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={handleInputChange}
                  placeholder="What challenges are you currently facing?"
                  className="min-h-24"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 h-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Request Proposal
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Proposal Preview */}
        {generatedProposal && (
          <Card className="mt-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle>Request Submitted</CardTitle>
              <CardDescription>We'll contact you shortly with your custom proposal</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="text-lg font-semibold text-gray-900">{generatedProposal.proposalId}</p>
                </div>
                <p className="text-gray-600">
                  Thank you for your interest! Our team will review your requirements and send you a detailed proposal within 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
