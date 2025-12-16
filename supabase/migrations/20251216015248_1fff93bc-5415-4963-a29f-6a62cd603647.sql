-- Add explicit INSERT policy to block direct inserts to leads table
-- Leads must be submitted through the submit-lead edge function which has rate limiting
CREATE POLICY "No direct inserts allowed on leads"
ON public.leads
AS RESTRICTIVE
FOR INSERT
TO public
WITH CHECK (false);