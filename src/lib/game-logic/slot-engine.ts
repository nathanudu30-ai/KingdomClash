import type { SlotSymbol, SlotResult, WinType, SpinReward } from '@/types/game';

// Symbol weights (probability distribution)
const SYMBOL_WEIGHTS: Record<SlotSymbol, number> = {
  coin: 30,    // 30% - most common
  attack: 20,  // 20%
  raid: 15,    // 15%
  shield: 15,  // 15%
  energy: 15,  // 15%
  bonus: 5,    // 5% - rarest
};

const ALL_SYMBOLS: SlotSymbol[] = ['coin', 'attack', 'raid', 'shield', 'energy', 'bonus'];

// Generate weighted random symbol
function getRandomSymbol(): SlotSymbol {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const symbol of ALL_SYMBOLS) {
    random -= SYMBOL_WEIGHTS[symbol];
    if (random <= 0) {
      return symbol;
    }
  }

  return 'coin'; // Fallback
}

// Check if three symbols match
function checkWin(symbols: [SlotSymbol, SlotSymbol, SlotSymbol]): {
  isWin: boolean;
  winType: WinType | null;
  multiplier: number;
} {
  const [a, b, c] = symbols;

  // Three of a kind - jackpot multiplier
  if (a === b && b === c) {
    return {
      isWin: true,
      winType: a === 'bonus' ? 'jackpot' : a,
      multiplier: a === 'bonus' ? 10 : 3,
    };
  }

  // Two of a kind - base win
  if (a === b || b === c || a === c) {
    const winningSymbol = a === b ? a : c;
    return {
      isWin: true,
      winType: winningSymbol,
      multiplier: 1,
    };
  }

  // No match
  return {
    isWin: false,
    winType: null,
    multiplier: 0,
  };
}

// Main spin function
export function spin(): SlotResult {
  const symbols: [SlotSymbol, SlotSymbol, SlotSymbol] = [
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ];

  const { isWin, winType, multiplier } = checkWin(symbols);

  return {
    symbols,
    isWin,
    winType,
    multiplier,
  };
}

// Calculate rewards based on spin result
type BetBonus = {
  extraSpins: number;
  rewardBoost: number;
};

const BET_BONUSES: Record<number, BetBonus> = {
  1: { extraSpins: 0, rewardBoost: 0 },
  2: { extraSpins: 3, rewardBoost: 0.2 },
  5: { extraSpins: 10, rewardBoost: 0.33 },
};

function getBetBonus(betAmount: number): BetBonus {
  return BET_BONUSES[betAmount] ?? BET_BONUSES[1];
}

export function calculateReward(
  result: SlotResult,
  betAmount: number,
  attackMultiplier: number = 1
): SpinReward | null {
  if (!result.isWin || !result.winType) {
    return null;
  }

  const baseAmount = betAmount * result.multiplier;
  const betBonus = getBetBonus(betAmount);
  const rewardMultiplier = 1 + betBonus.rewardBoost;

  switch (result.winType) {
    case 'coins':
      return { type: 'coins', amount: Math.round(baseAmount * 100 * rewardMultiplier) };

    case 'attack':
      return { type: 'attack', amount: Math.ceil(attackMultiplier) };

    case 'raid':
      return { type: 'raid', amount: 1 };

    case 'shield':
      return { type: 'shield', amount: Math.ceil(result.multiplier * rewardMultiplier) };

    case 'energy':
      return {
        type: 'energy',
        amount: Math.ceil(result.multiplier * 5 * rewardMultiplier) + betBonus.extraSpins,
      };

    case 'bonus':
      return { type: 'bonus', amount: betBonus.extraSpins || 1 };

    case 'jackpot':
      return { type: 'jackpot', amount: Math.round(baseAmount * 1000 * rewardMultiplier) };

    default:
      return null;
  }
}

// Generate fake reel strips for animation (visual only, result is predetermined)
export function generateReelStrip(finalSymbol: SlotSymbol, length: number = 20): SlotSymbol[] {
  const strip: SlotSymbol[] = [];

  for (let i = 0; i < length - 1; i++) {
    strip.push(getRandomSymbol());
  }

  // Final symbol is the actual result
  strip.push(finalSymbol);

  return strip;
}

// Get symbol display info
export function getSymbolInfo(symbol: SlotSymbol): {
  name: string;
  emoji: string;
  color: string;
} {
  switch (symbol) {
    case 'coin':
      return { name: 'Coins', emoji: '🪙', color: '#FFD700' };
    case 'attack':
      return { name: 'Attack', emoji: '⚔️', color: '#EF4444' };
    case 'raid':
      return { name: 'Raid', emoji: '💰', color: '#8B5CF6' };
    case 'shield':
      return { name: 'Shield', emoji: '🛡️', color: '#3B82F6' };
    case 'energy':
      return { name: 'Energy', emoji: '⚡', color: '#F59E0B' };
    case 'bonus':
      return { name: 'Bonus', emoji: '⭐', color: '#EC4899' };
  }
}
