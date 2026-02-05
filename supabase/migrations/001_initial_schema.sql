-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    
    -- Resources
    coins BIGINT DEFAULT 10000 CHECK (coins >= 0),
    gems INTEGER DEFAULT 0 CHECK (gems >= 0),
    spins INTEGER DEFAULT 50 CHECK (spins >= 0),
    max_spins INTEGER DEFAULT 50 CHECK (max_spins > 0),
    shields INTEGER DEFAULT 0 CHECK (shields >= 0),
    
    -- Progression
    level INTEGER DEFAULT 1 CHECK (level > 0),
    xp BIGINT DEFAULT 0 CHECK (xp >= 0),
    current_district INTEGER DEFAULT 1 CHECK (current_district > 0),
    
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
CREATE INDEX IF NOT EXISTS idx_players_email ON public.players(email);
CREATE INDEX IF NOT EXISTS idx_players_username ON public.players(username);
CREATE INDEX IF NOT EXISTS idx_players_level ON public.players(level);

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
    
    -- Spin statistics
    total_spins INTEGER DEFAULT 0 CHECK (total_spins >= 0),
    total_coins_earned BIGINT DEFAULT 0 CHECK (total_coins_earned >= 0),
    total_coins_spent BIGINT DEFAULT 0 CHECK (total_coins_spent >= 0),
    biggest_win BIGINT DEFAULT 0 CHECK (biggest_win >= 0),
    
    -- Combat statistics
    total_attacks INTEGER DEFAULT 0 CHECK (total_attacks >= 0),
    successful_attacks INTEGER DEFAULT 0 CHECK (successful_attacks >= 0),
    total_raids INTEGER DEFAULT 0 CHECK (total_raids >= 0),
    successful_raids INTEGER DEFAULT 0 CHECK (successful_raids >= 0),
    revenges_taken INTEGER DEFAULT 0 CHECK (revenges_taken >= 0),
    
    -- Construction statistics
    districts_completed INTEGER DEFAULT 0 CHECK (districts_completed >= 0),
    buildings_upgraded INTEGER DEFAULT 0 CHECK (buildings_upgraded >= 0),
    
    -- Collection statistics
    cards_collected INTEGER DEFAULT 0 CHECK (cards_collected >= 0),
    sets_completed INTEGER DEFAULT 0 CHECK (sets_completed >= 0),
    
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
    symbols JSONB NOT NULL, -- Array of 3 symbols
    bet_multiplier INTEGER NOT NULL CHECK (bet_multiplier IN (1, 2, 5)),
    coins_won BIGINT DEFAULT 0 CHECK (coins_won >= 0),
    is_win BOOLEAN DEFAULT FALSE,
    win_type TEXT CHECK (win_type IN ('none', 'small', 'big', 'jackpot')),
    
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

-- Insert a demo player for testing (optional, can be removed in production)
INSERT INTO public.players (id, email, username, coins, gems, spins, level, current_district)
VALUES (
    gen_random_uuid(),
    'demo@kingdomclash.com',
    'DemoPlayer',
    1250000,
    150,
    42,
    12,
    3
) ON CONFLICT (email) DO NOTHING;
