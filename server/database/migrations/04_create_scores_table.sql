-- Create scores table
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL, -- e.g., 'reaction_time', 'number_memory', 'wawasan_indonesia'
    score_value NUMERIC NOT NULL,
    additional_data JSONB DEFAULT '{}'::jsonb, -- e.g., for aim trainer { "time": 10.5, "accuracy": 95 }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Users can insert their own scores
CREATE POLICY "Users can insert own scores" 
ON public.scores FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Everyone can view scores (for leaderboards)
CREATE POLICY "Everyone can view scores" 
ON public.scores FOR SELECT 
USING (true);

-- Create index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_scores_game_type_score_value ON public.scores (game_type, score_value DESC);
