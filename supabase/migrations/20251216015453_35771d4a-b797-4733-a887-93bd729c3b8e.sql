-- Add explicit restrictive INSERT/DELETE policies to tables managed by edge functions
-- These tables should only be modified via edge functions using service role

-- Payments: Only edge functions can insert (via verify-payment), no deletes allowed
CREATE POLICY "No direct inserts on payments"
ON public.payments
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "No deletes on payments"
ON public.payments
AS RESTRICTIVE
FOR DELETE
TO public
USING (false);

-- Proposals: Only edge functions can insert (via submit-proposal), no deletes allowed  
CREATE POLICY "No direct inserts on proposals"
ON public.proposals
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "No deletes on proposals"
ON public.proposals
AS RESTRICTIVE
FOR DELETE
TO public
USING (false);

-- Telegram chats: Only edge functions can insert (via telegram-bot), no updates/deletes
CREATE POLICY "No direct inserts on telegram_chats"
ON public.telegram_chats
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "No updates on telegram_chats"
ON public.telegram_chats
AS RESTRICTIVE
FOR UPDATE
TO public
USING (false);

CREATE POLICY "No deletes on telegram_chats"
ON public.telegram_chats
AS RESTRICTIVE
FOR DELETE
TO public
USING (false);