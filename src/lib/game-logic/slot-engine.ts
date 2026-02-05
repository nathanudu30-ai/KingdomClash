import { SlotSymbol, SlotResult, SLOT_SYMBOLS, SYMBOL_WEIGHTS } from '@/types/slot';
import { BASE_COIN_REWARD, WIN_MULTIPLIERS } from '../utils/constants';

/**
 * Génère un symbole aléatoire basé sur les poids définis
 */
function getRandomSymbol(): SlotSymbol {
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return symbol as SlotSymbol;
    }
  }
  
  return SLOT_SYMBOLS[0];
}

/**
 * Génère un résultat de spin aléatoire
 */
export function generateSpinResult(betMultiplier: number = 1): SlotResult {
  const symbols: [SlotSymbol, SlotSymbol, SlotSymbol] = [
    getRandomSymbol(),
    getRandomSymbol(),
    getRandomSymbol(),
  ];
  
  // Analyser le résultat
  const uniqueSymbols = new Set(symbols);
  const symbolCounts = new Map<SlotSymbol, number>();
  
  symbols.forEach(symbol => {
    symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
  });
  
  let winType: SlotResult['winType'] = 'none';
  let multiplier = 0;
  let coinsWon = 0;
  
  // 3 symboles identiques
  if (uniqueSymbols.size === 1) {
    // Wildcard (🌟) = Jackpot
    if (symbols[0] === '🌟') {
      winType = 'jackpot';
      multiplier = WIN_MULTIPLIERS.jackpot;
    } else {
      winType = 'big';
      multiplier = WIN_MULTIPLIERS.three_match;
    }
  }
  // 2 symboles identiques
  else if (uniqueSymbols.size === 2) {
    winType = 'small';
    multiplier = WIN_MULTIPLIERS.two_match;
  }
  
  // Calculer les coins gagnés
  if (multiplier > 0) {
    coinsWon = Math.floor(BASE_COIN_REWARD * multiplier * betMultiplier);
  }
  
  return {
    symbols,
    multiplier,
    coinsWon,
    isWin: coinsWon > 0,
    winType,
  };
}

/**
 * Calcule les spins disponibles en fonction de la recharge naturelle
 */
export function calculateAvailableSpins(
  currentSpins: number,
  maxSpins: number,
  lastSpinAt: Date
): number {
  if (currentSpins >= maxSpins) {
    return currentSpins;
  }
  
  const now = new Date();
  const timeDiff = now.getTime() - lastSpinAt.getTime();
  const minutesPassed = Math.floor(timeDiff / (1000 * 60));
  
  // 1 spin toutes les 30 minutes
  const spinsRecharged = Math.floor(minutesPassed / 30);
  const newTotal = Math.min(currentSpins + spinsRecharged, maxSpins);
  
  return newTotal;
}

/**
 * Vérifie si le joueur peut spinner
 */
export function canSpin(spins: number, spinCost: number): boolean {
  return spins >= spinCost;
}
