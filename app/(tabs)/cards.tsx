import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, ProgressBar } from '@/components/ui';

// Placeholder card sets for Phase 6
const CARD_SETS = [
  {
    id: 1,
    name: 'Street Gang',
    rarity: 'common',
    collected: 3,
    total: 9,
    color: colors.navy[500],
  },
  {
    id: 2,
    name: 'Corporate Elite',
    rarity: 'common',
    collected: 1,
    total: 9,
    color: colors.navy[500],
  },
  {
    id: 3,
    name: 'Tech Moguls',
    rarity: 'rare',
    collected: 0,
    total: 9,
    color: colors.primary[500],
  },
  {
    id: 4,
    name: 'Criminal Minds',
    rarity: 'rare',
    collected: 0,
    total: 9,
    color: colors.primary[500],
  },
  {
    id: 5,
    name: 'World Leaders',
    rarity: 'epic',
    collected: 0,
    total: 9,
    color: '#8B5CF6',
  },
  {
    id: 6,
    name: 'Legends',
    rarity: 'legendary',
    collected: 0,
    total: 9,
    color: colors.accent[500],
  },
];

function getRarityLabel(rarity: string): string {
  switch (rarity) {
    case 'common': return 'Commun';
    case 'rare': return 'Rare';
    case 'epic': return 'Épique';
    case 'legendary': return 'Légendaire';
    default: return rarity;
  }
}

export default function CardsScreen() {
  const totalCards = CARD_SETS.reduce((acc, set) => acc + set.collected, 0);
  const totalPossible = CARD_SETS.reduce((acc, set) => acc + set.total, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Collection</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            {totalCards}/{totalPossible} cartes
          </Text>
        </View>
      </View>

      {/* Overall Progress */}
      <View style={styles.overallProgress}>
        <ProgressBar
          progress={totalCards / totalPossible}
          height={8}
          color={colors.accent[500]}
        />
      </View>

      {/* Card Sets */}
      <ScrollView style={styles.setsContainer}>
        {CARD_SETS.map((set) => (
          <Card key={set.id} variant="elevated" style={styles.setCard}>
            <View style={styles.setHeader}>
              <View>
                <Text style={styles.setName}>{set.name}</Text>
                <Text style={[styles.setRarity, { color: set.color }]}>
                  {getRarityLabel(set.rarity)}
                </Text>
              </View>
              <Text style={styles.setCount}>
                {set.collected}/{set.total}
              </Text>
            </View>

            <ProgressBar
              progress={set.collected / set.total}
              height={6}
              color={set.color}
              style={styles.setProgress}
            />

            {/* Card placeholders */}
            <View style={styles.cardsRow}>
              {Array.from({ length: 9 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.cardSlot,
                    i < set.collected && { backgroundColor: set.color },
                  ]}
                >
                  {i < set.collected ? (
                    <Text style={styles.cardEmoji}>🃏</Text>
                  ) : (
                    <Text style={styles.cardQuestion}>?</Text>
                  )}
                </View>
              ))}
            </View>

            {set.collected === set.total && (
              <View style={styles.completeBadge}>
                <Text style={styles.completeText}>✓ SET COMPLET</Text>
              </View>
            )}
          </Card>
        ))}

        {/* Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Comment obtenir des cartes</Text>
          <Text style={styles.infoText}>
            Complétez des districts pour gagner des coffres de cartes!
            Échangez avec vos amis pour compléter vos sets.
          </Text>
        </Card>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.white,
  },
  statsContainer: {
    backgroundColor: colors.navy[800],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statsText: {
    ...typography.bodyBold,
    color: colors.accent[400],
  },
  overallProgress: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  setsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  setCard: {
    marginBottom: spacing.md,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  setName: {
    ...typography.h3,
    color: colors.white,
  },
  setRarity: {
    ...typography.caption,
    fontWeight: '600',
  },
  setCount: {
    ...typography.h3,
    color: colors.white,
  },
  setProgress: {
    marginBottom: spacing.md,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cardSlot: {
    width: 32,
    height: 44,
    backgroundColor: colors.navy[700],
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 18,
  },
  cardQuestion: {
    ...typography.caption,
    color: colors.navy[500],
  },
  completeBadge: {
    backgroundColor: colors.success[500] + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  completeText: {
    ...typography.captionBold,
    color: colors.success[500],
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
