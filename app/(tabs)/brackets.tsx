import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Trophy } from 'lucide-react-native';
import GameSelector from '@/components/GameSelector';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { MATCHES } from '@/mocks/matches';

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

export default function BracketsScreen() {
  const { selectedGame } = useApp();
  
  const bracketData = useMemo(() => {
    const gameMatches = MATCHES.filter(match => match.game === selectedGame);
    
    const roundRobin = gameMatches.filter(m => m.round === 'Round Robin');
    const eliminators = gameMatches.filter(m => m.round === 'Eliminator');
    const semifinals = gameMatches.filter(m => m.round?.includes('Semifinal'));
    const finals = gameMatches.filter(m => m.round === 'Grand Final');
    
    return {
      roundRobin,
      eliminators,
      semifinals,
      finals,
    };
  }, [selectedGame]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Trophy size={28} color={Colors.accent} />
          <Text style={styles.headerTitle}>Tournament Bracket</Text>
        </View>
      </SafeAreaView>

      <GameSelector />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalContent}
      >
        <ScrollView
          style={styles.verticalScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bracketContainer}>
            <View style={styles.bracketColumn}>
              <Text style={styles.roundTitle}>ROUND ROBIN</Text>
              <View style={styles.matchColumn}>
                {bracketData.roundRobin.map((match) => (
                  <BracketCard key={match.id} match={match} size="small" />
                ))}
              </View>
            </View>

            <View style={styles.connectorColumn}>
              {bracketData.roundRobin.length > 0 && (
                <View style={styles.connectorGroup}>
                  <View style={styles.bracketLine} />
                </View>
              )}
            </View>

            <View style={styles.bracketColumn}>
              <Text style={styles.roundTitle}>ELIMINATOR</Text>
              <View style={styles.matchColumn}>
                {bracketData.eliminators.map((match) => (
                  <BracketCard key={match.id} match={match} />
                ))}
              </View>
            </View>

            <View style={styles.connectorColumn}>
              {bracketData.eliminators.length >= 2 && (
                <View style={styles.connectorGroup}>
                  <View style={styles.bracketLine} />
                </View>
              )}
            </View>

            <View style={styles.bracketColumn}>
              <Text style={styles.roundTitle}>SEMIFINAL</Text>
              <View style={styles.matchColumn}>
                {bracketData.semifinals.map((match) => (
                  <BracketCard key={match.id} match={match} size="large" />
                ))}
              </View>
            </View>

            <View style={styles.connectorColumn}>
              {bracketData.semifinals.length >= 1 && (
                <View style={styles.connectorSingle}>
                  <View style={styles.bracketLineSingle} />
                </View>
              )}
            </View>

            <View style={styles.bracketColumn}>
              <Text style={styles.roundTitle}>FINAL</Text>
              <View style={styles.matchColumn}>
                {bracketData.finals.map((match) => (
                  <BracketCard key={match.id} match={match} size="large" champion />
                ))}
              </View>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function BracketCard({ match, size = 'normal', champion = false }: { match: any; size?: 'normal' | 'large' | 'small'; champion?: boolean }) {
  const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);
  
  if (!homeTeam || !awayTeam) return null;

  const isHomeWinner = match.status === 'completed' && match.homeScore > match.awayScore;
  const isAwayWinner = match.status === 'completed' && match.awayScore > match.homeScore;
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.bracketCard, 
      isLarge && styles.bracketCardLarge,
      isSmall && styles.bracketCardSmall
    ]}>
      {match.status === 'live' && (
        <View style={styles.liveIndicator}>
          <View style={styles.liveDotSmall} />
          <Text style={styles.liveTextSmall}>LIVE</Text>
        </View>
      )}
      
      <View style={[
        styles.bracketTeam,
        isHomeWinner && styles.bracketTeamWinner,
      ]}>
        <Image source={{ uri: homeTeam.image }} style={[
          styles.bracketLogo,
          isSmall && styles.bracketLogoSmall
        ]} />
        <Text style={[
          styles.bracketTeamName,
          isHomeWinner && styles.bracketTeamNameWinner,
          isSmall && styles.bracketTeamNameSmall
        ]} numberOfLines={1}>
          {isSmall ? homeTeam.shortName : homeTeam.name}
        </Text>
        {match.status !== 'upcoming' && (
          <Text style={[
            styles.bracketScore,
            isHomeWinner && styles.bracketScoreWinner,
            isSmall && styles.bracketScoreSmall
          ]}>
            {formatScore(match.homeScore)}
          </Text>
        )}
      </View>

      <View style={styles.bracketDivider} />

      <View style={[
        styles.bracketTeam,
        isAwayWinner && styles.bracketTeamWinner,
      ]}>
        <Image source={{ uri: awayTeam.image }} style={[
          styles.bracketLogo,
          isSmall && styles.bracketLogoSmall
        ]} />
        <Text style={[
          styles.bracketTeamName,
          isAwayWinner && styles.bracketTeamNameWinner,
          isSmall && styles.bracketTeamNameSmall
        ]} numberOfLines={1}>
          {isSmall ? awayTeam.shortName : awayTeam.name}
        </Text>
        {match.status !== 'upcoming' && (
          <Text style={[
            styles.bracketScore,
            isAwayWinner && styles.bracketScoreWinner,
            isSmall && styles.bracketScoreSmall
          ]}>
            {formatScore(match.awayScore)}
          </Text>
        )}
      </View>
      
      {champion && isHomeWinner && (
        <View style={styles.championBadge}>
          <Trophy size={14} color={Colors.warning} />
          <Text style={styles.championText}>CHAMPION</Text>
        </View>
      )}
      {champion && isAwayWinner && (
        <View style={styles.championBadge}>
          <Trophy size={14} color={Colors.warning} />
          <Text style={styles.championText}>CHAMPION</Text>
        </View>
      )}
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
  horizontalContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  verticalScroll: {
    flex: 1,
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 500,
  },
  bracketColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  matchColumn: {
    gap: 12,
  },
  bracketCard: {
    width: 180,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  bracketCardLarge: {
    width: 200,
  },
  bracketCardSmall: {
    width: 140,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    backgroundColor: Colors.error,
  },
  liveDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.white,
  },
  liveTextSmall: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.8,
  },
  bracketTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    backgroundColor: Colors.secondary,
  },
  bracketTeamWinner: {
    backgroundColor: Colors.tertiary,
  },
  bracketLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.darkGray,
  },
  bracketLogoSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  bracketTeamName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
  },
  bracketTeamNameSmall: {
    fontSize: 11,
  },
  bracketTeamNameWinner: {
    color: Colors.white,
    fontWeight: '800',
  },
  bracketScore: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.gray,
    minWidth: 28,
    textAlign: 'right' as const,
  },
  bracketScoreSmall: {
    fontSize: 14,
    minWidth: 22,
  },
  bracketScoreWinner: {
    color: Colors.white,
  },
  bracketDivider: {
    height: 1,
    backgroundColor: Colors.darkGray,
  },
  connectorColumn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorGroup: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bracketLine: {
    width: 50,
    height: 2,
    backgroundColor: Colors.darkGray,
  },
  connectorSingle: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bracketLineSingle: {
    width: 50,
    height: 2,
    backgroundColor: Colors.darkGray,
  },
  championBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: Colors.warning + '20',
  },
  championText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.warning,
    letterSpacing: 1,
  },
});
