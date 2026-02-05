import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type TabId = 'home' | 'village' | 'attacks' | 'cards' | 'friends';

interface Tab {
  id: TabId;
  label: string;
  emoji: string;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', emoji: '🎰' },
  { id: 'village', label: 'Village', emoji: '🏰' },
  { id: 'attacks', label: 'Attacks', emoji: '⚔️' },
  { id: 'cards', label: 'Cards', emoji: '🃏' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
];

interface BottomNavProps {
  activeTab: TabId;
  onTabPress: (tabId: TabId) => void;
}

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  const handlePress = async (tabId: TabId) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress(tabId);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.xs }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => handlePress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.emoji, isActive && styles.activeEmoji]}>
              {tab.emoji}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.navy[800],
    borderTopWidth: 1,
    borderTopColor: colors.navy[700],
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  activeTab: {
    // Active indicator handled by text styles
  },
  emoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  activeEmoji: {
    opacity: 1,
  },
  label: {
    ...typography.caption,
    color: colors.navy[400],
  },
  activeLabel: {
    color: colors.primary[400],
    fontWeight: '600',
  },
});
