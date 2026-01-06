import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Calendar } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { MATCHES, Match } from '@/mocks/matches';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { GameType } from '@/constants/games';

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

const EVENT_DATES = [
  { month: 'May', day: 6, key: '2026-05-06' },
  { month: 'May', day: 7, key: '2026-05-07' },
  { month: 'May', day: 8, key: '2026-05-08' },
  { month: 'May', day: 9, key: '2026-05-09' },
  { month: 'May', day: 10, key: '2026-05-10' },
];

type GameFilterType = 'all' | GameType;

export default function LiveScoresScreen() {
  const { setSelectedGame } = useApp();
  const [selectedDate, setSelectedDate] = useState(EVENT_DATES[0].key);
  const [gameFilter, setGameFilter] = useState<GameFilterType>('all');
  
  const filteredMatches = useMemo(() => {
    let matches = MATCHES.filter(match => match.date === selectedDate);
    
    if (gameFilter !== 'all') {
      matches = matches.filter(match => match.game === gameFilter);
    }
    
    matches.sort((a, b) => {
      const order = { live: 0, upcoming: 1, completed: 2 };
      const statusDiff = order[a.status] - order[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      if (gameFilter === 'all') {
        const gameOrder = { valorant: 0, smash: 1, rocketleague: 2 };
        return gameOrder[a.game] - gameOrder[b.game];
      }
      
      return 0;
    });
    
    return matches;
  }, [gameFilter, selectedDate]);
  
  const groupedMatches = useMemo(() => {
    if (gameFilter !== 'all') return null;
    
    const groups: Record<GameType, Match[]> = {
      valorant: [],
      smash: [],
      rocketleague: [],
    };
    
    filteredMatches.forEach(match => {
      groups[match.game].push(match);
    });
    
    return groups;
  }, [filteredMatches, gameFilter]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Calendar size={28} color={Colors.accent} />
          <Text style={styles.headerTitle}>Live Scores</Text>
        </View>
      </SafeAreaView>

      <View style={styles.gameFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gameFilterContent}
        >
          <TouchableOpacity
            style={[
              styles.gameFilterButton,
              gameFilter === 'all' && styles.gameFilterButtonActive,
            ]}
            onPress={() => setGameFilter('all')}
          >
            <Text
              style={[
                styles.gameFilterText,
                gameFilter === 'all' && styles.gameFilterTextActive,
              ]}
            >
              All Games
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.gameFilterButton,
              gameFilter === 'valorant' && styles.gameFilterButtonActive,
            ]}
            onPress={() => {
              setGameFilter('valorant');
              setSelectedGame('valorant');
            }}
          >
            <Text
              style={[
                styles.gameFilterText,
                gameFilter === 'valorant' && styles.gameFilterTextActive,
              ]}
            >
              Valorant
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.gameFilterButton,
              gameFilter === 'smash' && styles.gameFilterButtonActive,
            ]}
            onPress={() => {
              setGameFilter('smash');
              setSelectedGame('smash');
            }}
          >
            <Text
              style={[
                styles.gameFilterText,
                gameFilter === 'smash' && styles.gameFilterTextActive,
              ]}
            >
              Super Smash Bros
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.gameFilterButton,
              gameFilter === 'rocketleague' && styles.gameFilterButtonActive,
            ]}
            onPress={() => {
              setGameFilter('rocketleague');
              setSelectedGame('rocketleague');
            }}
          >
            <Text
              style={[
                styles.gameFilterText,
                gameFilter === 'rocketleague' && styles.gameFilterTextActive,
              ]}
            >
              Rocket League
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.dateSelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateScrollContent}
        >
          {EVENT_DATES.map((date, index) => {
            const isSelected = date.key === selectedDate;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  isSelected && styles.dateItemActive,
                ]}
                onPress={() => setSelectedDate(date.key)}
              >
                <Text style={[
                  styles.dateMonth,
                  isSelected && styles.dateTextActive,
                ]}>
                  {date.month}
                </Text>
                <Text style={[
                  styles.dateDay,
                  isSelected && styles.dateTextActive,
                ]}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No matches scheduled</Text>
          </View>
        ) : gameFilter === 'all' && groupedMatches ? (
          <View style={styles.matchesList}>
            {groupedMatches.valorant.length > 0 && (
              <View style={styles.gameGroup}>
                <Text style={styles.gameGroupTitle}>VALORANT</Text>
                {groupedMatches.valorant.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </View>
            )}
            {groupedMatches.smash.length > 0 && (
              <View style={styles.gameGroup}>
                <Text style={styles.gameGroupTitle}>SUPER SMASH BROS</Text>
                {groupedMatches.smash.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </View>
            )}
            {groupedMatches.rocketleague.length > 0 && (
              <View style={styles.gameGroup}>
                <Text style={styles.gameGroupTitle}>ROCKET LEAGUE</Text>
                {groupedMatches.rocketleague.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.matchesList}>
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function MatchCard({ match }: { match: Match }) {
  const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);
  
  if (!homeTeam || !awayTeam) return null;

  const handlePress = () => {
    if (match.status === 'completed') {
      router.push({ pathname: '/game-stats' as any, params: { matchId: match.id } });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.matchCard} 
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={match.status !== 'completed'}
    >
      <View style={styles.matchContainer}>
        <View style={styles.teamSide}>
          <Image source={{ uri: homeTeam.image }} style={styles.teamLogo} />
          <Text style={styles.teamName} numberOfLines={1}>{homeTeam.name}</Text>
          <Text style={styles.teamRecord}>
            {homeTeam.record.wins}-{homeTeam.record.losses}
          </Text>
        </View>

        <View style={styles.matchCenter}>
          {match.status === 'live' && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
          
          {match.status !== 'upcoming' ? (
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>{formatScore(match.homeScore)}</Text>
              <Text style={styles.scoreSeparator}>-</Text>
              <Text style={styles.score}>{formatScore(match.awayScore)}</Text>
            </View>
          ) : (
            <Text style={styles.matchTime}>{match.time}</Text>
          )}
          
          {match.round && (
            <Text style={styles.matchRound}>{match.round}</Text>
          )}
          
          {match.streamUrl && match.status === 'live' && (
            <View style={styles.streamBadge}>
              <Text style={styles.streamText}>WATCH</Text>
            </View>
          )}
        </View>

        <View style={styles.teamSide}>
          <Image source={{ uri: awayTeam.image }} style={styles.teamLogo} />
          <Text style={styles.teamName} numberOfLines={1}>{awayTeam.name}</Text>
          <Text style={styles.teamRecord}>
            {awayTeam.record.wins}-{awayTeam.record.losses}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
  dateSelector: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  dateScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
    minWidth: 56,
  },
  dateItemActive: {
    backgroundColor: Colors.accent,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 2,
  },
  dateTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  matchesList: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  matchCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  teamSide: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkGray,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
    maxWidth: 110,
  },
  teamRecord: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  matchCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 6,
    minWidth: 100,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
  },
  scoreSeparator: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.error,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.error,
    letterSpacing: 0.8,
  },
  matchTime: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  matchRound: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streamBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: Colors.accent,
    borderRadius: 4,
    marginTop: 2,
  },
  streamText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.gray,
    fontWeight: '600',
  },
  gameFilterContainer: {
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  gameFilterContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  gameFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  gameFilterButtonActive: {
    backgroundColor: Colors.accent,
  },
  gameFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.gray,
  },
  gameFilterTextActive: {
    color: Colors.primary,
  },
  gameGroup: {
    marginBottom: 28,
  },
  gameGroupTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
});
