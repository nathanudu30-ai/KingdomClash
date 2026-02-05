export interface Building {
  id: string;
  type: 'hq' | 'bank' | 'factory' | 'tower';
  level: number;
  max_level: number;
  upgrade_cost: number;
}

export interface District {
  id: number;
  name: string;
  theme: string;
  buildings: Building[];
  total_cost: number;
  completed: boolean;
  progress_percentage: number;
}

export interface DistrictTheme {
  id: number;
  name: string;
  displayName: string;
  description: string;
  backgroundColor: string;
  accentColor: string;
}

export const DISTRICT_THEMES: DistrictTheme[] = [
  {
    id: 1,
    name: 'street-corner',
    displayName: 'Street Corner',
    description: 'A humble beginning in the urban jungle',
    backgroundColor: '#374151',
    accentColor: '#F59E0B',
  },
  {
    id: 2,
    name: 'food-market',
    displayName: 'Food Market',
    description: 'Bustling marketplace full of life',
    backgroundColor: '#065F46',
    accentColor: '#10B981',
  },
  {
    id: 3,
    name: 'downtown',
    displayName: 'Downtown',
    description: 'The heart of the city',
    backgroundColor: '#1E40AF',
    accentColor: '#3B82F6',
  },
];
