import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button, ProgressBar, CoinDisplay } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { getPlayerLevel } from '@/types/game';

// Placeholder building data for Phase 3
const BUILDINGS = [
  { id: 1, name: 'QG', emoji: '🏢', level: 1, maxLevel: 5, cost: 5000 },
  { id: 2, name: 'Banque', emoji: '🏦', level: 0, maxLevel: 5, cost: 3000 },
  { id: 3, name: 'Usine', emoji: '🏭', level: 0, maxLevel: 5, cost: 4000 },
  { id: 4, name: 'Tour', emoji: '🗼', level: 0, maxLevel: 5, cost: 6000 },
];

export default function VillageScreen() {
  const { stats } = useAuth();

  const playerStats = stats ?? {
    coins: 10000,
    spins: 50,
    shields: 0,
    attackMultiplier: 1,
    districtsCompleted: 0,
    totalAttacks: 0,
    totalRaids: 0,
  };

  const level = getPlayerLevel(playerStats.districtsCompleted);
  const districtNumber = playerStats.districtsCompleted + 1;

  // Calculate district progress
  const totalLevels = BUILDINGS.reduce((acc, b) => acc + b.maxLevel, 0);
  const currentLevels = BUILDINGS.reduce((acc, b) => acc + b.level, 0);
  const progress = currentLevels / totalLevels;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.districtLabel}>District {districtNumber}</Text>
          <Text style={styles.districtName}>Coin des Rues</Text>
        </View>
        <CoinDisplay amount={playerStats.coins} size="md" />
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
          {BUILDINGS.map((building) => (
            <Card key={building.id} variant="elevated" style={styles.buildingCard}>
              <Text style={styles.buildingEmoji}>{building.emoji}</Text>
              <Text style={styles.buildingName}>{building.name}</Text>
              <Text style={styles.buildingLevel}>
                Niv. {building.level}/{building.maxLevel}
              </Text>
              <ProgressBar
                progress={building.level / building.maxLevel}
                height={6}
                color={building.level === building.maxLevel ? colors.success[500] : colors.primary[500]}
                style={styles.buildingProgress}
              />
              {building.level < building.maxLevel && (
                <Button
                  title={`${building.cost.toLocaleString()} 🪙`}
                  onPress={() => {}}
                  size="sm"
                  disabled={playerStats.coins < building.cost}
                  style={styles.upgradeButton}
                />
              )}
              {building.level === building.maxLevel && (
                <Text style={styles.maxedText}>MAX</Text>
              )}
            </Card>
          ))}
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Comment progresser</Text>
          <Text style={styles.infoText}>
            Améliorez tous les bâtiments au niveau maximum pour débloquer le prochain district!
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
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
  buildingCard: {
    width: '47%',
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
