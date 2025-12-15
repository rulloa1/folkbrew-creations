-- Create table for Telegram chat logs
CREATE TABLE public.telegram_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  user_name TEXT,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.telegram_chats ENABLE ROW LEVEL SECURITY;

-- Only admins can view chat logs
CREATE POLICY "Only admins can view chat logs"
ON public.telegram_chats
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups by chat_id
CREATE INDEX idx_telegram_chats_chat_id ON public.telegram_chats(chat_id);
CREATE INDEX idx_telegram_chats_created_at ON public.telegram_chats(created_at DESC);