-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view testimonials
CREATE POLICY "Anyone can view testimonials"
ON public.testimonials
FOR SELECT
USING (true);

-- Authenticated users can create their own testimonials
CREATE POLICY "Authenticated users can create testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own testimonials
CREATE POLICY "Users can update own testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own testimonials
CREATE POLICY "Users can delete own testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);