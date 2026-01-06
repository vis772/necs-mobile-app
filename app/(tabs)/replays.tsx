import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MATCHES } from '@/mocks/matches';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { GAMES, GameType } from '@/constants/games';

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

type FilterType = 'all' | GameType;

export default function ReplaysScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const completedMatches = MATCHES.filter(match => match.status === 'completed');
  
  const filteredMatches = selectedFilter === 'all' 
    ? completedMatches
    : completedMatches.filter(match => match.game === selectedFilter);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Play size={28} color={Colors.accent} />
          <Text style={styles.headerTitle}>Match Replays</Text>
        </View>
      </SafeAreaView>

      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'all' && styles.filterTabTextActive,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.filterTab,
                selectedFilter === game.id && styles.filterTabActive,
                selectedFilter === game.id && { backgroundColor: game.color + '20' },
              ]}
              onPress={() => setSelectedFilter(game.id)}
            >
              <Text style={styles.filterIcon}>{game.icon}</Text>
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === game.id && styles.filterTabTextActive,
                  selectedFilter === game.id && { color: game.color },
                ]}
              >
                {game.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.replaysList}>
          {filteredMatches.map((match) => {
            const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
            const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);
            const game = GAMES.find(g => g.id === match.game);
            
            if (!homeTeam || !awayTeam || !game) return null;

            const isHighProfile = match.homeScore + match.awayScore > 20 || match.round?.includes('Final');
            const duration = `${Math.floor(Math.random() * 20 + 35)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;

            return (
              <TouchableOpacity 
                key={match.id} 
                style={styles.replayCard}
                onPress={() => router.push(`/replay-video?matchId=${match.id}` as any)}
              >
                <View style={styles.replayHeader}>
                  <View style={styles.gameIndicator}>
                    <Text style={styles.gameIcon}>{game.icon}</Text>
                    {selectedFilter === 'all' && (
                      <Text style={[styles.gameName, { color: game.color }]}>
                        {game.shortName}
                      </Text>
                    )}
                  </View>
                  {isHighProfile && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>Top Match</Text>
                    </View>
                  )}
                </View>

                <View style={styles.matchupContainer}>
                  <View style={styles.team}>
                    <Image source={{ uri: homeTeam.image }} style={styles.teamLogo} />
                    <Text style={styles.teamName} numberOfLines={1}>{homeTeam.name}</Text>
                    <Text style={styles.teamScore}>{formatScore(match.homeScore)}</Text>
                  </View>

                  <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>vs</Text>
                  </View>

                  <View style={styles.team}>
                    <Image source={{ uri: awayTeam.image }} style={styles.teamLogo} />
                    <Text style={styles.teamName} numberOfLines={1}>{awayTeam.name}</Text>
                    <Text style={styles.teamScore}>{formatScore(match.awayScore)}</Text>
                  </View>
                </View>

                <View style={styles.replayFooter}>
                  <View style={styles.matchInfo}>
                    <Text style={styles.matchDate}>{match.date}</Text>
                    {match.round && (
                      <>
                        <Text style={styles.separator}>•</Text>
                        <Text style={styles.matchRound}>{match.round}</Text>
                      </>
                    )}
                    <Text style={styles.separator}>•</Text>
                    <Text style={styles.matchDuration}>{duration}</Text>
                  </View>
                  <View style={styles.playButton}>
                    <Play size={16} color={Colors.white} fill={Colors.white} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  filterContainer: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: Colors.accent + '20',
  },
  filterIcon: {
    fontSize: 16,
  },
  filterTabText: {
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: Colors.accent,
  },
  content: {
    flex: 1,
  },
  replaysList: {
    padding: 16,
    gap: 12,
  },
  replayCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  replayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameIcon: {
    fontSize: 16,
  },
  gameName: {
    fontSize: 13,
    fontWeight: '700',
  },
  tag: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  matchupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  team: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.darkGray,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
    maxWidth: 100,
  },
  teamScore: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  replayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchDate: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  separator: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  matchRound: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  matchDuration: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
