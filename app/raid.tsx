import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button } from '@/components/ui';
import { RaidSpot, generateRaidSpots } from '@/types/pvp';

const MAX_DIGS = 3;

export default function RaidScreen() {
  const { targetName } = useLocalSearchParams<{ targetName: string }>();

  const [spots, setSpots] = useState<RaidSpot[]>(() => generateRaidSpots());
  const [digsRemaining, setDigsRemaining] = useState(MAX_DIGS);
  const [totalCoins, setTotalCoins] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleDig = async (spotId: number) => {
    if (digsRemaining <= 0 || isComplete) return;

    const spot = spots.find((s) => s.id === spotId);
    if (!spot || spot.revealed) return;

    // Reveal the spot
    setSpots((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, revealed: true } : s))
    );

    setDigsRemaining((prev) => prev - 1);

    // Haptic and update total
    if (spot.coins > 0) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTotalCoins((prev) => prev + spot.coins);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Check if complete
    if (digsRemaining - 1 <= 0) {
      setIsComplete(true);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Raid</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Target info */}
      <Card variant="elevated" style={styles.targetCard}>
        <Text style={styles.targetLabel}>Vous raidez</Text>
        <Text style={styles.targetName}>{targetName || 'Joueur'}</Text>
      </Card>

      {/* Digs remaining */}
      <View style={styles.digsInfo}>
        <Text style={styles.digsLabel}>Creusages restants:</Text>
        <View style={styles.digsRow}>
          {Array.from({ length: MAX_DIGS }).map((_, i) => (
            <Text
              key={i}
              style={[
                styles.digIcon,
                i >= digsRemaining && styles.digIconUsed,
              ]}
            >
              ⛏️
            </Text>
          ))}
        </View>
      </View>

      {/* Raid Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {spots.map((spot) => (
            <RaidSpotTile
              key={spot.id}
              spot={spot}
              disabled={digsRemaining <= 0 || spot.revealed}
              onPress={() => handleDig(spot.id)}
            />
          ))}
        </View>
      </View>

      {/* Total */}
      <Card variant="elevated" style={styles.totalCard}>
        <Text style={styles.totalLabel}>Coins trouvés</Text>
        <Text style={styles.totalAmount}>
          {totalCoins.toLocaleString()} 🪙
        </Text>
      </Card>

      {/* Finish button */}
      {isComplete && (
        <View style={styles.footer}>
          <Button
            title="Terminer le raid"
            onPress={handleFinish}
            size="lg"
            fullWidth
          />
        </View>
      )}

      {/* Instructions */}
      {!isComplete && (
        <Text style={styles.instructions}>
          Touchez un trou pour creuser et trouver des coins!
        </Text>
      )}
    </SafeAreaView>
  );
}

interface RaidSpotTileProps {
  spot: RaidSpot;
  disabled: boolean;
  onPress: () => void;
}

function RaidSpotTile({ spot, disabled, onPress }: RaidSpotTileProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const handlePress = () => {
    if (disabled || spot.revealed) return;

    // Animation
    scale.value = withSequence(
      withSpring(0.8, { damping: 10 }),
      withSpring(1.1, { damping: 5 }),
      withTiming(1, { duration: 200 })
    );
    rotation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.spotTile,
          spot.revealed && styles.spotRevealed,
          spot.revealed && spot.coins > 0 && styles.spotWithCoins,
          animatedStyle,
        ]}
      >
        {spot.revealed ? (
          spot.coins > 0 ? (
            <View style={styles.spotContent}>
              <Text style={styles.spotEmoji}>💰</Text>
              <Text style={styles.spotCoins}>{spot.coins}</Text>
            </View>
          ) : (
            <Text style={styles.spotEmoji}>💨</Text>
          )
        ) : (
          <Text style={styles.spotEmoji}>🕳️</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
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
  backButton: {
    ...typography.body,
    color: colors.primary[400],
  },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  placeholder: {
    width: 60,
  },
  targetCard: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  targetLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  targetName: {
    ...typography.h2,
    color: colors.white,
  },
  digsInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  digsLabel: {
    ...typography.body,
    color: colors.navy[400],
    marginBottom: spacing.xs,
  },
  digsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  digIcon: {
    fontSize: 32,
  },
  digIconUsed: {
    opacity: 0.3,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    gap: spacing.sm,
    justifyContent: 'center',
  },
  spotTile: {
    width: 90,
    height: 90,
    backgroundColor: colors.navy[700],
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.navy[600],
  },
  spotRevealed: {
    backgroundColor: colors.navy[800],
    borderColor: colors.navy[700],
  },
  spotWithCoins: {
    backgroundColor: colors.accent[500] + '30',
    borderColor: colors.accent[500],
  },
  spotContent: {
    alignItems: 'center',
  },
  spotEmoji: {
    fontSize: 36,
  },
  spotCoins: {
    ...typography.captionBold,
    color: colors.accent[400],
    marginTop: 2,
  },
  totalCard: {
    marginHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  totalAmount: {
    ...typography.h1,
    color: colors.accent[400],
  },
  footer: {
    padding: spacing.lg,
  },
  instructions: {
    ...typography.body,
    color: colors.navy[400],
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
