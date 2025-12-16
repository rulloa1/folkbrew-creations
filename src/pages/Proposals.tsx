import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle, Zap, Bot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Service {
  id: string;
  label: string;
  price: number;
  period?: string;
  icon: React.ReactNode;
}

const SERVICES: Service[] = [
  { id: 'web', label: 'Web Development', price: 2500, icon: <Zap className="w-5 h-5" /> },
  { id: 'automation', label: 'AI Automation', price: 997, period: '/month', icon: <Bot className="w-5 h-5" /> },
  { id: 'leads', label: 'Lead Generation', price: 750, period: '/month', icon: <Users className="w-5 h-5" /> },
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
  const navigate = useNavigate();
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

  const calculatePricing = () => {
    let oneTime = 0;
    let monthly = 0;
    
    formData.services.forEach(serviceId => {
      const service = SERVICES.find(s => s.id === serviceId);
      if (service) {
        if (service.period) {
          monthly += service.price;
        } else {
          oneTime += service.price;
        }
      }
    });
    
    return { oneTime, monthly };
  };

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
    if (!formData.requirements.trim() || formData.requirements.length < 10) {
      newErrors.requirements = 'Please describe your requirements (minimum 10 characters)';
    }

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
      const { oneTime, monthly } = calculatePricing();
      const selectedServices = SERVICES.filter(s => formData.services.includes(s.id));

      // Submit proposal via edge function for server-side validation
      const { data: response, error } = await supabase.functions.invoke('submit-proposal', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          industry: formData.industry || null,
          services: selectedServices.map(s => ({
            id: s.id,
            label: s.label,
            price: s.price,
            period: s.period || null,
          })),
          budget: formData.budget,
          timeline: formData.timeline,
          requirements: formData.requirements,
          currentChallenges: formData.currentChallenges || null,
          oneTimeTotal: oneTime * 100, // Store in cents
          monthlyTotal: monthly * 100,
        },
      });

      if (error) throw error;
      if (response?.error) throw new Error(response.error);

      const proposal = response.proposal;
      const proposalNumber = proposal.proposal_number;

      // Send email notifications (fire and forget - don't block navigation)
      const emailData = {
        proposalNumber,
        clientName: `${formData.firstName} ${formData.lastName}`,
        clientEmail: formData.email,
        companyName: formData.companyName,
        services: selectedServices.map(s => ({
          label: s.label,
          price: s.price,
          period: s.period || null,
        })),
        oneTimeTotal: oneTime * 100,
        monthlyTotal: monthly * 100,
        timeline: formData.timeline,
        budget: formData.budget,
        requirements: formData.requirements,
      };

      // Send to client
      supabase.functions.invoke('send-email', {
        body: { ...emailData, type: 'proposal_client' },
      }).catch(err => console.error('Failed to send client email:', err));

      // Send to admin
      supabase.functions.invoke('send-email', {
        body: { ...emailData, type: 'proposal_admin' },
      }).catch(err => console.error('Failed to send admin email:', err));

      toast({
        title: 'Proposal Generated!',
        description: 'Your custom proposal is ready. Check your email for details!',
      });

      // Navigate to proposal preview
      navigate(`/proposal/${proposal.id}`);
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate proposal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const { oneTime, monthly } = calculatePricing();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="drain-sharp-star" style={{ position: 'relative', width: '32px', height: '32px' }} />
              <h1 className="text-4xl font-bold draincore-font glitch-effect" data-text="PROPOSAL GENERATOR">
                PROPOSAL GENERATOR
              </h1>
            </div>
            <p className="text-muted-foreground text-lg font-mono tracking-wider">
              Get a customized proposal for your business needs
            </p>
          </div>

          {/* Form */}
          <Card className="glass-card brutalist-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="draincore-font text-xl tracking-wider">
                // BUSINESS INFORMATION
              </CardTitle>
              <CardDescription className="font-mono text-muted-foreground">
                Tell us about your project and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold draincore-font mb-6 text-primary">
                    &gt; YOUR INFORMATION
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="font-mono text-sm">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className={`bg-input border-border font-mono ${errors.firstName ? 'border-destructive' : ''}`}
                      />
                      {errors.firstName && <p className="text-destructive text-sm mt-1 font-mono">{errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="font-mono text-sm">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className={`bg-input border-border font-mono ${errors.lastName ? 'border-destructive' : ''}`}
                      />
                      {errors.lastName && <p className="text-destructive text-sm mt-1 font-mono">{errors.lastName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-mono text-sm">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        className={`bg-input border-border font-mono ${errors.email ? 'border-destructive' : ''}`}
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1 font-mono">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="font-mono text-sm">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                        className={`bg-input border-border font-mono ${errors.phone ? 'border-destructive' : ''}`}
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1 font-mono">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="companyName" className="font-mono text-sm">Company Name *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        className={`bg-input border-border font-mono ${errors.companyName ? 'border-destructive' : ''}`}
                      />
                      {errors.companyName && <p className="text-destructive text-sm mt-1 font-mono">{errors.companyName}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="industry" className="font-mono text-sm">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g., SaaS, E-commerce, Healthcare"
                        className="bg-input border-border font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Selection */}
                <div>
                  <h3 className="text-lg font-semibold draincore-font mb-6 text-primary">
                    &gt; SERVICES NEEDED *
                  </h3>
                  {errors.services && <p className="text-destructive text-sm mb-4 font-mono">{errors.services}</p>}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SERVICES.map(service => (
                      <div
                        key={service.id}
                        className={`p-4 cursor-pointer transition-all duration-300 glass-card ${
                          formData.services.includes(service.id)
                            ? 'border-2 border-primary shadow-glow'
                            : 'border border-border hover:border-muted-foreground'
                        }`}
                        onClick={() => handleServiceChange(service.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={() => handleServiceChange(service.id)}
                            className="mt-1 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-primary">{service.icon}</span>
                              <p className="font-semibold font-mono text-foreground">{service.label}</p>
                            </div>
                            <p className="text-sm text-primary font-mono">
                              ${service.price.toLocaleString()}
                              {service.period && <span className="text-muted-foreground">{service.period}</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Preview */}
                {formData.services.length > 0 && (
                  <div className="glass-card p-4 border border-primary/30">
                    <h4 className="font-mono text-sm text-muted-foreground mb-2">// PRICING PREVIEW</h4>
                    <div className="flex flex-wrap gap-6">
                      {oneTime > 0 && (
                        <div>
                          <span className="text-muted-foreground font-mono text-sm">One-time: </span>
                          <span className="text-primary font-bold font-mono">${oneTime.toLocaleString()}</span>
                        </div>
                      )}
                      {monthly > 0 && (
                        <div>
                          <span className="text-muted-foreground font-mono text-sm">Monthly: </span>
                          <span className="text-primary font-bold font-mono">${monthly.toLocaleString()}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Budget & Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="font-mono text-sm">Budget Range *</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                      <SelectTrigger className={`bg-input border-border font-mono ${errors.budget ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Select a budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {BUDGET_RANGES.map(range => (
                          <SelectItem key={range} value={range} className="font-mono">
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.budget && <p className="text-destructive text-sm mt-1 font-mono">{errors.budget}</p>}
                  </div>

                  <div>
                    <Label htmlFor="timeline" className="font-mono text-sm">Timeline *</Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                      <SelectTrigger className={`bg-input border-border font-mono ${errors.timeline ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Select a timeline" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {TIMELINES.map(timeline => (
                          <SelectItem key={timeline} value={timeline} className="font-mono">
                            {timeline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.timeline && <p className="text-destructive text-sm mt-1 font-mono">{errors.timeline}</p>}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <Label htmlFor="requirements" className="font-mono text-sm">Project Requirements *</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Describe your project requirements, goals, and specific needs..."
                    className={`min-h-32 bg-input border-border font-mono ${errors.requirements ? 'border-destructive' : ''}`}
                  />
                  {errors.requirements && <p className="text-destructive text-sm mt-1 font-mono">{errors.requirements}</p>}
                </div>

                {/* Current Challenges */}
                <div>
                  <Label htmlFor="currentChallenges" className="font-mono text-sm">Current Challenges (Optional)</Label>
                  <Textarea
                    id="currentChallenges"
                    name="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={handleInputChange}
                    placeholder="What challenges are you currently facing?"
                    className="min-h-24 bg-input border-border font-mono"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono tracking-wider py-6 text-lg brutalist-border"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      GENERATING PROPOSAL...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      GENERATE PROPOSAL
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
