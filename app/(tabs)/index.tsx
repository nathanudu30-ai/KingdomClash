import React, { useState, useCallback, useEffect } from 'react';
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
  const [autoSpinRemaining, setAutoSpinRemaining] = useState<number | null>(null);
  const [lastWin, setLastWin] = useState<string | null>(null);
  const [betOption, setBetOption] = useState<'x1' | 'x2' | 'x5'>('x1');

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
  const isAutoSpinning = autoSpinRemaining !== null;
  const betConfigs = {
    x1: { label: 'x1', spinCost: 1, betAmount: 1, bonusMultiplier: 1 },
    x2: { label: 'x2', spinCost: 3, betAmount: 3, bonusMultiplier: 1.2 },
    x5: { label: 'x5', spinCost: 10, betAmount: 10, bonusMultiplier: 1.33 },
  } as const;
  const activeBet = betConfigs[betOption];

  const handleSpin = useCallback(async () => {
    if (playerStats.spins < activeBet.spinCost || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    // Generate result
    const result = spin();
    setCurrentResult(result);

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [playerStats.spins, isSpinning, activeBet.spinCost]);

  const handleSpinComplete = useCallback(async () => {
    setIsSpinning(false);

    if (!currentResult) return;

    // Calculate reward
    const effectiveBet = Math.max(
      1,
      Math.round(activeBet.betAmount * activeBet.bonusMultiplier)
    );
    const reward = calculateReward(
      currentResult,
      effectiveBet,
      playerStats.attackMultiplier
    );

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

    if (autoSpinRemaining !== null) {
      setAutoSpinRemaining((prev) => {
        if (prev === null) return null;
        const next = prev - 1;
        return next > 0 ? next : null;
      });
    }
  }, [
    currentResult,
    playerStats.attackMultiplier,
    refreshStats,
    autoSpinRemaining,
    activeBet.betAmount,
    activeBet.bonusMultiplier,
  ]);

  const startAutoSpin = (count: number) => {
    if (isSpinning || playerStats.spins <= 0) return;
    setAutoSpinRemaining(Math.min(count, playerStats.spins));
  };

  const stopAutoSpin = () => {
    setAutoSpinRemaining(null);
  };

  useEffect(() => {
    if (autoSpinRemaining === null) return;
    if (isSpinning) return;
    if (playerStats.spins <= 0) {
      setAutoSpinRemaining(null);
      return;
    }
    if (autoSpinRemaining <= 0) {
      setAutoSpinRemaining(null);
      return;
    }

    const timeout = setTimeout(() => {
      handleSpin();
    }, 500);

    return () => clearTimeout(timeout);
  }, [autoSpinRemaining, isSpinning, playerStats.spins, handleSpin]);

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
          disabled={playerStats.spins < activeBet.spinCost || isSpinning || isAutoSpinning}
          loading={isSpinning}
        />

        <View style={styles.betSection}>
          <Text style={styles.betLabel}>Mise</Text>
          <View style={styles.betRow}>
            {(['x1', 'x2', 'x5'] as const).map((option) => {
              const optionConfig = betConfigs[option];
              const isActive = option === betOption;
              return (
                <Button
                  key={option}
                  title={`${optionConfig.label} (${optionConfig.spinCost})`}
                  onPress={() => setBetOption(option)}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                />
              );
            })}
          </View>
          <Text style={styles.betHelper}>
            Bonus: {activeBet.bonusMultiplier === 1 ? '0%' : `${Math.round((activeBet.bonusMultiplier - 1) * 100)}%`}
          </Text>
        </View>

        <View style={styles.autoSpinSection}>
          <Text style={styles.autoSpinLabel}>Auto-spin</Text>
          <View style={styles.autoSpinRow}>
            {isAutoSpinning ? (
              <Button
                title={`Stop (${autoSpinRemaining})`}
                onPress={stopAutoSpin}
                variant="secondary"
                size="sm"
                fullWidth
              />
            ) : (
              <>
                <Button
                  title="10"
                  onPress={() => startAutoSpin(10)}
                  variant="secondary"
                  size="sm"
                />
                <Button
                  title="50"
                  onPress={() => startAutoSpin(50)}
                  variant="secondary"
                  size="sm"
                />
                <Button
                  title="100"
                  onPress={() => startAutoSpin(100)}
                  variant="secondary"
                  size="sm"
                />
              </>
            )}
          </View>
        </View>

        {playerStats.spins < activeBet.spinCost && (
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
  betSection: {
    gap: spacing.xs,
  },
  betLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  betRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  betHelper: {
    ...typography.caption,
    color: colors.navy[500],
  },
  autoSpinSection: {
    gap: spacing.xs,
  },
  autoSpinLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  autoSpinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  noSpinsText: {
    ...typography.caption,
    color: colors.navy[400],
    textAlign: 'center',
  },
});
