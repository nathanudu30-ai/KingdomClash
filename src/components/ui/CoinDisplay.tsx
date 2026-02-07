import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { localAssetRequires } from '@/config/localAssets';

interface CoinDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function CoinDisplay({ amount, size = 'md', animated = true }: CoinDisplayProps) {
  const scale = useSharedValue(1);
  const previousAmount = useSharedValue(amount);

  useEffect(() => {
    if (animated && amount !== previousAmount.value) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withTiming(1, { duration: 150 })
      );
      previousAmount.value = amount;
    }
  }, [amount, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sizeStyles = {
    sm: { icon: 16, text: typography.caption },
    md: { icon: 20, text: typography.body },
    lg: { icon: 28, text: typography.h2 },
  };

  const { icon: iconSize, text: textStyle } = sizeStyles[size];

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Image source={localAssetRequires.tokens.token01} style={[styles.icon, { width: iconSize, height: iconSize }]} resizeMode="contain" />
      <Text style={[styles.amount, textStyle]}>{formatNumber(amount)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {},
  amount: {
    color: colors.accent[400],
    fontWeight: '700',
  },
});
