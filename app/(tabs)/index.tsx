import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { getMatchesByGame, getLiveMatches } from '@/mocks/matches';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { GAMES } from '@/constants/games';
import { Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

export default function HomeScreen() {
  console.log('[HomeScreen] Rendering...');
  
  const { selectedGame, setSelectedGame } = useApp();
  console.log('[HomeScreen] selectedGame:', selectedGame);
  
  const liveMatches = getLiveMatches(selectedGame);
  console.log('[HomeScreen] liveMatches count:', liveMatches.length);
  
  const upcomingMatches = getMatchesByGame(selectedGame).filter(m => m.status === 'upcoming').slice(0, 5);
  console.log('[HomeScreen] upcomingMatches count:', upcomingMatches.length);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradientBackground}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>NECS 2026</Text>
            <Text style={styles.headerSubtitle}>Nashville, TN • Live</Text>
          </View>
        </SafeAreaView>

        <View style={styles.gameTabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gameTabs}
          >
            {GAMES.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={[
                  styles.gameTab,
                  selectedGame === game.id && styles.gameTabActive
                ]}
                onPress={() => setSelectedGame(game.id)}
              >
                <Text style={[
                  styles.gameTabText,
                  selectedGame === game.id && styles.gameTabTextActive
                ]}>
                  {game.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {liveMatches.length > 0 && (
            <View style={styles.liveSection}>
              {liveMatches.map((match) => (
                <View key={match.id} style={styles.liveCardWrapper}>
                  <FeaturedMatchCard match={match} />
                </View>
              ))}
            </View>
          )}

          {upcomingMatches.length > 0 && (
            <View style={styles.upcomingSection}>
              <Text style={styles.sectionTitle}>UP NEXT</Text>
              {upcomingMatches.map((match) => (
                <CompactMatchCard key={match.id} match={match} />
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

function FeaturedMatchCard({ match }: { match: any }) {
  console.log('[FeaturedMatchCard] Rendering match:', match.id);
  
  const router = useRouter();
  const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    console.warn('[FeaturedMatchCard] Missing team data for match:', match.id);
    return null;
  }

  const statusText = match.status === 'live' ? match.round || 'LIVE' : match.time;

  return (
    <TouchableOpacity style={styles.featuredCard} activeOpacity={0.9}>
      <LinearGradient
        colors={['#1C1C1E', '#000000']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredHeader}>
          {match.status === 'live' && (
            <View style={styles.featuredLiveBadge}>
              <View style={styles.featuredLiveDot} />
              <Text style={styles.featuredLiveText}>LIVE</Text>
            </View>
          )}
          <Text style={styles.featuredRound}>{match.round}</Text>
        </View>

        <View style={styles.featuredMatchup}>
          <View style={styles.featuredTeam}>
            <View style={[styles.featuredTeamImage, { backgroundColor: homeTeam.color }]}>
              <Text style={styles.featuredTeamInitial}>{homeTeam.shortName}</Text>
            </View>
            <Text style={styles.featuredTeamName} numberOfLines={1}>{homeTeam.name}</Text>
            <Text style={styles.featuredTeamRecord}>{homeTeam.record.wins}-{homeTeam.record.losses}</Text>
          </View>

          <View style={styles.featuredScoreArea}>
            <View style={styles.featuredScoreRow}>
              <Text style={styles.featuredScore}>{formatScore(match.homeScore)}</Text>
              <Text style={styles.featuredScoreDash}>–</Text>
              <Text style={styles.featuredScore}>{formatScore(match.awayScore)}</Text>
            </View>
            <Text style={styles.featuredStatus}>{statusText}</Text>
          </View>

          <View style={styles.featuredTeam}>
            <View style={[styles.featuredTeamImage, { backgroundColor: awayTeam.color }]}>
              <Text style={styles.featuredTeamInitial}>{awayTeam.shortName}</Text>
            </View>
            <Text style={styles.featuredTeamName} numberOfLines={1}>{awayTeam.name}</Text>
            <Text style={styles.featuredTeamRecord}>{awayTeam.record.wins}-{awayTeam.record.losses}</Text>
          </View>
        </View>

        {match.streamUrl && match.status === 'live' && (
          <TouchableOpacity 
            style={styles.watchButton}
            onPress={() => router.push({ pathname: '/live-video' as any, params: { matchId: match.id } })}
          >
            <Play size={18} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.watchButtonText}>Watch Now</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

function CompactMatchCard({ match }: { match: any }) {
  const router = useRouter();
  const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    console.warn('[CompactMatchCard] Missing team data for match:', match.id);
    return null;
  }

  const handlePress = () => {
    if (match.status === 'upcoming') {
      router.push({ pathname: '/game-preview' as any, params: { matchId: match.id } });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.compactCard} 
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={match.status !== 'upcoming'}
    >
      <View style={styles.compactHeader}>
        {match.status === 'live' && (
          <View style={styles.compactLiveBadge}>
            <View style={styles.compactLiveDot} />
            <Text style={styles.compactLiveText}>LIVE</Text>
          </View>
        )}
        {match.status === 'upcoming' && (
          <Text style={styles.compactTime}>{match.time}</Text>
        )}
        {match.round && <Text style={styles.compactRound}>{match.round}</Text>}
      </View>

      <View style={styles.compactMatchup}>
        <View style={styles.compactTeamRow}>
          <View style={[styles.compactTeamImage, { backgroundColor: homeTeam.color }]}>
            <Text style={styles.compactTeamInitial}>{homeTeam.shortName}</Text>
          </View>
          <Text style={styles.compactTeamName} numberOfLines={1}>{homeTeam.name}</Text>
          <Text style={styles.compactTeamRecord}>{homeTeam.record.wins}-{homeTeam.record.losses}</Text>
          {match.status !== 'upcoming' && (
            <Text style={styles.compactScore}>{formatScore(match.homeScore)}</Text>
          )}
        </View>

        <View style={styles.compactTeamRow}>
          <View style={[styles.compactTeamImage, { backgroundColor: awayTeam.color }]}>
            <Text style={styles.compactTeamInitial}>{awayTeam.shortName}</Text>
          </View>
          <Text style={styles.compactTeamName} numberOfLines={1}>{awayTeam.name}</Text>
          <Text style={styles.compactTeamRecord}>{awayTeam.record.wins}-{awayTeam.record.losses}</Text>
          {match.status !== 'upcoming' && (
            <Text style={styles.compactScore}>{formatScore(match.awayScore)}</Text>
          )}
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
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 2,
    fontWeight: '700',
  },
  gameTabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  gameTabs: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  gameTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  gameTabActive: {
    backgroundColor: Colors.accent,
  },
  gameTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray,
  },
  gameTabTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  liveSection: {
    paddingTop: 20,
  },
  liveCardWrapper: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  featuredCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 24,
  },
  featuredHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    gap: 8,
  },
  featuredLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.error,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  featuredLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  featuredLiveText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuredRound: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(142, 142, 147, 0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  featuredMatchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 4,
    gap: 16,
  },
  featuredTeam: {
    alignItems: 'center',
    gap: 10,
  },
  featuredTeamImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTeamInitial: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
  featuredScoreArea: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  featuredScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featuredScore: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 52,
  },
  featuredScoreDash: {
    fontSize: 32,
    fontWeight: '700',
    color: 'rgba(142, 142, 147, 0.4)',
  },
  featuredStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(0, 122, 255, 0.8)',
    letterSpacing: 0.5,
  },

  featuredTeamName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
    maxWidth: 90,
  },
  featuredTeamRecord: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(142, 142, 147, 0.5)',
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 8,
  },
  watchButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },

  upcomingSection: {
    paddingTop: 32,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  compactCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  compactLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  compactLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.error,
  },
  compactLiveText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.error,
    letterSpacing: 0.8,
  },
  compactTime: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(142, 142, 147, 0.7)',
  },
  compactRound: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(0, 122, 255, 0.7)',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  compactMatchup: {
    gap: 12,
  },
  compactTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactTeamImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTeamInitial: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  compactTeamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  compactTeamRecord: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(142, 142, 147, 0.6)',
    marginRight: 12,
    minWidth: 32,
  },
  compactScore: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    minWidth: 24,
    textAlign: 'right' as const,
  },
});
