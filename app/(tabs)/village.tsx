import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button, ProgressBar, CoinDisplay } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { useDistrict } from '@/hooks';

export default function VillageScreen() {
  const { stats } = useAuth();
  const {
    districtId,
    districtConfig,
    buildings,
    progress,
    isUpgrading,
    getUpgradeCostForBuilding,
    canAffordUpgrade,
    upgradeBuilding,
  } = useDistrict();

  const playerCoins = stats?.coins ?? 10000;

  // Calculate total levels for display
  const totalLevels = buildings.reduce((acc, b) => acc + b.maxLevel, 0);
  const currentLevels = buildings.reduce((acc, b) => acc + b.level, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.districtLabel}>District {districtId}</Text>
          <Text style={styles.districtName}>{districtConfig?.name ?? 'District'}</Text>
        </View>
        <CoinDisplay amount={playerCoins} size="md" />
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progression du district</Text>
          <Text style={styles.progressValue}>{currentLevels}/{totalLevels}</Text>
        </View>
        <ProgressBar progress={progress} height={12} />
      </View>

      {/* Buildings Grid */}
      <ScrollView style={styles.buildingsContainer}>
        <View style={styles.buildingsGrid}>
          {buildings.map((building) => {
            const cost = getUpgradeCostForBuilding(building);
            const canUpgrade = canAffordUpgrade(building);
            const isMaxed = building.level >= building.maxLevel;

            return (
              <BuildingCard
                key={building.id}
                emoji={building.emoji}
                name={building.name}
                level={building.level}
                maxLevel={building.maxLevel}
                cost={cost}
                canUpgrade={canUpgrade}
                isMaxed={isMaxed}
                isUpgrading={isUpgrading}
                onUpgrade={() => upgradeBuilding(building.id)}
              />
            );
          })}
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Comment progresser</Text>
          <Text style={styles.infoText}>
            Améliorez tous les bâtiments au niveau maximum pour débloquer le prochain district!
            Gagnez des coins en jouant au slot machine.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

interface BuildingCardProps {
  emoji: string;
  name: string;
  level: number;
  maxLevel: number;
  cost: number;
  canUpgrade: boolean;
  isMaxed: boolean;
  isUpgrading: boolean;
  onUpgrade: () => void;
}

function BuildingCard({
  emoji,
  name,
  level,
  maxLevel,
  cost,
  canUpgrade,
  isMaxed,
  isUpgrading,
  onUpgrade,
}: BuildingCardProps) {
  const scale = useSharedValue(1);

  const handleUpgrade = () => {
    // Bounce animation
    scale.value = withSequence(
      withSpring(1.1, { damping: 10 }),
      withTiming(1, { duration: 200 })
    );
    onUpgrade();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.buildingCardWrapper, animatedStyle]}>
      <Card variant="elevated" style={styles.buildingCard}>
        <Text style={styles.buildingEmoji}>{emoji}</Text>
        <Text style={styles.buildingName}>{name}</Text>
        <Text style={styles.buildingLevel}>
          Niv. {level}/{maxLevel}
        </Text>
        <ProgressBar
          progress={level / maxLevel}
          height={6}
          color={isMaxed ? colors.success[500] : colors.primary[500]}
          style={styles.buildingProgress}
        />
        {!isMaxed && (
          <Button
            title={`${cost.toLocaleString()} 🪙`}
            onPress={handleUpgrade}
            size="sm"
            disabled={!canUpgrade || isUpgrading}
            loading={isUpgrading}
            style={styles.upgradeButton}
          />
        )}
        {isMaxed && <Text style={styles.maxedText}>✓ MAX</Text>}
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy[900],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  districtLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  districtName: {
    ...typography.h2,
    color: colors.white,
  },
  progressSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  progressValue: {
    ...typography.captionBold,
    color: colors.primary[400],
  },
  buildingsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  buildingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  buildingCardWrapper: {
    width: '47%',
  },
  buildingCard: {
    alignItems: 'center',
    padding: spacing.md,
  },
  buildingEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  buildingName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  buildingLevel: {
    ...typography.caption,
    color: colors.navy[400],
    marginBottom: spacing.xs,
  },
  buildingProgress: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  upgradeButton: {
    marginTop: spacing.xs,
  },
  maxedText: {
    ...typography.captionBold,
    color: colors.success[500],
    marginTop: spacing.sm,
  },
  infoCard: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.navy[300],
  },
});
