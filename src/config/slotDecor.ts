const defaultBackground =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';

export const slotDecor = {
  // Remplace par tes propres URLs (Supabase Storage, CDN, etc.).
  backgrounds: [
    defaultBackground,
    defaultBackground,
    defaultBackground,
  ],
  machineFrame:
    'https://images.unsplash.com/photo-1614853035986-d90a8b8f0e8f?auto=format&fit=crop&w=900&q=80',
  spinButton:
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=500&q=80',
} as const;
