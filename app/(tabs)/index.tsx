import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Button, Card, CoinDisplay } from '@/components/ui';
import { SlotMachine } from '@/components/game';
import { spin, calculateReward } from '@/lib/game-logic';
import { useAuth } from '@/lib/auth';
import { getPlayerLevel } from '@/types/game';
import type { SlotResult } from '@/types/game';

export default function PlayScreen() {
  const { player, stats, refreshStats } = useAuth();
  const [currentResult, setCurrentResult] = useState<SlotResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);

  // Use auth stats or default
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

  const handleSpin = useCallback(async () => {
    if (playerStats.spins <= 0 || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    // Generate result
    const result = spin();
    setCurrentResult(result);

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [playerStats.spins, isSpinning]);

  const handleSpinComplete = useCallback(async () => {
    setIsSpinning(false);

    if (!currentResult) return;

    // Calculate reward
    const reward = calculateReward(currentResult, 1, playerStats.attackMultiplier);

    if (reward) {
      // Haptic for win
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      switch (reward.type) {
        case 'coins':
        case 'jackpot':
          setLastWin(`+${reward.amount.toLocaleString()} coins!`);
          break;
        case 'shield':
          setLastWin(`+${reward.amount} bouclier${reward.amount > 1 ? 's' : ''}!`);
          break;
        case 'energy':
          setLastWin(`+${reward.amount} spins!`);
          break;
        case 'attack':
          setLastWin('Attaque prête!');
          break;
        case 'raid':
          setLastWin('Raid prêt!');
          break;
        case 'bonus':
          setLastWin('BONUS!');
          break;
      }

      // Refresh stats from server
      await refreshStats();
    }
  }, [currentResult, playerStats.attackMultiplier, refreshStats]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Niv. {level}</Text>
        </View>
        <Text style={styles.title}>Kingdom Clash</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <CoinDisplay amount={playerStats.coins} size="lg" />
        <View style={styles.resourceItem}>
          <Text style={styles.resourceEmoji}>⚡</Text>
          <Text style={styles.resourceValue}>{playerStats.spins}</Text>
        </View>
        <View style={styles.resourceItem}>
          <Text style={styles.resourceEmoji}>🛡️</Text>
          <Text style={styles.resourceValue}>{playerStats.shields}</Text>
        </View>
      </View>

      {/* Slot Machine */}
      <View style={styles.slotContainer}>
        <Card variant="elevated" padding="lg">
          <SlotMachine
            result={currentResult}
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
          />
        </Card>

        {/* Win display */}
        {lastWin && (
          <View style={styles.winContainer}>
            <Text style={styles.winText}>{lastWin}</Text>
          </View>
        )}
      </View>

      {/* Spin Button */}
      <View style={styles.footer}>
        <Button
          title={isSpinning ? 'SPINNING...' : 'SPIN'}
          onPress={handleSpin}
          size="lg"
          fullWidth
          disabled={playerStats.spins <= 0 || isSpinning}
          loading={isSpinning}
        />

        {playerStats.spins <= 0 && (
          <Text style={styles.noSpinsText}>
            Plus de spins! Attendez le rechargement.
          </Text>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  levelBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  levelText: {
    ...typography.captionBold,
    color: colors.white,
  },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  placeholder: {
    width: 50,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.navy[800],
    marginHorizontal: spacing.lg,
    borderRadius: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resourceEmoji: {
    fontSize: 20,
  },
  resourceValue: {
    ...typography.bodyBold,
    color: colors.white,
  },
  slotContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  winContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  winText: {
    ...typography.h2,
    color: colors.accent[400],
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  noSpinsText: {
    ...typography.caption,
    color: colors.navy[400],
    textAlign: 'center',
  },
});
