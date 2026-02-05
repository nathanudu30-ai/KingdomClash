// Item types
export type ItemType =
  | 'shield'
  | 'boost_coins'
  | 'boost_spins'
  | 'chest_small'
  | 'chest_medium'
  | 'chest_large'
  | 'event_key'
  | 'event_ticket';

export interface ItemConfig {
  type: ItemType;
  name: string;
  emoji: string;
  description: string;
  rarity: ItemRarity;
  stackable: boolean;
  maxStack: number;
  usable: boolean;
  expiresAfterHours?: number; // For temporary boosts
}

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface InventoryItem {
  id: string;
  type: ItemType;
  quantity: number;
  obtainedAt: string;
  expiresAt?: string;
}

// Item configurations
export const ITEM_CONFIGS: Record<ItemType, ItemConfig> = {
  shield: {
    type: 'shield',
    name: 'Bouclier',
    emoji: '🛡️',
    description: 'Protège contre une attaque',
    rarity: 'common',
    stackable: true,
    maxStack: 10,
    usable: false, // Auto-used when attacked
  },
  boost_coins: {
    type: 'boost_coins',
    name: 'Double Coins',
    emoji: '💰',
    description: 'Double les gains de coins pendant 2h',
    rarity: 'rare',
    stackable: true,
    maxStack: 5,
    usable: true,
    expiresAfterHours: 2,
  },
  boost_spins: {
    type: 'boost_spins',
    name: 'Spin Rapide',
    emoji: '⚡',
    description: 'Spins plus rapides pendant 30min',
    rarity: 'rare',
    stackable: true,
    maxStack: 5,
    usable: true,
    expiresAfterHours: 0.5,
  },
  chest_small: {
    type: 'chest_small',
    name: 'Petit Coffre',
    emoji: '📦',
    description: 'Contient 1 carte aléatoire',
    rarity: 'common',
    stackable: true,
    maxStack: 99,
    usable: true,
  },
  chest_medium: {
    type: 'chest_medium',
    name: 'Coffre Moyen',
    emoji: '🎁',
    description: 'Contient 5 cartes (1 rare garantie)',
    rarity: 'rare',
    stackable: true,
    maxStack: 99,
    usable: true,
  },
  chest_large: {
    type: 'chest_large',
    name: 'Grand Coffre',
    emoji: '👑',
    description: 'Contient 25 cartes (1 épique garantie)',
    rarity: 'epic',
    stackable: true,
    maxStack: 99,
    usable: true,
  },
  event_key: {
    type: 'event_key',
    name: 'Clé Événement',
    emoji: '🔑',
    description: 'Débloque un coffre événement',
    rarity: 'epic',
    stackable: true,
    maxStack: 10,
    usable: true,
  },
  event_ticket: {
    type: 'event_ticket',
    name: 'Ticket Spécial',
    emoji: '🎟️',
    description: 'Participe à un événement spécial',
    rarity: 'legendary',
    stackable: true,
    maxStack: 5,
    usable: true,
  },
};

// Get rarity color
export function getRarityColor(rarity: ItemRarity): string {
  switch (rarity) {
    case 'common': return '#9CA3AF'; // gray
    case 'rare': return '#3B82F6'; // blue
    case 'epic': return '#8B5CF6'; // purple
    case 'legendary': return '#F59E0B'; // gold
  }
}

// Check if item is expired
export function isItemExpired(item: InventoryItem): boolean {
  if (!item.expiresAt) return false;
  return new Date(item.expiresAt) < new Date();
}
