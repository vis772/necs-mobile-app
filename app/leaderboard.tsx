import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getPlayersByGame, Player } from '@/mocks/players';
import { getTeamById } from '@/mocks/teams';
import { GameType } from '@/constants/games';

interface LeaderboardEntry {
  player: Player;
  value: number | string;
  rank: number;
}

export default function LeaderboardScreen() {
  const params = useLocalSearchParams<{ game: string; statKey: string; statName: string }>();
  const game = params.game as GameType;
  const statKey = params.statKey as string;
  const statName = params.statName as string;

  const players = useMemo(() => getPlayersByGame(game), [game]);

  const leaderboard = useMemo(() => {
    const entries: LeaderboardEntry[] = [];

    players.forEach((player) => {
      let value: number | string = 0;

      if (game === 'valorant' && player.stats.valorant) {
        const stat = player.stats.valorant[statKey as keyof typeof player.stats.valorant];
        value = stat !== undefined ? stat : 0;
      } else if (game === 'smash' && player.stats.smash) {
        const stat = player.stats.smash[statKey as keyof typeof player.stats.smash];
        value = stat !== undefined ? stat : 0;
      } else if (game === 'rocketleague' && player.stats.rocketleague) {
        const stat = player.stats.rocketleague[statKey as keyof typeof player.stats.rocketleague];
        value = stat !== undefined ? stat : 0;
      }

      entries.push({ player, value, rank: 0 });
    });

    entries.sort((a, b) => {
      const aVal = typeof a.value === 'number' ? a.value : 0;
      const bVal = typeof b.value === 'number' ? b.value : 0;
      return bVal - aVal;
    });

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return entries;
  }, [players, game, statKey]);

  const formatValue = (value: number | string): string => {
    if (typeof value === 'string') return value;
    if (statKey === 'headshotPercent' || statKey === 'setWinPercent') {
      return `${value}%`;
    }
    return value.toString();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{statName}</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.leaderboardList}>
          {leaderboard.map((entry) => {
            const team = getTeamById(entry.player.teamId);
            const isTopThree = entry.rank <= 3;

            return (
              <View key={entry.player.id} style={styles.leaderboardRow}>
                <View style={[
                  styles.rankBadge,
                  isTopThree && styles.rankBadgeHighlight,
                ]}>
                  <Text style={[
                    styles.rankText,
                    isTopThree && styles.rankTextHighlight,
                  ]}>
                    {entry.rank}
                  </Text>
                </View>

                <Image
                  source={{ uri: entry.player.image }}
                  style={styles.playerImage}
                />

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {entry.player.name}
                  </Text>
                  {team && (
                    <View style={styles.teamContainer}>
                      <Image
                        source={{ uri: team.image }}
                        style={styles.teamImage}
                      />
                      <Text style={styles.teamName}>{team.name}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.statContainer}>
                  <Text style={[
                    styles.statValue,
                    isTopThree && styles.statValueHighlight,
                  ]}>
                    {formatValue(entry.value)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeArea: {
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  leaderboardList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgeHighlight: {
    backgroundColor: Colors.accent,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gray,
  },
  rankTextHighlight: {
    color: Colors.primary,
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkGray,
    marginRight: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teamImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.darkGray,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  statContainer: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  statValueHighlight: {
    color: Colors.accent,
  },
});
