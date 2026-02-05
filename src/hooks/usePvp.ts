import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  AttackTarget,
  AttackResult,
  RaidResult,
  RaidSpot,
  RevengeEntry,
  PvpState,
  generateMockTargets,
  calculateStolenCoins,
  generateRaidSpots,
  isRevengeExpired,
} from '@/types/pvp';
import { useAuth } from '@/lib/auth';

const TARGET_POOL_DURATION = 60 * 60 * 1000; // 1 hour

export function usePvp() {
  const { stats, refreshStats } = useAuth();

  const [state, setState] = useState<PvpState>({
    attacksAvailable: 0,
    raidsAvailable: 0,
    currentTargets: [],
    targetPoolExpiresAt: null,
    revengeList: [],
  });

  const [isAttacking, setIsAttacking] = useState(false);
  const [isRaiding, setIsRaiding] = useState(false);
  const [currentRaidSpots, setCurrentRaidSpots] = useState<RaidSpot[]>([]);

  // Refresh targets when pool expires
  useEffect(() => {
    if (!state.targetPoolExpiresAt) return;

    const checkExpiry = () => {
      if (new Date(state.targetPoolExpiresAt!) < new Date()) {
        refreshTargetPool();
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.targetPoolExpiresAt]);

  // Clean up expired revenges
  useEffect(() => {
    const cleanup = () => {
      setState((prev) => ({
        ...prev,
        revengeList: prev.revengeList.filter((r) => !isRevengeExpired(r)),
      }));
    };

    const interval = setInterval(cleanup, 60000);
    return () => clearInterval(interval);
  }, []);

  // Refresh target pool
  const refreshTargetPool = useCallback(() => {
    const newTargets = generateMockTargets();
    const expiresAt = new Date(Date.now() + TARGET_POOL_DURATION).toISOString();

    setState((prev) => ({
      ...prev,
      currentTargets: newTargets,
      targetPoolExpiresAt: expiresAt,
    }));
  }, []);

  // Add attack (from slot machine win)
  const addAttack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      attacksAvailable: prev.attacksAvailable + 1,
    }));

    // Refresh targets if none
    if (state.currentTargets.length === 0) {
      refreshTargetPool();
    }
  }, [state.currentTargets.length, refreshTargetPool]);

  // Add raid (from slot machine win)
  const addRaid = useCallback(() => {
    setState((prev) => ({
      ...prev,
      raidsAvailable: prev.raidsAvailable + 1,
    }));

    // Refresh targets if none
    if (state.currentTargets.length === 0) {
      refreshTargetPool();
    }
  }, [state.currentTargets.length, refreshTargetPool]);

  // Execute attack
  const executeAttack = useCallback(
    async (target: AttackTarget): Promise<AttackResult | null> => {
      if (state.attacksAvailable <= 0) {
        Alert.alert('Pas d\'attaque', 'Jouez au slot pour gagner des attaques!');
        return null;
      }

      setIsAttacking(true);

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Simulate attack
        await new Promise((r) => setTimeout(r, 1500));

        let result: AttackResult;

        if (target.hasShield) {
          // Shield blocks attack
          result = {
            success: false,
            coinsStolen: 0,
            shieldBlocked: true,
            target,
            timestamp: new Date().toISOString(),
          };

          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert('🛡️ Bouclier!', `${target.username} était protégé par un bouclier!`);
        } else {
          // Successful attack
          const coinsStolen = calculateStolenCoins(target.coins);

          result = {
            success: true,
            coinsStolen,
            shieldBlocked: false,
            target,
            timestamp: new Date().toISOString(),
          };

          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            '⚔️ Attaque réussie!',
            `Vous avez volé ${coinsStolen.toLocaleString()} coins à ${target.username}!`
          );

          // In production: Update coins via Supabase
          await refreshStats();
        }

        // Decrement attacks
        setState((prev) => ({
          ...prev,
          attacksAvailable: prev.attacksAvailable - 1,
        }));

        return result;
      } catch (error) {
        console.error('Attack error:', error);
        Alert.alert('Erreur', 'Impossible d\'effectuer l\'attaque.');
        return null;
      } finally {
        setIsAttacking(false);
      }
    },
    [state.attacksAvailable, refreshStats]
  );

  // Start raid (returns spots to reveal)
  const startRaid = useCallback(
    (target: AttackTarget): RaidSpot[] | null => {
      if (state.raidsAvailable <= 0) {
        Alert.alert('Pas de raid', 'Jouez au slot pour gagner des raids!');
        return null;
      }

      const spots = generateRaidSpots();
      setCurrentRaidSpots(spots);

      setState((prev) => ({
        ...prev,
        raidsAvailable: prev.raidsAvailable - 1,
      }));

      return spots;
    },
    [state.raidsAvailable]
  );

  // Reveal a raid spot
  const revealRaidSpot = useCallback(
    async (spotId: number): Promise<number> => {
      const spot = currentRaidSpots.find((s) => s.id === spotId);
      if (!spot || spot.revealed) return 0;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setCurrentRaidSpots((prev) =>
        prev.map((s) => (s.id === spotId ? { ...s, revealed: true } : s))
      );

      if (spot.coins > 0) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      return spot.coins;
    },
    [currentRaidSpots]
  );

  // Complete raid
  const completeRaid = useCallback(
    async (target: AttackTarget): Promise<RaidResult> => {
      setIsRaiding(true);

      try {
        const revealedSpots = currentRaidSpots.filter((s) => s.revealed);
        const totalCoins = revealedSpots.reduce((sum, s) => sum + s.coins, 0);

        const result: RaidResult = {
          success: totalCoins > 0,
          totalCoins,
          spotsRevealed: revealedSpots,
          target,
          timestamp: new Date().toISOString(),
        };

        if (totalCoins > 0) {
          Alert.alert(
            '💰 Raid terminé!',
            `Vous avez trouvé ${totalCoins.toLocaleString()} coins!`
          );

          // In production: Update coins via Supabase
          await refreshStats();
        } else {
          Alert.alert('Raid terminé', 'Vous n\'avez rien trouvé cette fois...');
        }

        // Clear raid spots
        setCurrentRaidSpots([]);

        return result;
      } finally {
        setIsRaiding(false);
      }
    },
    [currentRaidSpots, refreshStats]
  );

  // Execute revenge
  const executeRevenge = useCallback(
    async (entry: RevengeEntry): Promise<AttackResult | null> => {
      if (isRevengeExpired(entry)) {
        Alert.alert('Expiré', 'Cette revanche a expiré!');
        return null;
      }

      setIsAttacking(true);

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        // Revenge bypasses shields
        const coinsStolen = Math.floor(entry.coinsLost * 1.5); // Get back 150%

        await new Promise((r) => setTimeout(r, 1500));

        const result: AttackResult = {
          success: true,
          coinsStolen,
          shieldBlocked: false,
          target: {
            id: entry.id,
            playerId: entry.attackerId,
            username: entry.attackerUsername,
            avatarUrl: entry.attackerAvatarUrl,
            level: entry.attackerLevel,
            districtsCompleted: 0,
            coins: coinsStolen,
            hasShield: false,
          },
          timestamp: new Date().toISOString(),
        };

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          '🔥 Vengeance!',
          `Vous avez récupéré ${coinsStolen.toLocaleString()} coins de ${entry.attackerUsername}!`
        );

        // Mark as revenged
        setState((prev) => ({
          ...prev,
          revengeList: prev.revengeList.map((r) =>
            r.id === entry.id ? { ...r, revenged: true } : r
          ),
        }));

        await refreshStats();

        return result;
      } catch (error) {
        console.error('Revenge error:', error);
        Alert.alert('Erreur', 'Impossible d\'effectuer la revanche.');
        return null;
      } finally {
        setIsAttacking(false);
      }
    },
    [refreshStats]
  );

  // Get active (non-revenged, non-expired) revenges
  const activeRevenges = state.revengeList.filter(
    (r) => !r.revenged && !isRevengeExpired(r)
  );

  return {
    attacksAvailable: state.attacksAvailable,
    raidsAvailable: state.raidsAvailable,
    currentTargets: state.currentTargets,
    activeRevenges,
    currentRaidSpots,
    isAttacking,
    isRaiding,
    refreshTargetPool,
    addAttack,
    addRaid,
    executeAttack,
    startRaid,
    revealRaidSpot,
    completeRaid,
    executeRevenge,
  };
}
