import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function sendEmailNotification(data: any) {
  try {
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      console.error('Email notification failed:', await response.text());
    } else {
      console.log('Email notification sent:', data.type);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, proposalId } = await req.json();

    console.log('Verifying payment:', { sessionId, proposalId });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Payment not completed' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Record the payment in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        proposal_id: proposalId,
        stripe_checkout_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: session.amount_total || 0,
        payment_type: session.metadata?.payment_type || 'full',
        status: 'completed',
        client_email: session.customer_email || session.metadata?.client_email || '',
        client_name: session.metadata?.client_name || '',
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
    }

    // Update proposal status
    const { error: proposalError } = await supabase
      .from('proposals')
      .update({ status: 'paid' })
      .eq('id', proposalId);

    if (proposalError) {
      console.error('Error updating proposal status:', proposalError);
    }

    // Fetch proposal details for email
    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', proposalId)
      .single();

    if (proposal) {
      const emailData = {
        proposalNumber: proposal.proposal_number,
        clientName: `${proposal.first_name} ${proposal.last_name}`,
        clientEmail: proposal.email,
        companyName: proposal.company_name,
        services: proposal.services as any[],
        oneTimeTotal: proposal.one_time_total,
        monthlyTotal: proposal.monthly_total,
        paymentType: session.metadata?.payment_type,
        paymentAmount: session.amount_total,
      };

      // Send payment confirmation emails (fire and forget)
      sendEmailNotification({ ...emailData, type: 'payment_client' });
      sendEmailNotification({ ...emailData, type: 'payment_admin' });
    }

    console.log('Payment verified and recorded successfully');

    return new Response(JSON.stringify({ 
      success: true,
      paymentType: session.metadata?.payment_type,
      amount: session.amount_total,
      proposalNumber: session.metadata?.proposal_number,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error('Error verifying payment:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
