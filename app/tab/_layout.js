import { Tabs } from 'expo-router';
import { COLORS, FONT } from '../../style/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ScreenLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: 'rgb(0, 0, 0)',
        tabBarLabelStyle: {
          fontFamily: FONT.bodyBold,
          fontSize: 12,
          color: COLORS.lightGrey
        },
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
          title: 'BUSCAR',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="compare"
        options={{
          title: 'COMPARAR',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="git-compare-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}