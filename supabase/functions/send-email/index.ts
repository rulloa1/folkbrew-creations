import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "roryulloa@gmail.com";
const FROM_EMAIL = "RoyAISolutions <onboarding@resend.dev>";

interface ProposalEmailData {
  type: 'proposal_client' | 'proposal_admin' | 'payment_client' | 'payment_admin';
  proposalNumber: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  services: Array<{ label: string; price: number; period?: string | null }>;
  oneTimeTotal: number;
  monthlyTotal: number;
  timeline?: string;
  budget?: string;
  requirements?: string;
  paymentType?: string;
  paymentAmount?: number;
}

function generateProposalClientEmail(data: ProposalEmailData): string {
  const servicesHtml = data.services.map(s => 
    `<li style="padding: 8px 0; border-bottom: 1px solid #333;">
      <strong>${s.label}</strong> - $${s.price.toLocaleString()}${s.period || ''}
    </li>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Courier New', monospace; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #242424; border: 2px solid #bbb; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #444; padding-bottom: 20px; }
        .logo { font-size: 24px; font-style: italic; color: #fff; }
        h1 { color: #bbb; font-size: 20px; letter-spacing: 2px; }
        .section { margin: 20px 0; }
        .section-title { color: #bbb; font-size: 14px; margin-bottom: 10px; }
        ul { list-style: none; padding: 0; margin: 0; }
        .total { font-size: 18px; color: #bbb; margin-top: 20px; padding-top: 20px; border-top: 2px solid #bbb; }
        .cta { text-align: center; margin: 30px 0; }
        .cta a { background: #bbb; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; display: inline-block; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">RoyAISolutions</div>
          <p style="color: #888; font-size: 12px;">AI-Powered Business Solutions</p>
        </div>
        
        <h1>// YOUR PROPOSAL IS READY</h1>
        
        <p>Hello ${data.clientName},</p>
        <p>Thank you for your interest in RoyAISolutions! Your custom proposal has been generated and is ready for review.</p>
        
        <div class="section">
          <div class="section-title">> PROPOSAL DETAILS</div>
          <p><strong>Proposal ID:</strong> ${data.proposalNumber}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
        </div>
        
        <div class="section">
          <div class="section-title">> SELECTED SERVICES</div>
          <ul>${servicesHtml}</ul>
        </div>
        
        <div class="total">
          ${data.oneTimeTotal > 0 ? `<p>One-time Investment: <strong>$${(data.oneTimeTotal / 100).toLocaleString()}</strong></p>` : ''}
          ${data.monthlyTotal > 0 ? `<p>Monthly Retainer: <strong>$${(data.monthlyTotal / 100).toLocaleString()}/mo</strong></p>` : ''}
          <p style="font-size: 20px;">Total: <strong style="color: #fff;">$${((data.oneTimeTotal + data.monthlyTotal) / 100).toLocaleString()}</strong></p>
        </div>
        
        <div class="cta">
          <p style="color: #888; margin-bottom: 15px;">Ready to get started?</p>
          <a href="https://t.me/royalsolutions_ai">CONTACT US ON TELEGRAM</a>
        </div>
        
        <div class="footer">
          <p>RoyAISolutions | roryulloa@gmail.com | (346) 298-5038</p>
          <p>@royalsolutions_ai on Telegram</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateProposalAdminEmail(data: ProposalEmailData): string {
  const servicesHtml = data.services.map(s => 
    `<li>${s.label} - $${s.price.toLocaleString()}${s.period || ''}</li>`
  ).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; }
        .alert { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; }
        .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; }
        .value { color: #333; font-size: 16px; margin-top: 5px; }
        .total { font-size: 24px; color: #4caf50; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎉 New Proposal Generated!</h1>
        
        <div class="alert">
          <strong>Proposal ${data.proposalNumber}</strong> has been generated and sent to the client.
        </div>
        
        <div class="section">
          <div class="label">Client Information</div>
          <div class="value">
            <p><strong>${data.clientName}</strong></p>
            <p>${data.clientEmail}</p>
            <p>${data.companyName}</p>
          </div>
        </div>
        
        <div class="section">
          <div class="label">Project Details</div>
          <div class="value">
            <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</p>
            <p><strong>Requirements:</strong> ${data.requirements || 'Not provided'}</p>
          </div>
        </div>
        
        <div class="section">
          <div class="label">Selected Services</div>
          <ul>${servicesHtml}</ul>
        </div>
        
        <div class="section">
          <div class="label">Total Value</div>
          <div class="total">$${((data.oneTimeTotal + data.monthlyTotal) / 100).toLocaleString()}</div>
          ${data.oneTimeTotal > 0 ? `<p>One-time: $${(data.oneTimeTotal / 100).toLocaleString()}</p>` : ''}
          ${data.monthlyTotal > 0 ? `<p>Monthly: $${(data.monthlyTotal / 100).toLocaleString()}/mo</p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePaymentClientEmail(data: ProposalEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Courier New', monospace; background: #1a1a1a; color: #fff; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #242424; border: 2px solid #4caf50; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-style: italic; color: #fff; }
        .success-badge { background: #4caf50; color: #fff; padding: 10px 20px; display: inline-block; margin: 20px 0; }
        h1 { color: #4caf50; font-size: 20px; letter-spacing: 2px; }
        .section { margin: 20px 0; padding: 15px; background: #1a1a1a; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">RoyAISolutions</div>
          <div class="success-badge">✓ PAYMENT CONFIRMED</div>
        </div>
        
        <h1>// THANK YOU FOR YOUR PAYMENT</h1>
        
        <p>Hello ${data.clientName},</p>
        <p>Your payment has been successfully processed. Here are the details:</p>
        
        <div class="section">
          <p><strong>Proposal:</strong> ${data.proposalNumber}</p>
          <p><strong>Payment Type:</strong> ${data.paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'}</p>
          <p><strong>Amount Paid:</strong> $${((data.paymentAmount || 0) / 100).toLocaleString()}</p>
        </div>
        
        <div class="section">
          <h3 style="color: #bbb;">What's Next?</h3>
          <ol style="color: #ccc; line-height: 2;">
            <li>Our team will contact you within 24 hours</li>
            <li>We'll schedule a kickoff call to discuss your project</li>
            <li>Work begins immediately after our initial meeting</li>
          </ol>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
          <a href="https://t.me/royalsolutions_ai" style="background: #bbb; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold;">CONTACT US ON TELEGRAM</a>
        </p>
        
        <div class="footer">
          <p>RoyAISolutions | roryulloa@gmail.com | (346) 298-5038</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePaymentAdminEmail(data: ProposalEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #4caf50; }
        .alert { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; }
        .amount { font-size: 36px; color: #4caf50; font-weight: bold; }
        .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💰 Payment Received!</h1>
        
        <div class="alert">
          <div class="amount">$${((data.paymentAmount || 0) / 100).toLocaleString()}</div>
          <p>${data.paymentType === 'deposit' ? '50% Deposit' : 'Full Payment'} for ${data.proposalNumber}</p>
        </div>
        
        <div class="section">
          <h3>Client Details</h3>
          <p><strong>Name:</strong> ${data.clientName}</p>
          <p><strong>Email:</strong> ${data.clientEmail}</p>
          <p><strong>Company:</strong> ${data.companyName}</p>
        </div>
        
        <div class="section">
          <h3>Services Purchased</h3>
          <ul>
            ${data.services.map(s => `<li>${s.label} - $${s.price.toLocaleString()}${s.period || ''}</li>`).join('')}
          </ul>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          <strong>Action Required:</strong> Contact the client within 24 hours to schedule a kickoff call.
        </p>
      </div>
    </body>
    </html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ProposalEmailData = await req.json();
    
    console.log('Sending email notification:', data.type, data.proposalNumber);

    let html: string;
    let subject: string;
    let to: string;

    switch (data.type) {
      case 'proposal_client':
        html = generateProposalClientEmail(data);
        subject = `Your RoyAISolutions Proposal is Ready - ${data.proposalNumber}`;
        to = data.clientEmail;
        break;
      case 'proposal_admin':
        html = generateProposalAdminEmail(data);
        subject = `🎉 New Proposal: ${data.proposalNumber} - ${data.companyName}`;
        to = ADMIN_EMAIL;
        break;
      case 'payment_client':
        html = generatePaymentClientEmail(data);
        subject = `Payment Confirmed - ${data.proposalNumber}`;
        to = data.clientEmail;
        break;
      case 'payment_admin':
        html = generatePaymentAdminEmail(data);
        subject = `💰 Payment Received: $${((data.paymentAmount || 0) / 100).toLocaleString()} - ${data.proposalNumber}`;
        to = ADMIN_EMAIL;
        break;
      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
