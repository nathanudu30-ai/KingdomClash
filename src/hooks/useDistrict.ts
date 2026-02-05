import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Building,
  BuildingType,
  BUILDING_CONFIGS,
  DISTRICT_CONFIGS,
  getUpgradeCost,
  createDistrictBuildings,
  isDistrictComplete,
  getDistrictProgress,
} from '@/types/district';
import { useAuth } from '@/lib/auth';

export function useDistrict() {
  const { stats, refreshStats } = useAuth();

  // Current district based on player progress
  const currentDistrictId = (stats?.districtsCompleted ?? 0) + 1;
  const districtConfig = DISTRICT_CONFIGS.find((d) => d.id === currentDistrictId);

  // Local buildings state (would be synced with Supabase in production)
  const [buildings, setBuildings] = useState<Building[]>(() =>
    createDistrictBuildings(currentDistrictId)
  );

  const [isUpgrading, setIsUpgrading] = useState(false);

  // Calculate progress
  const progress = useMemo(() => getDistrictProgress(buildings), [buildings]);
  const isComplete = useMemo(() => isDistrictComplete(buildings), [buildings]);

  // Get upgrade cost for a building
  const getUpgradeCostForBuilding = useCallback((building: Building): number => {
    const config = BUILDING_CONFIGS[building.type];
    return getUpgradeCost(config, building.level);
  }, []);

  // Check if player can afford upgrade
  const canAffordUpgrade = useCallback(
    (building: Building): boolean => {
      if (building.level >= building.maxLevel) return false;
      const cost = getUpgradeCostForBuilding(building);
      return (stats?.coins ?? 0) >= cost;
    },
    [stats?.coins, getUpgradeCostForBuilding]
  );

  // Upgrade a building
  const upgradeBuilding = useCallback(
    async (buildingId: string) => {
      const building = buildings.find((b) => b.id === buildingId);
      if (!building) return;

      if (building.level >= building.maxLevel) {
        Alert.alert('Niveau max', 'Ce bâtiment est déjà au niveau maximum!');
        return;
      }

      const cost = getUpgradeCostForBuilding(building);

      if ((stats?.coins ?? 0) < cost) {
        Alert.alert('Pas assez de coins', `Il vous faut ${cost.toLocaleString()} coins.`);
        return;
      }

      setIsUpgrading(true);

      try {
        // Haptic feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Update local state
        setBuildings((prev) =>
          prev.map((b) =>
            b.id === buildingId ? { ...b, level: b.level + 1 } : b
          )
        );

        // In production: Update Supabase and deduct coins
        // await supabase.rpc('upgrade_building', { building_id: buildingId });

        // Success feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Refresh stats from server
        await refreshStats();

        // Check if district is now complete
        const updatedBuildings = buildings.map((b) =>
          b.id === buildingId ? { ...b, level: b.level + 1 } : b
        );

        if (isDistrictComplete(updatedBuildings)) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            '🎉 District Complété!',
            `Félicitations! Vous avez complété ${districtConfig?.name ?? 'ce district'}!`,
            [{ text: 'Continuer', onPress: () => advanceToNextDistrict() }]
          );
        }
      } catch (error) {
        console.error('Error upgrading building:', error);
        Alert.alert('Erreur', 'Impossible de mettre à niveau le bâtiment.');
      } finally {
        setIsUpgrading(false);
      }
    },
    [buildings, stats?.coins, getUpgradeCostForBuilding, refreshStats, districtConfig]
  );

  // Advance to next district
  const advanceToNextDistrict = useCallback(() => {
    const nextDistrictId = currentDistrictId + 1;
    const nextDistrict = DISTRICT_CONFIGS.find((d) => d.id === nextDistrictId);

    if (nextDistrict) {
      // Reset buildings for new district
      setBuildings(createDistrictBuildings(nextDistrictId));

      // In production: Update player's districts_completed in Supabase
      // await supabase.from('player_stats').update({ districts_completed: nextDistrictId - 1 });

      Alert.alert(
        '🏰 Nouveau District',
        `Bienvenue à ${nextDistrict.name}!`
      );
    } else {
      Alert.alert(
        '🏆 Félicitations!',
        'Vous avez complété tous les districts disponibles!'
      );
    }
  }, [currentDistrictId]);

  return {
    districtId: currentDistrictId,
    districtConfig,
    buildings,
    progress,
    isComplete,
    isUpgrading,
    getUpgradeCostForBuilding,
    canAffordUpgrade,
    upgradeBuilding,
  };
}
