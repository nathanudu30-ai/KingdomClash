import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { getSymbolInfo } from '@/lib/game-logic';
import type { SlotResult, SlotSymbol } from '@/types/game';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const REEL_SIZE = (SCREEN_WIDTH - spacing.lg * 4) / 3;
const SYMBOL_SIZE = REEL_SIZE - spacing.sm * 2;

interface SlotMachineProps {
  result: SlotResult | null;
  isSpinning: boolean;
  onSpinComplete: () => void;
}

interface ReelProps {
  symbol: SlotSymbol;
  isSpinning: boolean;
  delay: number;
  onComplete?: () => void;
}

function Reel({ symbol, isSpinning, delay, onComplete }: ReelProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isSpinning) {
      // Spin animation
      rotation.value = withDelay(
        delay,
        withSequence(
          // Fast spin
          withTiming(360 * 5, {
            duration: 1500 + delay,
            easing: Easing.inOut(Easing.cubic),
          }),
          // Bounce back slightly
          withSpring(360 * 5, { damping: 15 }, (finished) => {
            if (finished && onComplete) {
              runOnJS(onComplete)();
            }
          })
        )
      );

      // Scale pop when landing
      scale.value = withDelay(
        delay + 1500,
        withSequence(
          withSpring(1.1, { damping: 10 }),
          withTiming(1, { duration: 150 })
        )
      );
    } else {
      rotation.value = 0;
      scale.value = 1;
    }
  }, [isSpinning, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateX: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const { emoji, color, name } = getSymbolInfo(symbol);

  return (
    <View style={styles.reelContainer}>
      <Animated.View style={[styles.reel, animatedStyle]}>
        <Text style={[styles.symbol, { fontSize: SYMBOL_SIZE * 0.6 }]}>
          {emoji}
        </Text>
      </Animated.View>
      <Text style={[styles.symbolName, { color }]}>{name}</Text>
    </View>
  );
}

export function SlotMachine({ result, isSpinning, onSpinComplete }: SlotMachineProps) {
  // Default symbols when no result
  const symbols: [SlotSymbol, SlotSymbol, SlotSymbol] = result?.symbols ?? [
    'coin',
    'attack',
    'raid',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.reelsRow}>
        {symbols.map((symbol, index) => (
          <Reel
            key={index}
            symbol={symbol}
            isSpinning={isSpinning}
            delay={index * 200}
            onComplete={index === 2 ? onSpinComplete : undefined}
          />
        ))}
      </View>

      {/* Win indicator */}
      {result?.isWin && !isSpinning && (
        <View style={styles.winIndicator}>
          <Text style={styles.winIndicatorText}>
            {result.multiplier >= 3 ? '🎉 JACKPOT! 🎉' : '✨ WIN! ✨'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  reelsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reelContainer: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  reel: {
    width: REEL_SIZE,
    height: REEL_SIZE,
    backgroundColor: colors.navy[700],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.navy[500],
  },
  symbol: {
    textAlign: 'center',
  },
  symbolName: {
    fontSize: 12,
    fontWeight: '600',
  },
  winIndicator: {
    backgroundColor: colors.accent[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  winIndicatorText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
});
