import { localAssetPaths, localAssetRequires } from '@/config/localAssets';

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const pickWeeklyBackground = () => {
  const weeklyIndex = Math.floor(Date.now() / MS_PER_WEEK) % localAssetRequires.backgrounds.length;
  return localAssetRequires.backgrounds[weeklyIndex];
};

export const slotDecor = {
  backgrounds: localAssetRequires.backgrounds,
  getWeeklyBackground: pickWeeklyBackground,
  machineFrame: localAssetRequires.machine.frameNeon,
  localFolders: localAssetPaths,
} as const;
