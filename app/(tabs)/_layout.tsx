import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

interface TabIconProps {
  emoji: string;
  focused: boolean;
}

function TabIcon({ emoji, focused }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconFocused]}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary[400],
        tabBarInactiveTintColor: colors.navy[400],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jouer',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🎰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="village"
        options={{
          title: 'Village',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="attacks"
        options={{
          title: 'Attaques',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚔️" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: 'Cartes',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🃏" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.navy[800],
    borderTopColor: colors.navy[700],
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    padding: 4,
    borderRadius: 8,
  },
  iconFocused: {
    backgroundColor: colors.primary[500] + '20',
  },
  emoji: {
    fontSize: 24,
    opacity: 0.6,
  },
  emojiFocused: {
    opacity: 1,
  },
});
