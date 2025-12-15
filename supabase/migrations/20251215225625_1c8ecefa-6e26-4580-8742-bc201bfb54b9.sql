-- Replace email column with telegram in leads table
ALTER TABLE public.leads DROP COLUMN email;
ALTER TABLE public.leads ADD COLUMN telegram text NOT NULL DEFAULT '';