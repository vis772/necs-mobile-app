import { Tabs } from 'expo-router';
import { Home, TrendingUp, BarChart3, Trophy, MessageCircle, Play, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopColor: Colors.secondary,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="news"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="replays"
        options={{
          title: 'Replays',
          tabBarIcon: ({ color, size }) => <Play size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: 'Scores',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.homeIconContainer}>
              <View style={[styles.homeGlow, focused && styles.homeGlowActive]} />
              <Home size={size} color={color} style={{ zIndex: 1 }} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="brackets"
        options={{
          title: 'Brackets',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeGlow: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    opacity: 0.15,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  homeGlowActive: {
    opacity: 0.2,
    shadowOpacity: 0.4,
    shadowRadius: 14,
  },
});
