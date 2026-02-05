import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button, ProgressBar } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { getPlayerLevel } from '@/types/game';

export default function ProfileScreen() {
  const { player, stats, isGuest, signOut } = useAuth();

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
  const username = player?.username ?? 'Joueur';

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleConvertAccount = () => {
    router.push('/(auth)/register');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{level}</Text>
            </View>
          </View>
          <Text style={styles.username}>{username}</Text>
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestText}>Compte Invité</Text>
            </View>
          )}
        </View>

        {/* Guest Convert Banner */}
        {isGuest && (
          <Card variant="elevated" style={styles.convertBanner}>
            <Text style={styles.convertTitle}>⚠️ Sauvegardez votre progression</Text>
            <Text style={styles.convertText}>
              Créez un compte pour ne pas perdre vos données!
            </Text>
            <Button
              title="Créer un compte"
              onPress={handleConvertAccount}
              size="sm"
              style={styles.convertButton}
            />
          </Card>
        )}

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <Card variant="elevated">
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {playerStats.coins.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Coins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{playerStats.districtsCompleted}</Text>
                <Text style={styles.statLabel}>Districts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{playerStats.totalAttacks}</Text>
                <Text style={styles.statLabel}>Attaques</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{playerStats.totalRaids}</Text>
                <Text style={styles.statLabel}>Raids</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progression</Text>
          <Card variant="elevated">
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Niveau {level}</Text>
                <Text style={styles.progressValue}>
                  {playerStats.districtsCompleted} districts
                </Text>
              </View>
              <ProgressBar
                progress={Math.min(playerStats.districtsCompleted / 20, 1)}
                height={8}
              />
            </View>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <Card variant="elevated" padding={0}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>🔔</Text>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>🔊</Text>
              <Text style={styles.menuText}>Son et vibrations</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>🌐</Text>
              <Text style={styles.menuText}>Langue</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>📋</Text>
              <Text style={styles.menuText}>Conditions d'utilisation</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>🔒</Text>
              <Text style={styles.menuText}>Politique de confidentialité</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuEmoji}>💬</Text>
              <Text style={styles.menuText}>Support</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <Button
            title="Déconnexion"
            onPress={handleSignOut}
            variant="danger"
            fullWidth
          />
        </View>

        {/* Version */}
        <Text style={styles.version}>Kingdom Clash v0.2.0</Text>
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
    alignItems: 'center',
    padding: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    fontSize: 80,
    backgroundColor: colors.navy[800],
    borderRadius: 50,
    overflow: 'hidden',
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.navy[900],
  },
  levelText: {
    ...typography.captionBold,
    color: colors.white,
  },
  username: {
    ...typography.h1,
    color: colors.white,
  },
  guestBadge: {
    backgroundColor: colors.accent[500] + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  guestText: {
    ...typography.caption,
    color: colors.accent[400],
  },
  convertBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.accent[500] + '20',
    borderWidth: 1,
    borderColor: colors.accent[500],
  },
  convertTitle: {
    ...typography.bodyBold,
    color: colors.accent[400],
    marginBottom: spacing.xs,
  },
  convertText: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  convertButton: {
    alignSelf: 'flex-start',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary[400],
  },
  statLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  progressItem: {
    gap: spacing.xs,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typography.body,
    color: colors.white,
  },
  progressValue: {
    ...typography.caption,
    color: colors.navy[400],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.navy[700],
  },
  menuEmoji: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuText: {
    ...typography.body,
    color: colors.white,
    flex: 1,
  },
  menuArrow: {
    ...typography.h2,
    color: colors.navy[500],
  },
  version: {
    ...typography.caption,
    color: colors.navy[500],
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
});
