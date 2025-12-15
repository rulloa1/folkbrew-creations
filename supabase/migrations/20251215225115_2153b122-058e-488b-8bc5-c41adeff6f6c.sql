-- Remove the public INSERT policy on leads table
-- The submit-lead edge function uses service role key to bypass RLS,
-- so this blocks direct database inserts while keeping the form working
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;