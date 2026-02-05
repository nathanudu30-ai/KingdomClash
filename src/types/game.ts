// Slot machine symbols
export type SlotSymbol =
  | 'coin'      // Coins - gives coins
  | 'attack'    // Sword - attack other players
  | 'raid'      // Bag - raid for coins
  | 'shield'    // Shield - protection
  | 'energy'    // Lightning - extra spins
  | 'bonus';    // Star - bonus round

export interface SlotResult {
  symbols: [SlotSymbol, SlotSymbol, SlotSymbol];
  isWin: boolean;
  winType: WinType | null;
  multiplier: number;
}

export type WinType =
  | 'coins'
  | 'attack'
  | 'raid'
  | 'shield'
  | 'energy'
  | 'bonus'
  | 'jackpot';

export interface SpinReward {
  type: WinType;
  amount: number;
}

// Player state
export interface Player {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface PlayerStats {
  coins: number;
  spins: number;
  shields: number;
  attackMultiplier: number;
  districtsCompleted: number;
  totalAttacks: number;
  totalRaids: number;
}

// Level is computed from districtsCompleted (like Coin Master)
export function getPlayerLevel(districtsCompleted: number): number {
  return districtsCompleted + 1; // Level 1 = 0 districts, Level 2 = 1 district, etc.
}

// District/Village
export interface District {
  id: number;
  name: string;
  theme: string;
  buildings: Building[];
  requiredLevel: number;
}

export interface Building {
  id: number;
  name: string;
  cost: number;
  currentLevel: number;
  maxLevel: number;
  imageUrl: string;
}

// Attack/Raid targets
export interface AttackTarget {
  playerId: string;
  username: string;
  avatarUrl: string | null;
  currentDistrict: number;
  hasShield: boolean;
}

export interface RaidTarget {
  playerId: string;
  username: string;
  coinsAvailable: number;
  spots: RaidSpot[];
}

export interface RaidSpot {
  id: number;
  revealed: boolean;
  coins: number;
}

// Game events for animations
export type GameEvent =
  | { type: 'spin_start' }
  | { type: 'spin_result'; result: SlotResult }
  | { type: 'coins_won'; amount: number }
  | { type: 'attack_ready' }
  | { type: 'raid_ready' }
  | { type: 'shield_gained'; count: number }
  | { type: 'energy_gained'; spins: number }
  | { type: 'bonus_triggered' }
  | { type: 'level_up'; newLevel: number };
