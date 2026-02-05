// Attack target
export interface AttackTarget {
  id: string;
  playerId: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  districtsCompleted: number;
  coins: number;
  hasShield: boolean;
}

// Attack result
export interface AttackResult {
  success: boolean;
  coinsStolen: number;
  shieldBlocked: boolean;
  target: AttackTarget;
  timestamp: string;
}

// Raid spot in the mini-game
export interface RaidSpot {
  id: number;
  revealed: boolean;
  coins: number;
}

// Raid result
export interface RaidResult {
  success: boolean;
  totalCoins: number;
  spotsRevealed: RaidSpot[];
  target: AttackTarget;
  timestamp: string;
}

// Revenge entry
export interface RevengeEntry {
  id: string;
  attackerId: string;
  attackerUsername: string;
  attackerAvatarUrl: string | null;
  attackerLevel: number;
  coinsLost: number;
  attackType: 'attack' | 'raid';
  timestamp: string;
  expiresAt: string; // 24h after attack
  revenged: boolean;
}

// PvP action type from slot machine
export type PvpActionType = 'attack' | 'raid';

// PvP state
export interface PvpState {
  attacksAvailable: number;
  raidsAvailable: number;
  currentTargets: AttackTarget[];
  targetPoolExpiresAt: string | null;
  revengeList: RevengeEntry[];
}

// Generate mock targets for demo
export function generateMockTargets(): AttackTarget[] {
  const names = [
    'DragonSlayer', 'CoinMaster', 'RaidKing', 'GoldHunter',
    'ShadowBlade', 'ThunderBolt', 'IceQueen', 'FireLord',
  ];

  return Array.from({ length: 3 }, (_, i) => ({
    id: `target-${i + 1}`,
    playerId: `player-${Math.random().toString(36).slice(2, 10)}`,
    username: names[Math.floor(Math.random() * names.length)],
    avatarUrl: null,
    level: Math.floor(Math.random() * 10) + 1,
    districtsCompleted: Math.floor(Math.random() * 5),
    coins: Math.floor(Math.random() * 500000) + 10000,
    hasShield: Math.random() > 0.7,
  }));
}

// Calculate coins stolen (10-30% of target's coins)
export function calculateStolenCoins(targetCoins: number): number {
  const percentage = 0.1 + Math.random() * 0.2; // 10-30%
  return Math.floor(targetCoins * percentage);
}

// Generate raid spots
export function generateRaidSpots(): RaidSpot[] {
  const coinAmounts = [
    0, 0, 0,           // 3 empty spots
    500, 1000, 1500,   // Small rewards
    2500, 5000,        // Medium rewards
    10000,             // Big reward
  ];

  // Shuffle
  const shuffled = coinAmounts.sort(() => Math.random() - 0.5);

  return shuffled.map((coins, index) => ({
    id: index,
    revealed: false,
    coins,
  }));
}

// Check if revenge is expired
export function isRevengeExpired(entry: RevengeEntry): boolean {
  return new Date(entry.expiresAt) < new Date();
}

// Format time remaining for revenge
export function getRevengeTimeRemaining(entry: RevengeEntry): string {
  const now = new Date();
  const expires = new Date(entry.expiresAt);
  const diffMs = expires.getTime() - now.getTime();

  if (diffMs <= 0) return 'Expiré';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
