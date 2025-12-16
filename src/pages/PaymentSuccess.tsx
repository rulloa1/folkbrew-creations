import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [verifying, setVerifying] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<{
    success: boolean;
    paymentType?: string;
    amount?: number;
    proposalNumber?: string;
  } | null>(null);

  const sessionId = searchParams.get('session_id');
  const proposalId = searchParams.get('proposal_id');

  useEffect(() => {
    if (sessionId && proposalId) {
      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [sessionId, proposalId]);

  const verifyPayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId, proposalId },
      });

      if (error) throw error;

      setPaymentDetails(data);

      if (data.success) {
        toast({
          title: 'Payment Successful!',
          description: 'Your payment has been processed successfully.',
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentDetails({ success: false });
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-card brutalist-border">
            <CardContent className="pt-12 pb-8 text-center">
              {paymentDetails?.success ? (
                <>
                  {/* Success Animation */}
                  <div className="relative inline-block mb-6">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
                  </div>

                  <h1 className="text-3xl font-bold draincore-font mb-4 text-green-500">
                    PAYMENT SUCCESSFUL
                  </h1>

                  <p className="text-muted-foreground font-mono mb-8 max-w-md mx-auto">
                    Thank you for your payment! We've received your {paymentDetails.paymentType === 'deposit' ? 'deposit' : 'full payment'} and will begin work on your project shortly.
                  </p>

                  {/* Payment Details */}
                  <div className="glass-card p-6 mb-8 text-left">
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">// PAYMENT DETAILS</h3>
                    <div className="space-y-3 font-mono">
                      {paymentDetails.proposalNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Proposal:</span>
                          <span className="text-foreground">{paymentDetails.proposalNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground capitalize">
                          {paymentDetails.paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'}
                        </span>
                      </div>
                      {paymentDetails.amount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="text-primary font-bold">
                            ${(paymentDetails.amount / 100).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="glass-card p-6 mb-8 text-left">
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">// WHAT'S NEXT</h3>
                    <ul className="space-y-3 font-mono text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-primary">01.</span>
                        <span className="text-foreground">You'll receive a confirmation email with your receipt</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary">02.</span>
                        <span className="text-foreground">Our team will contact you within 24 hours</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary">03.</span>
                        <span className="text-foreground">We'll schedule a kickoff call to discuss your project</span>
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="font-mono border-border"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      BACK TO HOME
                    </Button>
                    <a
                      href="https://t.me/royalsolutions_ai"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="font-mono w-full sm:w-auto">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        CONTACT US ON TELEGRAM
                      </Button>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Error State */}
                  <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">❌</span>
                  </div>

                  <h1 className="text-3xl font-bold draincore-font mb-4 text-destructive">
                    PAYMENT VERIFICATION FAILED
                  </h1>

                  <p className="text-muted-foreground font-mono mb-8 max-w-md mx-auto">
                    We couldn't verify your payment. If you were charged, please contact us and we'll resolve this immediately.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/')}
                      variant="outline"
                      className="font-mono border-border"
                    >
                      BACK TO HOME
                    </Button>
                    <a
                      href="https://t.me/royalsolutions_ai"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="font-mono">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        CONTACT SUPPORT
                      </Button>
                    </a>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
