import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Friend,
  FriendRequest,
  Gift,
  GIFT_LIMITS,
  generateMockFriends,
} from '@/types/social';

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>(() => generateMockFriends());
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Send friend request
  const sendFriendRequest = useCallback(async (username: string) => {
    setIsLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // In production: Send via Supabase
      await new Promise((r) => setTimeout(r, 500));

      Alert.alert('Demande envoyée', `Demande d'ami envoyée à ${username}`);
      return true;
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la demande.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Accept friend request
  const acceptRequest = useCallback(async (requestId: string) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Add to friends
    const newFriend: Friend = {
      id: `friend-${Date.now()}`,
      playerId: request.fromPlayerId,
      username: request.fromUsername,
      avatarUrl: request.fromAvatarUrl,
      level: request.fromLevel,
      districtsCompleted: 0,
      isOnline: false,
      lastSeen: new Date().toISOString(),
      guildName: null,
    };

    setFriends((prev) => [...prev, newFriend]);
    setRequests((prev) => prev.filter((r) => r.id !== requestId));

    Alert.alert('Ami ajouté', `${request.fromUsername} est maintenant votre ami!`);
  }, [requests]);

  // Reject friend request
  const rejectRequest = useCallback(async (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  // Remove friend
  const removeFriend = useCallback(async (friendId: string) => {
    const friend = friends.find((f) => f.id === friendId);
    if (!friend) return;

    Alert.alert(
      'Supprimer ami',
      `Voulez-vous vraiment supprimer ${friend.username} de vos amis?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setFriends((prev) => prev.filter((f) => f.id !== friendId));
          },
        },
      ]
    );
  }, [friends]);

  // Send gift to friend
  const sendGift = useCallback(
    async (friendId: string, type: 'spins' | 'coins') => {
      const friend = friends.find((f) => f.id === friendId);
      if (!friend) return false;

      const limit = GIFT_LIMITS[type];

      setIsLoading(true);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // In production: Send via Supabase
        await new Promise((r) => setTimeout(r, 500));

        Alert.alert(
          'Cadeau envoyé!',
          `Vous avez envoyé ${limit.amount} ${type === 'spins' ? 'spins' : 'coins'} à ${friend.username}`
        );
        return true;
      } catch (error) {
        Alert.alert('Erreur', 'Impossible d\'envoyer le cadeau.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [friends]
  );

  // Claim gift
  const claimGift = useCallback(async (giftId: string) => {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift || gift.claimed) return;

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setGifts((prev) =>
      prev.map((g) => (g.id === giftId ? { ...g, claimed: true } : g))
    );

    Alert.alert(
      'Cadeau reçu!',
      `+${gift.amount} ${gift.type === 'spins' ? 'spins' : 'coins'} de ${gift.fromUsername}`
    );
  }, [gifts]);

  // Get online friends count
  const onlineFriendsCount = friends.filter((f) => f.isOnline).length;

  // Get unclaimed gifts count
  const unclaimedGiftsCount = gifts.filter((g) => !g.claimed).length;

  return {
    friends,
    requests,
    gifts,
    isLoading,
    onlineFriendsCount,
    unclaimedGiftsCount,
    sendFriendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    sendGift,
    claimGift,
  };
}
