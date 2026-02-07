import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';

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
        tabBarActiveTintColor: '#F2D58C',
        tabBarInactiveTintColor: '#B5945D',
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
        name="social"
        options={{
          title: 'Social',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          href: null,
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
    backgroundColor: '#2A1911',
    borderTopColor: '#835A2A',
    borderTopWidth: 2,
    height: 84,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  iconContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconFocused: {
    backgroundColor: '#3A2418',
    borderColor: '#D5A645',
  },
  emoji: {
    fontSize: 22,
    opacity: 0.75,
  },
  emojiFocused: {
    opacity: 1,
  },
});
