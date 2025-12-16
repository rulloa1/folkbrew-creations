-- Remove the public INSERT policy from proposals table
-- Proposals will now only be created via the submit-proposal edge function with server-side validation
DROP POLICY IF EXISTS "Allow public proposal submissions" ON public.proposals;