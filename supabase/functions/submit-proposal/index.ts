import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProposalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  industry?: string;
  services: { id: string; label: string; price: number; period?: string }[];
  budget: string;
  timeline: string;
  requirements: string;
  currentChallenges?: string;
  oneTimeTotal: number;
  monthlyTotal: number;
}

const VALID_BUDGETS = [
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000+',
];

const VALID_TIMELINES = [
  'Urgent (1-2 weeks)',
  'Soon (2-4 weeks)',
  'Flexible (1-3 months)',
  'Planning phase (3+ months)',
];

const VALID_SERVICES = ['web', 'automation', 'leads'];

function validateProposal(data: ProposalData): string | null {
  // Required string fields
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
    return 'First name is required';
  }
  if (data.firstName.length > 100) return 'First name is too long';

  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
    return 'Last name is required';
  }
  if (data.lastName.length > 100) return 'Last name is too long';

  if (!data.email || typeof data.email !== 'string') {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return 'Invalid email format';
  if (data.email.length > 255) return 'Email is too long';

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    return 'Phone is required';
  }
  if (data.phone.length > 30) return 'Phone number is too long';

  if (!data.companyName || typeof data.companyName !== 'string' || data.companyName.trim().length === 0) {
    return 'Company name is required';
  }
  if (data.companyName.length > 200) return 'Company name is too long';

  // Optional industry
  if (data.industry && (typeof data.industry !== 'string' || data.industry.length > 100)) {
    return 'Industry is invalid';
  }

  // Services validation
  if (!Array.isArray(data.services) || data.services.length === 0) {
    return 'At least one service must be selected';
  }
  for (const service of data.services) {
    if (!service.id || !VALID_SERVICES.includes(service.id)) {
      return 'Invalid service selected';
    }
  }

  // Budget validation
  if (!data.budget || !VALID_BUDGETS.includes(data.budget)) {
    return 'Invalid budget range';
  }

  // Timeline validation
  if (!data.timeline || !VALID_TIMELINES.includes(data.timeline)) {
    return 'Invalid timeline';
  }

  // Requirements validation
  if (!data.requirements || typeof data.requirements !== 'string' || data.requirements.trim().length < 10) {
    return 'Requirements must be at least 10 characters';
  }
  if (data.requirements.length > 5000) return 'Requirements is too long';

  // Optional challenges
  if (data.currentChallenges && (typeof data.currentChallenges !== 'string' || data.currentChallenges.length > 5000)) {
    return 'Current challenges is too long';
  }

  // Numeric validation
  if (typeof data.oneTimeTotal !== 'number' || data.oneTimeTotal < 0) {
    return 'Invalid one-time total';
  }
  if (typeof data.monthlyTotal !== 'number' || data.monthlyTotal < 0) {
    return 'Invalid monthly total';
  }

  return null;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ProposalData = await req.json();
    console.log('Received proposal submission:', { email: data.email, company: data.companyName });

    // Server-side validation
    const validationError = validateProposal(data);
    if (validationError) {
      console.log('Validation failed:', validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role for insert
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const proposalNumber = `PROP-${Date.now()}`;

    // Insert proposal using service role (bypasses RLS)
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        proposal_number: proposalNumber,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        company_name: data.companyName.trim(),
        industry: data.industry?.trim() || null,
        services: data.services,
        budget: data.budget,
        timeline: data.timeline,
        requirements: data.requirements.trim(),
        current_challenges: data.currentChallenges?.trim() || null,
        one_time_total: data.oneTimeTotal,
        monthly_total: data.monthlyTotal,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create proposal' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Proposal created:', proposal.id);

    return new Response(
      JSON.stringify({ success: true, proposal }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing proposal:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
