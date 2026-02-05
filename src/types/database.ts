export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      player_stats: {
        Row: {
          player_id: string;
          coins: number;
          spins: number;
          shields: number;
          attack_multiplier: number;
          districts_completed: number;
          total_attacks: number;
          total_raids: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          player_id: string;
          coins?: number;
          spins?: number;
          shields?: number;
          attack_multiplier?: number;
          districts_completed?: number;
          total_attacks?: number;
          total_raids?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          player_id?: string;
          coins?: number;
          spins?: number;
          shields?: number;
          attack_multiplier?: number;
          districts_completed?: number;
          total_attacks?: number;
          total_raids?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      spin_history: {
        Row: {
          id: string;
          player_id: string;
          result: Json;
          coins_won: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          result: Json;
          coins_won?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          result?: Json;
          coins_won?: number;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
