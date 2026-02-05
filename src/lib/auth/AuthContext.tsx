import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Player, PlayerStats } from '@/types/game';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  player: Player | null;
  stats: PlayerStats | null;
  isLoading: boolean;
  isGuest: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isGuest = user?.app_metadata?.provider === 'anonymous';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadPlayerData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadPlayerData(session.user.id);
        } else {
          setPlayer(null);
          setStats(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadPlayerData = async (userId: string) => {
    try {
      // Load player profile
      const { data: playerData } = await supabase
        .from('players')
        .select('*')
        .eq('id', userId)
        .single();

      if (playerData) {
        setPlayer({
          id: playerData.id,
          username: playerData.username,
          avatarUrl: playerData.avatar_url,
        });
      }

      // Load player stats
      const { data: statsData } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', userId)
        .single();

      if (statsData) {
        setStats({
          coins: statsData.coins,
          spins: statsData.spins,
          shields: statsData.shields,
          attackMultiplier: statsData.attack_multiplier,
          districtsCompleted: statsData.districts_completed,
          totalAttacks: statsData.total_attacks,
          totalRaids: statsData.total_raids,
        });
      }
    } catch (error) {
      console.error('Error loading player data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Create player profile
      await supabase.from('players').insert({
        id: data.user.id,
        username,
      });

      // Create initial stats
      await supabase.from('player_stats').insert({
        player_id: data.user.id,
        coins: 10000,
        spins: 50,
        shields: 0,
      });
    }
  };

  const signInAsGuest = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;

    if (data.user) {
      const guestUsername = `Guest_${data.user.id.slice(0, 8)}`;

      // Create player profile for guest
      await supabase.from('players').insert({
        id: data.user.id,
        username: guestUsername,
      });

      // Create initial stats with bonus for new players
      await supabase.from('player_stats').insert({
        player_id: data.user.id,
        coins: 10000,
        spins: 50,
        shields: 0,
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPlayer(null);
    setStats(null);
  };

  const refreshStats = async () => {
    if (user) {
      await loadPlayerData(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        player,
        stats,
        isLoading,
        isGuest,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut,
        refreshStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
