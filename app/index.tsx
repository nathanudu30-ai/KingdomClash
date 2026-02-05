import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Button, Card, CoinDisplay } from '@/components/ui';
import { SlotMachine } from '@/components/game/SlotMachine';
import { spin, calculateReward } from '@/lib/game-logic';
import type { SlotResult, PlayerStats } from '@/types/game';

// Initial player stats for demo
const INITIAL_STATS: PlayerStats = {
  coins: 10000,
  spins: 50,
  shields: 0,
  attackMultiplier: 1,
  districtsCompleted: 0,
  totalAttacks: 0,
  totalRaids: 0,
};

export default function HomeScreen() {
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [currentResult, setCurrentResult] = useState<SlotResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<string | null>(null);

  const handleSpin = useCallback(async () => {
    if (stats.spins <= 0 || isSpinning) return;

    setIsSpinning(true);
    setLastWin(null);

    // Deduct spin
    setStats((prev) => ({ ...prev, spins: prev.spins - 1 }));

    // Generate result
    const result = spin();
    setCurrentResult(result);

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [stats.spins, isSpinning]);

  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);

    if (!currentResult) return;

    // Calculate reward
    const reward = calculateReward(currentResult, 1, stats.attackMultiplier);

    if (reward) {
      // Haptic for win
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      switch (reward.type) {
        case 'coins':
        case 'jackpot':
          setStats((prev) => ({ ...prev, coins: prev.coins + reward.amount }));
          setLastWin(`+${reward.amount.toLocaleString()} coins!`);
          break;
        case 'shield':
          setStats((prev) => ({ ...prev, shields: prev.shields + reward.amount }));
          setLastWin(`+${reward.amount} shield${reward.amount > 1 ? 's' : ''}!`);
          break;
        case 'energy':
          setStats((prev) => ({ ...prev, spins: prev.spins + reward.amount }));
          setLastWin(`+${reward.amount} spins!`);
          break;
        case 'attack':
          setLastWin('Attack ready!');
          break;
        case 'raid':
          setLastWin('Raid ready!');
          break;
        case 'bonus':
          setLastWin('BONUS ROUND!');
          break;
      }
    }
  }, [currentResult, stats.attackMultiplier]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Kingdom Clash</Text>
        <View style={styles.statsRow}>
          <CoinDisplay amount={stats.coins} size="lg" />
          <View style={styles.spinsContainer}>
            <Text style={styles.spinsLabel}>⚡ {stats.spins}</Text>
          </View>
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
          disabled={stats.spins <= 0 || isSpinning}
          loading={isSpinning}
        />

        {stats.spins <= 0 && (
          <Text style={styles.noSpinsText}>No spins left! Wait for energy refill.</Text>
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
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.white,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spinsContainer: {
    backgroundColor: colors.navy[800],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  spinsLabel: {
    ...typography.bodyBold,
    color: colors.accent[400],
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
