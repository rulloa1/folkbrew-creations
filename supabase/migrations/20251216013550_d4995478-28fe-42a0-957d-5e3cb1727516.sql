-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Client info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  
  -- Project details
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  requirements TEXT NOT NULL,
  current_challenges TEXT,
  
  -- Pricing
  one_time_total INTEGER NOT NULL DEFAULT 0,
  monthly_total INTEGER NOT NULL DEFAULT 0,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'viewed', 'accepted', 'rejected', 'paid'))
);

-- Create payments table  
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe info
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  
  -- Payment details
  amount INTEGER NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('deposit', 'full')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Client info snapshot
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Proposals: Allow public insert (for form submissions)
CREATE POLICY "Allow public proposal submissions"
ON public.proposals
FOR INSERT
WITH CHECK (true);

-- Proposals: Only admins can view
CREATE POLICY "Only admins can view proposals"
ON public.proposals
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Proposals: Only admins can update
CREATE POLICY "Only admins can update proposals"
ON public.proposals
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Payments: Allow insert from edge functions (service role)
-- Note: Edge functions use service role key which bypasses RLS

-- Payments: Only admins can view
CREATE POLICY "Only admins can view payments"
ON public.payments
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes
CREATE INDEX idx_proposals_email ON public.proposals(email);
CREATE INDEX idx_proposals_status ON public.proposals(status);
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);
CREATE INDEX idx_payments_proposal_id ON public.payments(proposal_id);
CREATE INDEX idx_payments_status ON public.payments(status);