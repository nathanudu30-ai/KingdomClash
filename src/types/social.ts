// Friend types
export interface Friend {
  id: string;
  odId: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  districtsCompleted: number;
  isOnline: boolean;
  lastSeen: string;
  guildName: string | null;
}

export interface FriendRequest {
  id: string;
  fromPlayerId: string;
  fromUsername: string;
  fromAvatarUrl: string | null;
  fromLevel: number;
  sentAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Gift types
export interface Gift {
  id: string;
  type: 'spins' | 'coins';
  amount: number;
  fromPlayerId: string;
  fromUsername: string;
  sentAt: string;
  claimed: boolean;
}

export const GIFT_LIMITS = {
  spins: { amount: 5, maxPerDay: 5, cooldownHours: 1 },
  coins: { amount: 10000, maxPerDay: 5, cooldownHours: 1 },
};

// Guild types
export interface Guild {
  id: string;
  name: string;
  tag: string; // 3-4 letter tag
  description: string;
  emblemId: number;
  leaderId: string;
  leaderUsername: string;
  memberCount: number;
  maxMembers: number;
  level: number;
  xp: number;
  type: GuildType;
  minLevelRequired: number;
  language: string;
  createdAt: string;
}

export type GuildType = 'open' | 'invite_only' | 'closed';

export interface GuildMember {
  playerId: string;
  username: string;
  avatarUrl: string | null;
  level: number;
  role: GuildRole;
  joinedAt: string;
  lastActive: string;
  weeklyDonations: number;
  weeklyBossDamage: number;
}

export type GuildRole = 'leader' | 'co_leader' | 'elder' | 'member';

export const GUILD_ROLE_PERMISSIONS: Record<GuildRole, string[]> = {
  leader: ['kick', 'promote', 'demote', 'edit_settings', 'delete_message', 'mute'],
  co_leader: ['kick', 'promote', 'demote', 'delete_message', 'mute'],
  elder: ['mute_1h', 'delete_message'],
  member: [],
};

// Chat types
export interface ChatMessage {
  id: string;
  guildId: string;
  playerId: string;
  username: string;
  avatarUrl: string | null;
  content: string;
  type: MessageType;
  timestamp: string;
  isSystem: boolean;
}

export type MessageType = 'text' | 'system' | 'gift' | 'boss_damage' | 'join' | 'leave';

// Boss raid types
export interface GuildBoss {
  id: string;
  guildId: string;
  name: string;
  emoji: string;
  maxHp: number;
  currentHp: number;
  startsAt: string;
  endsAt: string;
  defeated: boolean;
  rewards: BossReward[];
}

export interface BossReward {
  rank: number; // 1, 2, 3, or 0 for participation
  coins: number;
  gems: number;
  chestType: 'small' | 'medium' | 'large' | null;
}

export interface BossAttack {
  playerId: string;
  username: string;
  damage: number;
  timestamp: string;
}

// Guild war types
export interface GuildWar {
  id: string;
  guildId: string;
  opponentGuildId: string;
  opponentGuildName: string;
  opponentGuildTag: string;
  status: WarStatus;
  ourStars: number;
  theirStars: number;
  startsAt: string;
  endsAt: string;
  attacksUsed: number;
  maxAttacks: number;
}

export type WarStatus = 'preparation' | 'active' | 'ended';

// Generate mock friends
export function generateMockFriends(): Friend[] {
  const names = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn'];
  return names.slice(0, 5).map((name, i) => ({
    id: `friend-${i}`,
    odId: `player-${i}`,
    username: name + Math.floor(Math.random() * 100),
    avatarUrl: null,
    level: Math.floor(Math.random() * 15) + 1,
    districtsCompleted: Math.floor(Math.random() * 10),
    isOnline: Math.random() > 0.5,
    lastSeen: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    guildName: Math.random() > 0.5 ? 'Warriors' : null,
  }));
}

// Generate mock guild
export function generateMockGuild(): Guild {
  return {
    id: 'guild-1',
    name: 'Les Champions',
    tag: 'CHP',
    description: 'Guilde active et amicale. Participez aux boss raids!',
    emblemId: 1,
    leaderId: 'leader-1',
    leaderUsername: 'ChampionKing',
    memberCount: 23,
    maxMembers: 30,
    level: 5,
    xp: 4500,
    type: 'open',
    minLevelRequired: 3,
    language: 'fr',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  };
}

// Format last seen time
export function formatLastSeen(lastSeen: string): string {
  const diff = Date.now() - new Date(lastSeen).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'En ligne';
  if (minutes < 60) return `Il y a ${minutes}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${days}j`;
}
