-- Add new columns to leads table
ALTER TABLE public.leads 
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN phone text,
ADD COLUMN company text,
ADD COLUMN budget text;

-- Migrate existing data: split name into first_name, last_name
UPDATE public.leads 
SET first_name = SPLIT_PART(name, ' ', 1),
    last_name = CASE 
      WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
      ELSE ''
    END;

-- Make new columns required
ALTER TABLE public.leads 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL,
ALTER COLUMN phone SET NOT NULL,
ALTER COLUMN company SET NOT NULL,
ALTER COLUMN budget SET NOT NULL;

-- Rename message column to needs
ALTER TABLE public.leads RENAME COLUMN message TO needs;

-- Drop the old name column
ALTER TABLE public.leads DROP COLUMN name;