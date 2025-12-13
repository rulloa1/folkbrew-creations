import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (per IP, 5 submissions per hour)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Clean every minute

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  needs: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('cf-connecting-ip') || 
               'unknown';

    console.log(`Lead submission attempt from IP: ${ip}`);

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip);
    
    if (!allowed) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later.' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
          } 
        }
      );
    }

    // Parse and validate request body
    const body: LeadData = await req.json();

    // Server-side validation
    const errors: string[] = [];
    
    if (!body.firstName?.trim() || body.firstName.length > 50) {
      errors.push('First name is required and must be less than 50 characters');
    }
    if (!body.lastName?.trim() || body.lastName.length > 50) {
      errors.push('Last name is required and must be less than 50 characters');
    }
    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 255) {
      errors.push('Valid email is required');
    }
    if (!body.phone?.trim() || body.phone.length > 20) {
      errors.push('Phone is required and must be less than 20 characters');
    }
    if (!body.company?.trim() || body.company.length > 100) {
      errors.push('Company is required and must be less than 100 characters');
    }
    if (!body.budget?.trim() || body.budget.length > 50) {
      errors.push('Budget is required and must be less than 50 characters');
    }
    if (!body.needs?.trim() || body.needs.length > 1000) {
      errors.push('Please describe your needs (max 1000 characters)');
    }

    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return new Response(
        JSON.stringify({ error: errors[0] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { error: insertError } = await supabase
      .from('leads')
      .insert({
        first_name: body.firstName.trim(),
        last_name: body.lastName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        company: body.company.trim(),
        budget: body.budget.trim(),
        needs: body.needs.trim(),
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Lead submitted successfully from IP: ${ip}, remaining: ${remaining}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Lead submitted successfully' }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(remaining),
        } 
      }
    );

  } catch (error) {
    console.error('Error in submit-lead function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
