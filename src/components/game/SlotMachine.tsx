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
        <Text style={styles.machineHeaderText}>SALLE AU TRÉSOR</Text>
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
          <Text style={styles.winIndicatorText}>{result.multiplier >= 3 ? '👑 JACKPOT' : '✨ GAIN'}</Text>
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
    borderColor: '#E7B34E',
    backgroundColor: '#2D130D',
    padding: spacing.sm,
    gap: spacing.sm,
    shadowColor: '#FFC45F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  machineHeader: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#F4CB72',
    backgroundColor: '#5E2815',
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  machineHeaderText: {
    color: '#FFE8A8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  board: {
    gap: 8,
  },
  reelsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  cell: {
    width: REEL_SIZE,
    height: REEL_SIZE,
    backgroundColor: '#4A2216',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6B552',
    gap: 2,
    shadowColor: '#FFBC54',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  symbol: {
    textAlign: 'center',
  },
  symbolName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F3D08A',
    textTransform: 'uppercase',
  },
  winIndicator: {
    backgroundColor: '#F8C548',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#8C4A05',
  },
  winIndicatorText: {
    color: '#612207',
    fontWeight: '900',
    fontSize: 16,
  },
});
