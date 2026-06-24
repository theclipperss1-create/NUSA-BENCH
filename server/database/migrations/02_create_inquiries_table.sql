-- Create inquiries table to store contact form submissions
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can submit an inquiry (insert)
CREATE POLICY "Anyone can submit inquiry" 
ON public.inquiries FOR INSERT 
WITH CHECK (true);

-- 2. Only authenticated admins (we will assume checking a role claim or specific users later) can view.
-- For now, disable public read access. Only service role can read it via API.
CREATE POLICY "Public cannot read inquiries" 
ON public.inquiries FOR SELECT 
USING (false);
