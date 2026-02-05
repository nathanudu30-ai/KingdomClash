import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button } from '@/components/ui';
import { usePvp } from '@/hooks';
import { AttackTarget, getRevengeTimeRemaining } from '@/types/pvp';

export default function AttacksScreen() {
  const {
    attacksAvailable,
    raidsAvailable,
    currentTargets,
    activeRevenges,
    isAttacking,
    refreshTargetPool,
    executeAttack,
  } = usePvp();

  // Refresh targets on mount if empty
  useEffect(() => {
    if (currentTargets.length === 0) {
      refreshTargetPool();
    }
  }, []);

  const handleAttack = async (target: AttackTarget) => {
    await executeAttack(target);
  };

  const handleRaid = (target: AttackTarget) => {
    router.push({
      pathname: '/raid',
      params: { targetId: target.id, targetName: target.username },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Attaques</Text>
        <View style={styles.actionsRow}>
          <View style={styles.actionBadge}>
            <Text style={styles.actionEmoji}>⚔️</Text>
            <Text style={styles.actionCount}>{attacksAvailable}</Text>
          </View>
          <View style={styles.actionBadge}>
            <Text style={styles.actionEmoji}>💰</Text>
            <Text style={styles.actionCount}>{raidsAvailable}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Revenge Section */}
        {activeRevenges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Revanches disponibles</Text>
            {activeRevenges.map((revenge) => (
              <Card key={revenge.id} variant="elevated" style={styles.revengeCard}>
                <View style={styles.revengeInfo}>
                  <Text style={styles.revengeEmoji}>😤</Text>
                  <View style={styles.revengeText}>
                    <Text style={styles.revengeName}>{revenge.attackerUsername}</Text>
                    <Text style={styles.revengeAmount}>
                      A volé {revenge.coinsLost.toLocaleString()} coins
                    </Text>
                    <Text style={styles.revengeTimer}>
                      ⏰ {getRevengeTimeRemaining(revenge)}
                    </Text>
                  </View>
                </View>
                <Button
                  title="Venger!"
                  onPress={() => {}}
                  variant="danger"
                  size="sm"
                  loading={isAttacking}
                />
              </Card>
            ))}
          </View>
        )}

        {/* Targets Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Cibles disponibles</Text>
            <TouchableOpacity onPress={refreshTargetPool}>
              <Text style={styles.refreshButton}>🔄 Rafraîchir</Text>
            </TouchableOpacity>
          </View>

          {currentTargets.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Aucune cible disponible. Rafraîchissez pour trouver des adversaires!
              </Text>
            </Card>
          ) : (
            currentTargets.map((target) => (
              <TargetCard
                key={target.id}
                target={target}
                attacksAvailable={attacksAvailable}
                raidsAvailable={raidsAvailable}
                isAttacking={isAttacking}
                onAttack={() => handleAttack(target)}
                onRaid={() => handleRaid(target)}
              />
            ))
          )}
        </View>

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Comment obtenir des attaques</Text>
          <Text style={styles.infoText}>
            Jouez au slot machine! Obtenez ⚔️ pour attaquer ou 💰 pour raider.
            Les revanches ignorent les boucliers!
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

interface TargetCardProps {
  target: AttackTarget;
  attacksAvailable: number;
  raidsAvailable: number;
  isAttacking: boolean;
  onAttack: () => void;
  onRaid: () => void;
}

function TargetCard({
  target,
  attacksAvailable,
  raidsAvailable,
  isAttacking,
  onAttack,
  onRaid,
}: TargetCardProps) {
  // Shield animation
  const shieldScale = useSharedValue(1);

  useEffect(() => {
    if (target.hasShield) {
      shieldScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [target.hasShield]);

  const shieldStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shieldScale.value }],
  }));

  return (
    <Card variant="elevated" style={styles.targetCard}>
      <View style={styles.targetHeader}>
        <View style={styles.targetInfo}>
          <Text style={styles.targetAvatar}>👤</Text>
          <View>
            <View style={styles.targetNameRow}>
              <Text style={styles.targetName}>{target.username}</Text>
              {target.hasShield && (
                <Animated.Text style={[styles.shieldIcon, shieldStyle]}>
                  🛡️
                </Animated.Text>
              )}
            </View>
            <Text style={styles.targetLevel}>Niveau {target.level}</Text>
          </View>
        </View>
        <View style={styles.targetCoins}>
          <Text style={styles.targetCoinsAmount}>
            {target.coins.toLocaleString()}
          </Text>
          <Text style={styles.targetCoinsLabel}>🪙</Text>
        </View>
      </View>

      <View style={styles.targetActions}>
        <Button
          title={`Attaquer ${attacksAvailable > 0 ? '' : '(0)'}`}
          onPress={onAttack}
          size="sm"
          disabled={attacksAvailable <= 0 || isAttacking}
          loading={isAttacking}
          style={styles.actionButton}
        />
        <Button
          title={`Raider ${raidsAvailable > 0 ? '' : '(0)'}`}
          onPress={onRaid}
          variant="secondary"
          size="sm"
          disabled={raidsAvailable <= 0}
          style={styles.actionButton}
        />
      </View>

      {target.hasShield && (
        <Text style={styles.shieldWarning}>
          ⚠️ Ce joueur a un bouclier actif
        </Text>
      )}
    </Card>
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
  title: {
    ...typography.h1,
    color: colors.white,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navy[800],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    gap: spacing.xs,
  },
  actionEmoji: {
    fontSize: 16,
  },
  actionCount: {
    ...typography.bodyBold,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.white,
  },
  refreshButton: {
    ...typography.body,
    color: colors.primary[400],
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.navy[400],
    textAlign: 'center',
  },
  revengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    backgroundColor: colors.danger[500] + '20',
    borderWidth: 1,
    borderColor: colors.danger[500],
  },
  revengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  revengeEmoji: {
    fontSize: 32,
  },
  revengeText: {
    gap: 2,
  },
  revengeName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  revengeAmount: {
    ...typography.caption,
    color: colors.danger[400],
  },
  revengeTimer: {
    ...typography.caption,
    color: colors.navy[400],
  },
  targetCard: {
    marginBottom: spacing.sm,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  targetAvatar: {
    fontSize: 40,
    backgroundColor: colors.navy[700],
    borderRadius: 20,
  },
  targetNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  targetName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  shieldIcon: {
    fontSize: 16,
  },
  targetLevel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  targetCoins: {
    alignItems: 'flex-end',
  },
  targetCoinsAmount: {
    ...typography.h3,
    color: colors.accent[400],
  },
  targetCoinsLabel: {
    fontSize: 14,
  },
  targetActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  shieldWarning: {
    ...typography.caption,
    color: colors.accent[400],
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: spacing.xxl,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.body,
    color: colors.navy[300],
  },
});
