-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    
    -- Profile
    avatar_url TEXT,
    title TEXT,
    
    -- Timestamps
    last_spin_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_daily_bonus_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_players_username ON public.players(username);

-- Enable Row Level Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own player data"
    ON public.players
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own player data"
    ON public.players
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Policy: Users can insert their own player data
CREATE POLICY "Users can insert own player data"
    ON public.players
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_players_updated_at
    BEFORE UPDATE ON public.players
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create player_stats table for tracking statistics
CREATE TABLE IF NOT EXISTS public.player_stats (
    player_id UUID PRIMARY KEY REFERENCES public.players(id) ON DELETE CASCADE,
    
    -- Core resources
    coins BIGINT DEFAULT 10000 CHECK (coins >= 0),
    spins INTEGER DEFAULT 50 CHECK (spins >= 0),
    shields INTEGER DEFAULT 0 CHECK (shields >= 0),
    attack_multiplier INTEGER DEFAULT 1 CHECK (attack_multiplier >= 1),
    
    -- Progression statistics
    districts_completed INTEGER DEFAULT 0 CHECK (districts_completed >= 0),
    total_attacks INTEGER DEFAULT 0 CHECK (total_attacks >= 0),
    total_raids INTEGER DEFAULT 0 CHECK (total_raids >= 0),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on player_stats
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
    ON public.player_stats
    FOR SELECT
    USING (auth.uid()::text = player_id::text);

CREATE POLICY "Users can update own stats"
    ON public.player_stats
    FOR UPDATE
    USING (auth.uid()::text = player_id::text);

CREATE POLICY "Users can insert own stats"
    ON public.player_stats
    FOR INSERT
    WITH CHECK (auth.uid()::text = player_id::text);

-- Trigger for player_stats updated_at
CREATE TRIGGER update_player_stats_updated_at
    BEFORE UPDATE ON public.player_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create player_stats when a new player is created
CREATE OR REPLACE FUNCTION create_player_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.player_stats (player_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create player_stats
CREATE TRIGGER create_player_stats_on_player_creation
    AFTER INSERT ON public.players
    FOR EACH ROW
    EXECUTE FUNCTION create_player_stats();

-- Create spin_history table for tracking all spins
CREATE TABLE IF NOT EXISTS public.spin_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    
    -- Spin details
    result JSONB NOT NULL,
    coins_won BIGINT DEFAULT 0 CHECK (coins_won >= 0),
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_spin_history_player_id ON public.spin_history(player_id);
CREATE INDEX IF NOT EXISTS idx_spin_history_created_at ON public.spin_history(created_at DESC);

-- Enable RLS on spin_history
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spin history"
    ON public.spin_history
    FOR SELECT
    USING (auth.uid()::text = player_id::text);

CREATE POLICY "Users can insert own spin history"
    ON public.spin_history
    FOR INSERT
    WITH CHECK (auth.uid()::text = player_id::text);

-- Insert a demo player for testing (optional, can be removed in production)
INSERT INTO public.players (id, username)
VALUES (
    gen_random_uuid(),
    'DemoPlayer'
) ON CONFLICT (username) DO NOTHING;
