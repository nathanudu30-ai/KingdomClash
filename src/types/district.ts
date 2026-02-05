// Building types
export interface Building {
  id: string;
  type: BuildingType;
  name: string;
  emoji: string;
  level: number;
  maxLevel: number;
}

export type BuildingType = 'hq' | 'bank' | 'factory' | 'tower';

export interface BuildingConfig {
  type: BuildingType;
  name: string;
  emoji: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number; // Cost = baseCost * (costMultiplier ^ level)
}

// Building configurations
export const BUILDING_CONFIGS: Record<BuildingType, BuildingConfig> = {
  hq: {
    type: 'hq',
    name: 'QG',
    emoji: '🏢',
    maxLevel: 5,
    baseCost: 5000,
    costMultiplier: 2.5,
  },
  bank: {
    type: 'bank',
    name: 'Banque',
    emoji: '🏦',
    maxLevel: 5,
    baseCost: 3000,
    costMultiplier: 2.5,
  },
  factory: {
    type: 'factory',
    name: 'Usine',
    emoji: '🏭',
    maxLevel: 5,
    baseCost: 4000,
    costMultiplier: 2.5,
  },
  tower: {
    type: 'tower',
    name: 'Tour',
    emoji: '🗼',
    maxLevel: 5,
    baseCost: 6000,
    costMultiplier: 2.5,
  },
};

// Calculate upgrade cost for a building
export function getUpgradeCost(config: BuildingConfig, currentLevel: number): number {
  if (currentLevel >= config.maxLevel) return 0;
  return Math.floor(config.baseCost * Math.pow(config.costMultiplier, currentLevel));
}

// District types
export interface District {
  id: number;
  name: string;
  theme: DistrictTheme;
  buildings: Building[];
  requiredLevel: number;
}

export type DistrictTheme =
  | 'street'
  | 'market'
  | 'industrial'
  | 'downtown'
  | 'business'
  | 'harbor'
  | 'tech'
  | 'luxury'
  | 'sky';

export interface DistrictConfig {
  id: number;
  name: string;
  theme: DistrictTheme;
  requiredLevel: number;
}

// District configurations (15-20 districts at launch)
export const DISTRICT_CONFIGS: DistrictConfig[] = [
  { id: 1, name: 'Coin des Rues', theme: 'street', requiredLevel: 0 },
  { id: 2, name: 'Marché Central', theme: 'market', requiredLevel: 1 },
  { id: 3, name: 'Zone Industrielle', theme: 'industrial', requiredLevel: 2 },
  { id: 4, name: 'Centre-Ville', theme: 'downtown', requiredLevel: 3 },
  { id: 5, name: 'Quartier des Affaires', theme: 'business', requiredLevel: 4 },
  { id: 6, name: 'Le Port', theme: 'harbor', requiredLevel: 5 },
  { id: 7, name: 'Tech Valley', theme: 'tech', requiredLevel: 6 },
  { id: 8, name: 'Quartier Luxe', theme: 'luxury', requiredLevel: 7 },
  { id: 9, name: 'Les Hauteurs', theme: 'sky', requiredLevel: 8 },
  { id: 10, name: 'Vieux Quartier', theme: 'street', requiredLevel: 9 },
  { id: 11, name: 'Place du Commerce', theme: 'market', requiredLevel: 10 },
  { id: 12, name: 'Usines Nord', theme: 'industrial', requiredLevel: 11 },
  { id: 13, name: 'Downtown Est', theme: 'downtown', requiredLevel: 12 },
  { id: 14, name: 'Financial District', theme: 'business', requiredLevel: 13 },
  { id: 15, name: 'Marina', theme: 'harbor', requiredLevel: 14 },
];

// Create initial buildings for a district
export function createDistrictBuildings(districtId: number): Building[] {
  const buildingTypes: BuildingType[] = ['hq', 'bank', 'factory', 'tower'];

  return buildingTypes.map((type) => {
    const config = BUILDING_CONFIGS[type];
    return {
      id: `${districtId}-${type}`,
      type,
      name: config.name,
      emoji: config.emoji,
      level: 0,
      maxLevel: config.maxLevel,
    };
  });
}

// Check if a district is complete
export function isDistrictComplete(buildings: Building[]): boolean {
  return buildings.every((b) => b.level >= b.maxLevel);
}

// Calculate district progress (0 to 1)
export function getDistrictProgress(buildings: Building[]): number {
  const totalLevels = buildings.reduce((acc, b) => acc + b.maxLevel, 0);
  const currentLevels = buildings.reduce((acc, b) => acc + b.level, 0);
  return totalLevels > 0 ? currentLevels / totalLevels : 0;
}

// Get total coins needed to complete a district from scratch
export function getDistrictTotalCost(buildings: Building[]): number {
  let total = 0;
  for (const building of buildings) {
    const config = BUILDING_CONFIGS[building.type];
    for (let level = building.level; level < building.maxLevel; level++) {
      total += getUpgradeCost(config, level);
    }
  }
  return total;
}
