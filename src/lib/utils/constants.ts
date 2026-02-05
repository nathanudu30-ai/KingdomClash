// Spin et énergie
export const MAX_SPINS = 50;
export const SPIN_RECHARGE_TIME_MINUTES = 30;
export const SPINS_PER_RECHARGE = 1;

// Économie de base
export const BASE_COIN_REWARD = 500;
export const DAILY_BONUS_SPINS = 20;
export const HOURLY_BONUS_SPINS = 10;

// Multiplicateurs de pari
export const BET_CONFIGS = {
  x1: { multiplier: 1, cost: 1, bonus: 0 },
  x2: { multiplier: 2, cost: 3, bonus: 0.2 },
  x5: { multiplier: 5, cost: 10, bonus: 0.33 },
} as const;

// Récompenses du slot
export const WIN_MULTIPLIERS = {
  two_match: 2,
  three_match: 5,
  jackpot: 100,
} as const;

// Construction
export const BUILDING_TYPES = ['hq', 'bank', 'factory', 'tower'] as const;
export const MAX_BUILDING_LEVEL = 5;
export const BUILDINGS_PER_DISTRICT = 4;

// Progression
export const DISTRICT_COMPLETION_REWARDS = {
  coins: 50000,
  gems: 5,
  spins: 10,
};

// PvP
export const ATTACK_STEAL_PERCENTAGE = { min: 0.1, max: 0.3 };
export const RAID_DIGS = 3;
export const REVENGE_DURATION_HOURS = 24;

// Social
export const MAX_GUILD_MEMBERS = 50;
export const DAILY_DONATION_LIMIT = 5;
export const DONATION_AMOUNTS = {
  spins: 5,
  coins: 10000,
};
