export interface Player {
  id: string;
  username: string;
  email: string;
  level: number;
  coins: number;
  gems: number;
  spins: number;
  max_spins: number;
  shields: number;
  current_district: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_spin_at?: string;
}

export interface PlayerStats {
  total_spins: number;
  total_coins_earned: number;
  total_attacks: number;
  total_raids: number;
  districts_completed: number;
  cards_collected: number;
}

export interface PlayerResource {
  coins: number;
  gems: number;
  spins: number;
  shields: number;
}
