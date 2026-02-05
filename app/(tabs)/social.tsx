import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { Card, Button, ProgressBar } from '@/components/ui';
import { useFriends, useGuild } from '@/hooks';
import { formatLastSeen } from '@/types/social';

type Tab = 'friends' | 'guild';

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('friends');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Tab Header */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            👥 Amis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'guild' && styles.activeTab]}
          onPress={() => setActiveTab('guild')}
        >
          <Text style={[styles.tabText, activeTab === 'guild' && styles.activeTabText]}>
            🏰 Guilde
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'friends' ? <FriendsTab /> : <GuildTab />}
    </SafeAreaView>
  );
}

function FriendsTab() {
  const {
    friends,
    requests,
    gifts,
    isLoading,
    onlineFriendsCount,
    unclaimedGiftsCount,
    sendGift,
    removeFriend,
  } = useFriends();

  const [searchUsername, setSearchUsername] = useState('');

  return (
    <ScrollView style={styles.content}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBadge}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statValue}>{friends.length}</Text>
          <Text style={styles.statLabel}>Amis</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statEmoji}>🟢</Text>
          <Text style={styles.statValue}>{onlineFriendsCount}</Text>
          <Text style={styles.statLabel}>En ligne</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statEmoji}>🎁</Text>
          <Text style={styles.statValue}>{unclaimedGiftsCount}</Text>
          <Text style={styles.statLabel}>Cadeaux</Text>
        </View>
      </View>

      {/* Add Friend */}
      <Card style={styles.addFriendCard}>
        <Text style={styles.sectionTitle}>Ajouter un ami</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pseudo..."
            placeholderTextColor={colors.navy[500]}
            value={searchUsername}
            onChangeText={setSearchUsername}
          />
          <Button
            title="Ajouter"
            onPress={() => {}}
            size="sm"
            disabled={searchUsername.length < 3}
          />
        </View>
      </Card>

      {/* Pending Requests */}
      {requests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demandes ({requests.length})</Text>
          {requests.map((req) => (
            <Card key={req.id} variant="elevated" style={styles.requestCard}>
              <View style={styles.friendInfo}>
                <Text style={styles.avatar}>👤</Text>
                <View>
                  <Text style={styles.friendName}>{req.fromUsername}</Text>
                  <Text style={styles.friendLevel}>Niveau {req.fromLevel}</Text>
                </View>
              </View>
              <View style={styles.requestActions}>
                <Button title="✓" onPress={() => {}} size="sm" />
                <Button title="✕" onPress={() => {}} variant="secondary" size="sm" />
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Friends List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes amis</Text>
        {friends.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Ajoutez des amis pour échanger des cadeaux!
            </Text>
          </Card>
        ) : (
          friends.map((friend) => (
            <Card key={friend.id} variant="elevated" style={styles.friendCard}>
              <View style={styles.friendInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>👤</Text>
                  {friend.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{friend.username}</Text>
                  <Text style={styles.friendLevel}>
                    Niv. {friend.level} • {formatLastSeen(friend.lastSeen)}
                  </Text>
                  {friend.guildName && (
                    <Text style={styles.friendGuild}>[{friend.guildName}]</Text>
                  )}
                </View>
              </View>
              <View style={styles.friendActions}>
                <TouchableOpacity
                  style={styles.giftButton}
                  onPress={() => sendGift(friend.id, 'spins')}
                >
                  <Text style={styles.giftEmoji}>🎁</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function GuildTab() {
  const {
    guild,
    members,
    messages,
    boss,
    bossProgress,
    isLoading,
    sendMessage,
    attackBoss,
  } = useGuild();

  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  if (!guild) {
    return (
      <View style={styles.noGuildContainer}>
        <Text style={styles.noGuildEmoji}>🏰</Text>
        <Text style={styles.noGuildTitle}>Pas de guilde</Text>
        <Text style={styles.noGuildText}>
          Rejoignez ou créez une guilde pour jouer en équipe!
        </Text>
        <Button title="Chercher une guilde" onPress={() => {}} />
        <Button
          title="Créer une guilde (100 💎)"
          onPress={() => {}}
          variant="secondary"
          style={{ marginTop: spacing.sm }}
        />
      </View>
    );
  }

  return (
    <View style={styles.guildContainer}>
      {/* Guild Header */}
      <Card variant="elevated" style={styles.guildHeader}>
        <View style={styles.guildInfo}>
          <Text style={styles.guildName}>[{guild.tag}] {guild.name}</Text>
          <Text style={styles.guildStats}>
            {guild.memberCount}/{guild.maxMembers} membres • Niv. {guild.level}
          </Text>
        </View>
      </Card>

      {/* Boss Section */}
      {boss && !boss.defeated && (
        <Card variant="elevated" style={styles.bossCard}>
          <View style={styles.bossHeader}>
            <Text style={styles.bossEmoji}>{boss.emoji}</Text>
            <View style={styles.bossInfo}>
              <Text style={styles.bossName}>{boss.name}</Text>
              <Text style={styles.bossHp}>
                {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP
              </Text>
            </View>
            <Button
              title="Attaquer"
              onPress={attackBoss}
              size="sm"
              loading={isLoading}
            />
          </View>
          <ProgressBar
            progress={bossProgress}
            height={10}
            color={colors.danger[500]}
          />
        </Card>
      )}

      {/* Chat */}
      <View style={styles.chatContainer}>
        <ScrollView style={styles.chatMessages}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.chatMessage,
                msg.isSystem && styles.systemMessage,
              ]}
            >
              {!msg.isSystem && (
                <Text style={styles.chatUsername}>{msg.username}</Text>
              )}
              <Text
                style={[
                  styles.chatContent,
                  msg.isSystem && styles.systemContent,
                ]}
              >
                {msg.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            placeholder="Message..."
            placeholderTextColor={colors.navy[500]}
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendMessage}
          />
          <Button title="→" onPress={handleSendMessage} size="sm" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy[900],
  },
  tabHeader: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.navy[800],
  },
  activeTab: {
    backgroundColor: colors.primary[500],
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.navy[400],
  },
  activeTabText: {
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  statBadge: {
    alignItems: 'center',
    backgroundColor: colors.navy[800],
    padding: spacing.md,
    borderRadius: 12,
    minWidth: 80,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.white,
  },
  statLabel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  addFriendCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.navy[700],
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.white,
  },
  section: {
    marginBottom: spacing.lg,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    fontSize: 36,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.navy[800],
  },
  friendDetails: {
    gap: 2,
  },
  friendName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  friendLevel: {
    ...typography.caption,
    color: colors.navy[400],
  },
  friendGuild: {
    ...typography.caption,
    color: colors.primary[400],
  },
  friendActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  giftButton: {
    padding: spacing.sm,
    backgroundColor: colors.navy[700],
    borderRadius: 8,
  },
  giftEmoji: {
    fontSize: 20,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.navy[400],
    textAlign: 'center',
  },
  noGuildContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  noGuildEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  noGuildTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  noGuildText: {
    ...typography.body,
    color: colors.navy[400],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  guildContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  guildHeader: {
    marginBottom: spacing.md,
  },
  guildInfo: {
    gap: spacing.xs,
  },
  guildName: {
    ...typography.h3,
    color: colors.white,
  },
  guildStats: {
    ...typography.caption,
    color: colors.navy[400],
  },
  bossCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.danger[500] + '20',
    borderWidth: 1,
    borderColor: colors.danger[500],
  },
  bossHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bossEmoji: {
    fontSize: 40,
  },
  bossInfo: {
    flex: 1,
  },
  bossName: {
    ...typography.bodyBold,
    color: colors.white,
  },
  bossHp: {
    ...typography.caption,
    color: colors.danger[400],
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.navy[800],
    borderRadius: 12,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  chatMessages: {
    flex: 1,
    padding: spacing.sm,
  },
  chatMessage: {
    marginBottom: spacing.sm,
  },
  systemMessage: {
    alignItems: 'center',
  },
  chatUsername: {
    ...typography.captionBold,
    color: colors.primary[400],
  },
  chatContent: {
    ...typography.body,
    color: colors.white,
  },
  systemContent: {
    ...typography.caption,
    color: colors.navy[400],
    fontStyle: 'italic',
  },
  chatInputRow: {
    flexDirection: 'row',
    padding: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.navy[700],
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.navy[700],
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.white,
  },
});
