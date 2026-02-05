export type SlotSymbol = '💰' | '⚔️' | '🎯' | '🛡️' | '⚡' | '🌟';

export interface SlotResult {
  symbols: [SlotSymbol, SlotSymbol, SlotSymbol];
  multiplier: number;
  coinsWon: number;
  isWin: boolean;
  winType: 'none' | 'small' | 'big' | 'jackpot';
}

export interface SpinConfig {
  betMultiplier: 1 | 2 | 5;
  spinCost: 1 | 3 | 10;
  bonusPercentage: number;
}

export interface SlotMachineState {
  isSpinning: boolean;
  currentSymbols: [SlotSymbol, SlotSymbol, SlotSymbol];
  lastResult: SlotResult | null;
  autoSpinCount: number;
  autoSpinActive: boolean;
}

export const SLOT_SYMBOLS: SlotSymbol[] = ['💰', '⚔️', '🎯', '🛡️', '⚡', '🌟'];

export const SYMBOL_WEIGHTS: Record<SlotSymbol, number> = {
  '💰': 30, // Coins - 30%
  '⚔️': 15, // Attack - 15%
  '🎯': 15, // Raid - 15%
  '🛡️': 20, // Shield - 20%
  '⚡': 15, // Energy - 15%
  '🌟': 5,  // Wildcard - 5%
};
