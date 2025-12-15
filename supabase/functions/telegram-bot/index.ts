import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are RoyAI, the AI sales assistant for RoyAISolutions. You're friendly, professional, and knowledgeable about our services.

## Our Services:

### 1. Foundation Package - $2,500 (One-Time)
Premium website development including:
- Custom Website Design
- Mobile-First Responsive
- SEO Optimization
- Performance Tuning
- SSL Certificate
- Contact Forms
- Analytics Integration
- 30 Days Support

### 2. Growth Engine Package - $997/month + $2,500 Setup
Complete automation and lead generation:
- Everything in Foundation Package
- AI Lead Generation
- Automated Email/SMS Campaigns
- CRM Integration
- AI Chatbot
- Advanced Analytics
- Social Media Automation
- Priority Support
- Monthly Consultation

### 3. Individual Services:
- Web Development: $2,500 one-time
- AI Automation: $997/month
- Lead Generation: $750/month

## Your Tasks:
1. Answer questions about our services clearly and helpfully
2. Qualify leads by understanding their needs
3. Encourage them to fill out the contact form at https://royaisolutions.lovable.app/#contact
4. Be concise but informative
5. Use emojis sparingly for friendliness 🚀
6. If asked about pricing, be transparent
7. For complex questions, suggest they book a consultation

## Contact Information:
- Website: https://royaisolutions.lovable.app
- Telegram: @royalsolutions_ai
- Phone: (346) 298-5038

Keep responses concise (under 300 words). Be helpful and aim to convert inquiries into leads!`;

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { first_name?: string };
  };
}

async function sendTelegramMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
    }),
  });
}

async function getAIResponse(userMessage: string, userName: string): Promise<string> {
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Customer ${userName} says: ${userMessage}` },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return "I'm experiencing high demand right now. Please try again in a moment or visit our website at https://royaisolutions.lovable.app to learn more!";
      }
      if (response.status === 402) {
        return "Thanks for reaching out! Visit our website at https://royaisolutions.lovable.app to learn about our services, or call us at (346) 298-5038.";
      }
      
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Thanks for your message! Visit https://royaisolutions.lovable.app to learn more about our services.";
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "Thanks for reaching out! I'm having a brief technical moment. Please visit https://royaisolutions.lovable.app or call (346) 298-5038 to learn about our AI automation and lead generation services!";
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const update: TelegramUpdate = await req.json();
    console.log('Received Telegram update:', JSON.stringify(update));

    if (!update.message?.text) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const chatId = update.message.chat.id;
    const userMessage = update.message.text;
    const userName = update.message.from?.first_name || 'Friend';

    console.log(`Message from ${userName}: ${userMessage}`);

    // Handle /start command
    if (userMessage === '/start') {
      const welcomeMessage = `👋 Welcome to RoyAISolutions, ${userName}!

I'm RoyAI, your AI sales assistant. I'm here to help you discover how we can automate your business and generate more leads.

🚀 *Our Services:*
• Web Development - $2,500
• AI Automation - $997/mo
• Lead Generation - $750/mo

💡 Ask me anything about our services, or type "pricing" to see our packages!

Ready to transform your business? Let's chat! 🎯`;
      
      await sendTelegramMessage(chatId, welcomeMessage);
    } else {
      // Get AI response for other messages
      const aiResponse = await getAIResponse(userMessage, userName);
      await sendTelegramMessage(chatId, aiResponse);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing Telegram update:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});