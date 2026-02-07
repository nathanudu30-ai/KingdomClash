import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CoinDisplay } from '@/components/ui';
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
    const result = spin();
    setCurrentResult(result);

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [playerStats.spins, isSpinning, activeBet.spinCost]);

  const handleSpinComplete = useCallback(async () => {
    setIsSpinning(false);

    if (!currentResult) return;

    const effectiveBet = Math.max(1, Math.round(activeBet.betAmount * activeBet.bonusMultiplier));
    const reward = calculateReward(currentResult, effectiveBet, playerStats.attackMultiplier);

    if (reward) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      switch (reward.type) {
        case 'coins':
        case 'jackpot':
          setLastWin(`+${reward.amount.toLocaleString()} pièces`);
          break;
        case 'shield':
          setLastWin(`+${reward.amount} bouclier${reward.amount > 1 ? 's' : ''}`);
          break;
        case 'energy':
          setLastWin(`+${reward.amount} spins`);
          break;
        case 'attack':
          setLastWin('Attaque prête');
          break;
        case 'raid':
          setLastWin('Raid prêt');
          break;
        case 'bonus':
          setLastWin('BONUS');
          break;
      }

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
        <View style={styles.overlay}>
          <View style={styles.header}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Niv. {level}</Text>
            </View>
            <Text style={styles.title}>Kingdom Clash</Text>
            <Text style={styles.playerName}>{player?.username ?? 'Invité'}</Text>
          </View>

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

          <View style={styles.slotContainer}>
            <View style={styles.slotFrame}>
              <SlotMachine result={currentResult} isSpinning={isSpinning} onSpinComplete={handleSpinComplete} />
            </View>

            {lastWin && (
              <View style={styles.winContainer}>
                <Text style={styles.winText}>{lastWin}</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.betRow}>
              {(['x1', 'x2', 'x5'] as const).map((option) => {
                const optionConfig = betConfigs[option];
                const isActive = option === betOption;
                return (
                  <Pressable
                    key={option}
                    onPress={() => setBetOption(option)}
                    style={[styles.optionButton, isActive && styles.optionButtonActive]}
                  >
                    <Text style={[styles.optionButtonText, isActive && styles.optionButtonTextActive]}>
                      {optionConfig.label} ({optionConfig.spinCost})
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={handleSpin}
              disabled={playerStats.spins < activeBet.spinCost || isSpinning || isAutoSpinning}
              style={[styles.spinButton, (playerStats.spins < activeBet.spinCost || isSpinning || isAutoSpinning) && styles.spinButtonDisabled]}
            >
              <Text style={styles.spinButtonText}>{isSpinning ? 'SPINNING...' : 'SPIN'}</Text>
            </Pressable>

            <View style={styles.autoSpinPanel}>
              <Text style={styles.autoSpinLabel}>Auto-spin</Text>
              <View style={styles.autoSpinRow}>
                {isAutoSpinning ? (
                  <Pressable onPress={stopAutoSpin} style={styles.autoButton}>
                    <Text style={styles.autoButtonText}>Stop ({autoSpinRemaining})</Text>
                  </Pressable>
                ) : (
                  [10, 50, 100].map((count) => (
                    <Pressable key={count} onPress={() => startAutoSpin(count)} style={styles.autoButton}>
                      <Text style={styles.autoButtonText}>{count}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            </View>

            {playerStats.spins < activeBet.spinCost && (
              <Text style={styles.noSpinsText}>Plus de spins ! Attendez le rechargement.</Text>
            )}
          </View>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 9, 6, 0.70)',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#8B6226',
    borderRadius: 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(61, 25, 14, 0.88)',
  },
  levelBadge: {
    backgroundColor: '#B88A2A',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  levelText: {
    ...typography.captionBold,
    color: '#34170E',
  },
  title: {
    ...typography.h2,
    color: '#F7DF9D',
    letterSpacing: 0.6,
  },
  playerName: {
    ...typography.caption,
    color: '#F8E7BA',
    maxWidth: 72,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8D6427',
    backgroundColor: 'rgba(40, 18, 10, 0.88)',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#4A1E15',
    borderWidth: 1,
    borderColor: '#AA7A2D',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  resourceEmoji: {
    fontSize: 18,
  },
  resourceValue: {
    ...typography.bodyBold,
    color: '#F6DC95',
  },
  slotContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  slotFrame: {
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#DAAB43',
    backgroundColor: 'rgba(77, 28, 17, 0.94)',
    padding: spacing.sm,
    shadowColor: '#FFCB66',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 10,
  },
  winContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  winText: {
    ...typography.h3,
    color: '#FFD774',
    textTransform: 'uppercase',
  },
  footer: {
    borderWidth: 1,
    borderColor: '#8D6324',
    borderRadius: 20,
    padding: spacing.md,
    backgroundColor: 'rgba(39, 16, 10, 0.9)',
    gap: spacing.sm,
  },
  betRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7E5930',
    backgroundColor: '#3A2118',
  },
  optionButtonActive: {
    backgroundColor: '#D4A945',
    borderColor: '#F3CB76',
  },
  optionButtonText: {
    ...typography.captionBold,
    color: '#E1C486',
  },
  optionButtonTextActive: {
    color: '#46210F',
  },
  spinButton: {
    borderRadius: 16,
    backgroundColor: '#15609B',
    borderWidth: 2,
    borderColor: '#6FB4EC',
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  spinButtonDisabled: {
    opacity: 0.55,
  },
  spinButtonText: {
    ...typography.h2,
    color: '#F8FBFF',
    letterSpacing: 1,
  },
  autoSpinPanel: {
    gap: spacing.xs,
  },
  autoSpinLabel: {
    ...typography.caption,
    color: '#D9BD86',
  },
  autoSpinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  autoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#8B6327',
    borderRadius: 10,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: '#4A2818',
  },
  autoButtonText: {
    ...typography.captionBold,
    color: '#F3D796',
  },
  noSpinsText: {
    ...typography.caption,
    color: '#DE956E',
    textAlign: 'center',
  },
});
