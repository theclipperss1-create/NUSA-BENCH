-- Create questions table for Wawasan Indonesia
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- e.g., 'Geografi', 'Sejarah', 'Budaya', 'Kuliner', 'Tokoh'
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of strings e.g., ["A", "B", "C", "D"]
    correct_answer TEXT NOT NULL, -- The exact string of the correct answer
    explanation TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Public can read questions
CREATE POLICY "Public can read questions" 
ON public.questions FOR SELECT 
USING (true);

-- Only admins can modify (assuming disabled for public)
-- No INSERT/UPDATE/DELETE policies means public can't modify.
