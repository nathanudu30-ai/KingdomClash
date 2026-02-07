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
      rotation.value = withDelay(
        delay,
        withSequence(
          withTiming(360 * 4, {
            duration: 1300 + delay,
            easing: Easing.inOut(Easing.cubic),
          }),
          withSpring(360 * 4, { damping: 14 }, (finished) => {
            if (finished && onComplete) {
              runOnJS(onComplete)();
            }
          })
        )
      );

      scale.value = withDelay(
        delay + 1300,
        withSequence(withSpring(1.08, { damping: 11 }), withTiming(1, { duration: 140 }))
      );
    } else {
      rotation.value = 0;
      scale.value = 1;
    }
  }, [isSpinning, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const { emoji, name } = getSymbolInfo(symbol);

  return (
    <Animated.View style={[styles.cell, animatedStyle]}>
      <Text style={[styles.symbol, { fontSize: SYMBOL_SIZE * 0.52 }]}>{emoji}</Text>
      <Text style={styles.symbolName}>{name}</Text>
    </Animated.View>
  );
}

export function SlotMachine({ result, isSpinning, onSpinComplete }: SlotMachineProps) {
  const symbols: [SlotSymbol, SlotSymbol, SlotSymbol] = result?.symbols ?? ['coin', 'attack', 'raid'];

  return (
    <View style={styles.machineWrapper}>
      <View style={styles.machineHeader}>
        <Text style={styles.machineHeaderText}>TABLE ROYALE</Text>
      </View>

      <View style={styles.board}>
        {[0, 1, 2].map((rowIndex) => (
          <View key={rowIndex} style={styles.reelsRow}>
            {symbols.map((symbol, colIndex) => (
              <Reel
                key={`${rowIndex}-${colIndex}`}
                symbol={symbol}
                isSpinning={isSpinning}
                delay={colIndex * 200}
                onComplete={rowIndex === 2 && colIndex === 2 ? onSpinComplete : undefined}
              />
            ))}
          </View>
        ))}
      </View>

      {result?.isWin && !isSpinning && (
        <View style={styles.winIndicator}>
          <Text style={styles.winIndicatorText}>{result.multiplier >= 3 ? '🏆 JACKPOT' : '✨ WIN'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  machineWrapper: {
    width: '100%',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: '#B88A2A',
    backgroundColor: '#3D140F',
    padding: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#FFD87A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  machineHeader: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#D8AF4A',
    backgroundColor: '#5E1E14',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  machineHeaderText: {
    color: '#F8E39B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  board: {
    gap: 6,
  },
  reelsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cell: {
    width: REEL_SIZE,
    height: REEL_SIZE,
    backgroundColor: '#5B1F16',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A437',
    gap: 2,
  },
  symbol: {
    textAlign: 'center',
  },
  symbolName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EACB86',
    textTransform: 'uppercase',
  },
  winIndicator: {
    backgroundColor: '#FFCB47',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#7A3E00',
  },
  winIndicatorText: {
    color: '#6B210A',
    fontWeight: '900',
    fontSize: 16,
  },
});
