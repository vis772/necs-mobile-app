import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GAMES } from '@/constants/games';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function GameSelector() {
  const { selectedGame, setSelectedGame } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {GAMES.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.tab,
              selectedGame === game.id && styles.tabActive,
              selectedGame === game.id && { backgroundColor: game.color + '20' },
            ]}
            onPress={() => setSelectedGame(game.id)}
          >
            <Text style={styles.icon}>{game.icon}</Text>
            <Text
              style={[
                styles.tabText,
                selectedGame === game.id && styles.tabTextActive,
                selectedGame === game.id && { color: game.color },
              ]}
            >
              {game.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.accent + '20',
  },
  icon: {
    fontSize: 16,
  },
  tabText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.accent,
  },
});
