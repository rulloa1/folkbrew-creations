import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { proposalId, proposalNumber, paymentType, amount, clientEmail, clientName, services, returnUrl } = await req.json();

    console.log('Creating checkout session:', { proposalId, proposalNumber, paymentType, amount, clientEmail });

    // Create line items description
    const serviceNames = services.map((s: any) => s.label).join(', ');
    const description = paymentType === 'deposit' 
      ? `50% Deposit for: ${serviceNames}`
      : `Full Payment for: ${serviceNames}`;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `RoyAISolutions - ${paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'}`,
              description: description,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&proposal_id=${proposalId}`,
      cancel_url: `${returnUrl}/proposal/${proposalId}`,
      customer_email: clientEmail,
      metadata: {
        proposal_id: proposalId,
        proposal_number: proposalNumber,
        payment_type: paymentType,
        client_name: clientName,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ 
      sessionId: session.id, 
      url: session.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
