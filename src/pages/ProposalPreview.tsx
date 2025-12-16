import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, CreditCard, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProposalService {
  id: string;
  label: string;
  price: number;
  period: string | null;
}

interface Proposal {
  id: string;
  proposal_number: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string;
  industry: string | null;
  services: ProposalService[];
  budget: string;
  timeline: string;
  requirements: string;
  current_challenges: string | null;
  one_time_total: number;
  monthly_total: number;
  status: string;
}

export default function ProposalPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<'deposit' | 'full' | null>(null);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    if (!id) return;

    try {
      // Fetch proposal using RPC or direct query with service role
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        // If RLS blocks, try fetching via edge function
        console.log('Fetching proposal via edge function...');
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('get-proposal', {
          body: { proposalId: id },
        });
        
        if (edgeError) throw edgeError;
        if (edgeData) {
          setProposal({
            ...edgeData,
            services: edgeData.services as unknown as ProposalService[],
          });
        }
        return;
      }

      if (data) {
        setProposal({
          ...data,
          services: data.services as unknown as ProposalService[],
        });
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      toast({
        title: 'Error',
        description: 'Failed to load proposal.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentType: 'deposit' | 'full') => {
    if (!proposal) return;

    setPaymentLoading(paymentType);

    try {
      const amount = paymentType === 'deposit' 
        ? Math.round((proposal.one_time_total + proposal.monthly_total) / 2)
        : proposal.one_time_total + proposal.monthly_total;

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          proposalId: proposal.id,
          proposalNumber: proposal.proposal_number,
          paymentType,
          amount,
          clientEmail: proposal.email,
          clientName: `${proposal.first_name} ${proposal.last_name}`,
          services: proposal.services,
          returnUrl: window.location.origin,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  const generatePDF = () => {
    // Create printable version
    window.print();
    toast({
      title: 'PDF Generation',
      description: 'Use your browser\'s print function to save as PDF.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold draincore-font mb-4">PROPOSAL NOT FOUND</h1>
            <p className="text-muted-foreground mb-8 font-mono">
              The proposal you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/proposals')} className="font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              CREATE NEW PROPOSAL
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const oneTimeTotal = proposal.one_time_total / 100;
  const monthlyTotal = proposal.monthly_total / 100;
  const totalAmount = oneTimeTotal + monthlyTotal;
  const depositAmount = totalAmount / 2;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold draincore-font mb-2">
              PROPOSAL GENERATED
            </h1>
            <p className="text-muted-foreground font-mono">
              Your custom proposal is ready for review
            </p>
          </div>

          {/* Proposal Card */}
          <Card className="glass-card brutalist-border mb-8 print:shadow-none print:border-gray-300">
            <CardHeader className="border-b border-border print:border-gray-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="draincore-font text-xl tracking-wider print:text-black">
                    // ROYAISOLUTIONS
                  </CardTitle>
                  <CardDescription className="font-mono text-muted-foreground print:text-gray-600">
                    AI-Powered Business Solutions
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-muted-foreground print:text-gray-600">Proposal ID</p>
                  <p className="font-mono font-bold text-primary print:text-black">{proposal.proposal_number}</p>
                  <p className="font-mono text-sm text-muted-foreground print:text-gray-600">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-8 space-y-8">
              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold draincore-font mb-4 text-primary print:text-black">
                  &gt; CLIENT INFORMATION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Name: </span>
                    <span className="text-foreground print:text-black">{proposal.first_name} {proposal.last_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Company: </span>
                    <span className="text-foreground print:text-black">{proposal.company_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Email: </span>
                    <span className="text-foreground print:text-black">{proposal.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Phone: </span>
                    <span className="text-foreground print:text-black">{proposal.phone}</span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-lg font-semibold draincore-font mb-4 text-primary print:text-black">
                  &gt; PROJECT DETAILS
                </h3>
                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Timeline: </span>
                    <span className="text-foreground print:text-black">{proposal.timeline}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground print:text-gray-600">Budget: </span>
                    <span className="text-foreground print:text-black">{proposal.budget}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground print:text-gray-600 block mb-1">Requirements: </span>
                    <p className="text-foreground bg-secondary/50 p-3 rounded print:bg-gray-100 print:text-black">
                      {proposal.requirements}
                    </p>
                  </div>
                  {proposal.current_challenges && (
                    <div>
                      <span className="text-muted-foreground print:text-gray-600 block mb-1">Current Challenges: </span>
                      <p className="text-foreground bg-secondary/50 p-3 rounded print:bg-gray-100 print:text-black">
                        {proposal.current_challenges}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-semibold draincore-font mb-4 text-primary print:text-black">
                  &gt; RECOMMENDED SERVICES
                </h3>
                <div className="space-y-3">
                  {proposal.services.map((service) => (
                    <div 
                      key={service.id} 
                      className="flex justify-between items-center p-4 bg-secondary/30 rounded font-mono print:bg-gray-100"
                    >
                      <span className="text-foreground print:text-black">{service.label}</span>
                      <span className="text-primary font-bold print:text-black">
                        ${service.price.toLocaleString()}
                        {service.period && <span className="text-muted-foreground print:text-gray-600">{service.period}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Summary */}
              <div className="border-t border-border pt-6 print:border-gray-300">
                <h3 className="text-lg font-semibold draincore-font mb-4 text-primary print:text-black">
                  &gt; INVESTMENT SUMMARY
                </h3>
                <div className="space-y-2 font-mono">
                  {oneTimeTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground print:text-gray-600">One-time Investment:</span>
                      <span className="text-foreground print:text-black">${oneTimeTotal.toLocaleString()}</span>
                    </div>
                  )}
                  {monthlyTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground print:text-gray-600">Monthly Retainer:</span>
                      <span className="text-foreground print:text-black">${monthlyTotal.toLocaleString()}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 border-t border-border print:border-gray-300">
                    <span className="font-bold text-foreground print:text-black">Total:</span>
                    <span className="font-bold text-primary print:text-black">${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-secondary/30 p-4 rounded font-mono text-sm print:bg-gray-100">
                <p className="text-muted-foreground print:text-gray-600">
                  Contact: roryulloa@gmail.com | (346) 298-5038 | @royalsolutions_ai on Telegram
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options - Hide on print */}
          {proposal.status !== 'paid' && (
            <Card className="glass-card brutalist-border print:hidden">
              <CardHeader className="border-b border-border">
                <CardTitle className="draincore-font text-xl tracking-wider">
                  // PAYMENT OPTIONS
                </CardTitle>
                <CardDescription className="font-mono text-muted-foreground">
                  Choose your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deposit Option */}
                  <div className="glass-card p-6 border border-border hover:border-primary transition-colors">
                    <h4 className="font-mono font-bold text-lg mb-2">50% DEPOSIT</h4>
                    <p className="text-muted-foreground font-mono text-sm mb-4">
                      Secure your project with a deposit. Remaining balance due upon completion.
                    </p>
                    <p className="text-2xl font-bold text-primary font-mono mb-4">
                      ${depositAmount.toLocaleString()}
                    </p>
                    <Button 
                      onClick={() => handlePayment('deposit')}
                      disabled={paymentLoading !== null}
                      className="w-full font-mono"
                    >
                      {paymentLoading === 'deposit' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      PAY DEPOSIT
                    </Button>
                  </div>

                  {/* Full Payment Option */}
                  <div className="glass-card p-6 border-2 border-primary">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-mono font-bold text-lg">FULL PAYMENT</h4>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded font-mono">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-muted-foreground font-mono text-sm mb-4">
                      Pay the complete amount now and get priority scheduling.
                    </p>
                    <p className="text-2xl font-bold text-primary font-mono mb-4">
                      ${totalAmount.toLocaleString()}
                    </p>
                    <Button 
                      onClick={() => handlePayment('full')}
                      disabled={paymentLoading !== null}
                      className="w-full font-mono bg-primary hover:bg-primary/90"
                    >
                      {paymentLoading === 'full' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="w-4 h-4 mr-2" />
                      )}
                      PAY IN FULL
                    </Button>
                  </div>
                </div>

                {/* Download PDF */}
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    onClick={generatePDF}
                    className="font-mono border-border"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Paid Status */}
          {proposal.status === 'paid' && (
            <Card className="glass-card border-2 border-green-500 print:hidden">
              <CardContent className="pt-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-mono text-green-500 mb-2">PAYMENT RECEIVED</h3>
                <p className="text-muted-foreground font-mono">
                  Thank you! Our team will contact you shortly to begin your project.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
