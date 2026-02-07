export const localAssetPaths = {
  backgrounds: {
    slotCityNight: 'assets/backgrounds/bg-slot-city-night.webp',
    slotIndustrial: 'assets/backgrounds/bg-slot-industrial.webp',
    villageDawn: 'assets/backgrounds/bg-village-dawn.webp',
  },
  machine: {
    frameNeon: 'assets/machine/machine-frame-neon.webp',
    spinButtonGradient: 'assets/machine/spin-button-gradient.webp',
    sideLight: 'assets/machine/machine-side-light.webp',
  },
  tokens: {
    bronze: 'assets/tokens/token-bronze.webp',
    silver: 'assets/tokens/token-silver.webp',
    gold: 'assets/tokens/token-gold.webp',
    premium: 'assets/tokens/token-premium.webp',
  },
} as const;

/**
 * Optionnel: quand les fichiers existent, remplace cette map par des `require(...)` statiques
 * pour un usage direct dans les composants React Native.
 */
export const localAssetRequires = {
  // backgrounds: {
  //   slotCityNight: require('../../assets/backgrounds/bg-slot-city-night.webp'),
  // },
};
