import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Guild,
  GuildMember,
  ChatMessage,
  GuildBoss,
  GuildRole,
  generateMockGuild,
} from '@/types/social';
import { useAuth } from '@/lib/auth';

// Mock chat messages
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    guildId: 'guild-1',
    playerId: 'player-1',
    username: 'DragonSlayer',
    avatarUrl: null,
    content: 'Salut tout le monde!',
    type: 'text',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    isSystem: false,
  },
  {
    id: '2',
    guildId: 'guild-1',
    playerId: 'system',
    username: 'System',
    avatarUrl: null,
    content: 'CoinMaster a rejoint la guilde!',
    type: 'join',
    timestamp: new Date(Date.now() - 200000).toISOString(),
    isSystem: true,
  },
  {
    id: '3',
    guildId: 'guild-1',
    playerId: 'player-2',
    username: 'CoinMaster',
    avatarUrl: null,
    content: 'Merci de m\'avoir accepté!',
    type: 'text',
    timestamp: new Date(Date.now() - 100000).toISOString(),
    isSystem: false,
  },
];

// Mock boss
const MOCK_BOSS: GuildBoss = {
  id: 'boss-1',
  guildId: 'guild-1',
  name: 'Dragon des Ténèbres',
  emoji: '🐉',
  maxHp: 1000000,
  currentHp: 650000,
  startsAt: new Date(Date.now() - 86400000).toISOString(),
  endsAt: new Date(Date.now() + 5 * 86400000).toISOString(),
  defeated: false,
  rewards: [
    { rank: 1, coins: 100000, gems: 50, chestType: 'large' },
    { rank: 2, coins: 50000, gems: 25, chestType: 'medium' },
    { rank: 3, coins: 25000, gems: 10, chestType: 'small' },
    { rank: 0, coins: 10000, gems: 5, chestType: null },
  ],
};

export function useGuild() {
  const { player, stats } = useAuth();

  const [guild, setGuild] = useState<Guild | null>(() => generateMockGuild());
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [boss, setBoss] = useState<GuildBoss | null>(MOCK_BOSS);
  const [myRole, setMyRole] = useState<GuildRole>('member');
  const [isLoading, setIsLoading] = useState(false);

  // Load guild members on mount
  useEffect(() => {
    if (guild) {
      // Generate mock members
      const mockMembers: GuildMember[] = [
        {
          playerId: 'leader-1',
          username: 'ChampionKing',
          avatarUrl: null,
          level: 25,
          role: 'leader',
          joinedAt: guild.createdAt,
          lastActive: new Date().toISOString(),
          weeklyDonations: 150,
          weeklyBossDamage: 250000,
        },
        {
          playerId: player?.id ?? 'me',
          username: player?.username ?? 'Moi',
          avatarUrl: null,
          level: stats?.districtsCompleted ?? 1,
          role: 'member',
          joinedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
          lastActive: new Date().toISOString(),
          weeklyDonations: 25,
          weeklyBossDamage: 50000,
        },
      ];
      setMembers(mockMembers);
    }
  }, [guild, player, stats]);

  // Send chat message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!guild || !player || content.trim().length === 0) return;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        guildId: guild.id,
        playerId: player.id,
        username: player.username,
        avatarUrl: player.avatarUrl,
        content: content.trim(),
        type: 'text',
        timestamp: new Date().toISOString(),
        isSystem: false,
      };

      setMessages((prev) => [...prev, newMessage]);

      // In production: Send via Supabase realtime
    },
    [guild, player]
  );

  // Attack boss
  const attackBoss = useCallback(async () => {
    if (!boss || boss.defeated || !stats) {
      Alert.alert('Impossible', 'Pas de boss actif.');
      return;
    }

    if (stats.spins < 10) {
      Alert.alert('Pas assez de spins', 'Il vous faut 10 spins pour attaquer le boss.');
      return;
    }

    setIsLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // Calculate damage based on level
      const level = stats.districtsCompleted + 1;
      const damage = level * 1000 + Math.floor(Math.random() * 5000);

      await new Promise((r) => setTimeout(r, 1000));

      // Update boss HP
      const newHp = Math.max(0, boss.currentHp - damage);
      const defeated = newHp <= 0;

      setBoss((prev) =>
        prev ? { ...prev, currentHp: newHp, defeated } : null
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (defeated) {
        Alert.alert('🎉 Boss vaincu!', 'Félicitations! Récupérez vos récompenses!');
      } else {
        Alert.alert(
          '💥 Attaque!',
          `Vous avez infligé ${damage.toLocaleString()} dégâts au boss!`
        );
      }

      // In production: Update via Supabase and deduct spins
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'attaquer le boss.');
    } finally {
      setIsLoading(false);
    }
  }, [boss, stats]);

  // Donate to guild
  const donate = useCallback(
    async (type: 'spins' | 'coins', amount: number) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Add system message
      const systemMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        guildId: guild?.id ?? '',
        playerId: 'system',
        username: 'System',
        avatarUrl: null,
        content: `${player?.username} a donné ${amount} ${type}!`,
        type: 'gift',
        timestamp: new Date().toISOString(),
        isSystem: true,
      };

      setMessages((prev) => [...prev, systemMessage]);

      Alert.alert('Don effectué!', `Merci pour votre générosité!`);

      // In production: Update via Supabase
    },
    [guild, player]
  );

  // Leave guild
  const leaveGuild = useCallback(() => {
    Alert.alert(
      'Quitter la guilde',
      'Êtes-vous sûr de vouloir quitter la guilde?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setGuild(null);
            setMembers([]);
            setMessages([]);
            setBoss(null);
          },
        },
      ]
    );
  }, []);

  // Boss progress percentage
  const bossProgress = boss
    ? ((boss.maxHp - boss.currentHp) / boss.maxHp)
    : 0;

  return {
    guild,
    members,
    messages,
    boss,
    myRole,
    isLoading,
    bossProgress,
    sendMessage,
    attackBoss,
    donate,
    leaveGuild,
  };
}
