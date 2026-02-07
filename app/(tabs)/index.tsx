import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CoinDisplay } from '@/components/ui';
import { SlotMachine } from '@/components/game';
import { spin, calculateReward } from '@/lib/game-logic';
import { slotDecor } from '@/config/slotDecor';
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
  const [selectedBackground] = useState(() => slotDecor.getWeeklyBackground());

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
      <ImageBackground
        source={selectedBackground}
        style={styles.container}
        resizeMode="cover"
      >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Niv. {level}</Text>
            </View>
            <Text style={styles.title}>TRÉSOR DU ROI</Text>
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
            <Image source={slotDecor.machineFrame} style={styles.machineDecor} resizeMode="contain" />
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
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23140E',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 9, 6, 0.62)',
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
    borderColor: '#C4923A',
    borderRadius: 18,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(43, 16, 9, 0.92)',
    shadowColor: '#FFBD52',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 7,
  },
  levelBadge: {
    backgroundColor: '#E0B75B',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  levelText: {
    ...typography.captionBold,
    color: '#3F1B07',
  },
  title: {
    ...typography.h2,
    color: '#FFE6A3',
    letterSpacing: 1.2,
  },
  playerName: {
    ...typography.caption,
    color: '#FDE7B4',
    maxWidth: 72,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#C7953E',
    backgroundColor: 'rgba(37, 14, 8, 0.92)',
    shadowColor: '#F7AF4A',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    elevation: 5,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#24100A',
    borderWidth: 1,
    borderColor: '#D5A147',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  resourceEmoji: {
    fontSize: 18,
  },
  resourceValue: {
    ...typography.bodyBold,
    color: '#FFE2A1',
  },
  slotContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  machineDecor: {
    width: '100%',
    maxWidth: 540,
    height: 208,
    marginBottom: -164,
    opacity: 0.98,
  },
  slotFrame: {
    width: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#F0BA53',
    backgroundColor: 'rgba(58, 23, 14, 0.96)',
    padding: spacing.sm,
    shadowColor: '#FFC85D',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 16,
    elevation: 12,
  },
  winContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  winText: {
    ...typography.h3,
    color: '#FFE9A0',
    textTransform: 'uppercase',
  },
  footer: {
    borderWidth: 1,
    borderColor: '#D8A34C',
    borderRadius: 22,
    padding: spacing.md,
    backgroundColor: 'rgba(32, 12, 8, 0.94)',
    shadowColor: '#F6AC47',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 9,
    elevation: 4,
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
    borderColor: '#9E6E31',
    backgroundColor: '#2E1811',
  },
  optionButtonActive: {
    backgroundColor: '#E2B24D',
    borderColor: '#FFD98B',
  },
  optionButtonText: {
    ...typography.captionBold,
    color: '#F2D295',
  },
  optionButtonTextActive: {
    color: '#4A210A',
  },
  spinButton: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: '#D1821B',
    borderWidth: 2,
    borderColor: '#FFD074',
    paddingVertical: spacing.md,
    shadowColor: '#FFBF55',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonDisabled: {
    opacity: 0.55,
  },
  spinButtonText: {
    ...typography.h2,
    color: '#FFF1B4',
    letterSpacing: 2,
  },
  autoSpinPanel: {
    gap: spacing.xs,
  },
  autoSpinLabel: {
    ...typography.caption,
    color: '#EBCB8A',
  },
  autoSpinRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  autoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B17B33',
    borderRadius: 10,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: '#361C12',
  },
  autoButtonText: {
    ...typography.captionBold,
    color: '#FFDEA0',
  },
  noSpinsText: {
    ...typography.caption,
    color: '#DE956E',
    textAlign: 'center',
  },
});
