import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { CoinDisplay } from '@/components/ui';

interface HeaderProps {
  coins: number;
  spins: number;
  shields: number;
  level: number;
  onSettingsPress?: () => void;
}

export function Header({ coins, spins, shields, level, onSettingsPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Level badge */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv. {level}</Text>
      </View>

      {/* Resources */}
      <View style={styles.resources}>
        <CoinDisplay amount={coins} size="md" />

        <View style={styles.resourceItem}>
          <Text style={styles.resourceEmoji}>⚡</Text>
          <Text style={styles.resourceValue}>{spins}</Text>
        </View>

        <View style={styles.resourceItem}>
          <Text style={styles.resourceEmoji}>🛡️</Text>
          <Text style={styles.resourceValue}>{shields}</Text>
        </View>
      </View>

      {/* Settings */}
      {onSettingsPress && (
        <TouchableOpacity onPress={onSettingsPress} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.navy[800],
    borderBottomWidth: 1,
    borderBottomColor: colors.navy[700],
  },
  levelBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  levelText: {
    ...typography.captionBold,
    color: colors.white,
  },
  resources: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.navy[700],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  resourceEmoji: {
    fontSize: 14,
  },
  resourceValue: {
    ...typography.bodyBold,
    color: colors.white,
  },
  settingsButton: {
    padding: spacing.xs,
  },
  settingsIcon: {
    fontSize: 24,
  },
});
