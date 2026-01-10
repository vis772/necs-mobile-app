import React, { useState } from 'react';
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
import { Play, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

interface Story {
  id: string;
  title: string;
  thumbnail: string;
  viewed: boolean;
  type: 'highlight' | 'player' | 'team' | 'stats';
}

const STORIES: Story[] = [
  { id: '1', title: 'Top Plays', thumbnail: '#FF4655', viewed: false, type: 'highlight' },
  { id: '2', title: 'Team Stats', thumbnail: '#00D9FF', viewed: false, type: 'stats' },
  { id: '3', title: 'Live Updates', thumbnail: '#FFC700', viewed: false, type: 'team' },
  { id: '4', title: 'MVP Moments', thumbnail: '#BD3FE1', viewed: true, type: 'player' },
  { id: '5', title: 'Highlights', thumbnail: '#FF6B00', viewed: false, type: 'highlight' },
];

export default function HomeScreen() {
  console.log('[HomeScreen] Rendering...');
  
  const { selectedGame, setSelectedGame } = useApp();
  console.log('[HomeScreen] selectedGame:', selectedGame);
  
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  
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
          <View style={styles.storiesSection}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesContainer}
            >
              {stories.map((story) => (
                <TouchableOpacity
                  key={story.id}
                  style={styles.storyItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setActiveStory(story);
                    setStories(prev => 
                      prev.map(s => s.id === story.id ? { ...s, viewed: true } : s)
                    );
                  }}
                >
                  <LinearGradient
                    colors={story.viewed ? ['#3A3A3C', '#3A3A3C'] : ['#FF4655', '#BD3FE1', '#00D9FF']}
                    style={styles.storyGradientBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.storyInnerBorder}>
                      <View style={styles.storyAvatar}>
                        <Text style={styles.storyAvatarText}>{story.title[0]}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                  <Text style={styles.storyLabel} numberOfLines={1}>{story.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

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

        {activeStory && (
          <StoryViewer 
            story={activeStory} 
            onClose={() => setActiveStory(null)}
            onNext={() => {
              const currentIndex = stories.findIndex(s => s.id === activeStory.id);
              if (currentIndex < stories.length - 1) {
                setActiveStory(stories[currentIndex + 1]);
              } else {
                setActiveStory(null);
              }
            }}
            onPrevious={() => {
              const currentIndex = stories.findIndex(s => s.id === activeStory.id);
              if (currentIndex > 0) {
                setActiveStory(stories[currentIndex - 1]);
              }
            }}
          />
        )}
      </LinearGradient>
    </View>
  );
}

function StoryViewer({ story, onClose, onNext, onPrevious }: { 
  story: Story; 
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const [progress, setProgress] = useState<number>(0);

  React.useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          onNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story.id, onNext]);

  return (
    <View style={styles.storyViewerContainer}>
      <LinearGradient
        colors={['#000000', '#1C1C1E']}
        style={styles.storyViewerGradient}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.storyViewerSafeArea}>
          <View style={styles.storyProgressBar}>
            <View style={[styles.storyProgressFill, { width: `${progress}%` }]} />
          </View>

          <View style={styles.storyHeader}>
            <View style={styles.storyHeaderLeft}>
              <View style={[styles.storyHeaderAvatar, { backgroundColor: story.thumbnail }]}>
                <Text style={styles.storyHeaderAvatarText}>{story.title[0]}</Text>
              </View>
              <Text style={styles.storyHeaderTitle}>{story.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.storyCloseButton}>
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.storyContent}>
            <View style={[styles.storyContentPreview, { backgroundColor: story.thumbnail }]}>
              <Text style={styles.storyContentText}>🔥</Text>
              <Text style={styles.storyContentTitle}>{story.title}</Text>
              <Text style={styles.storyContentSubtitle}>Tap sides to navigate</Text>
            </View>
          </View>

          <View style={styles.storyNavigationArea}>
            <TouchableOpacity 
              style={styles.storyNavLeft}
              onPress={onPrevious}
              activeOpacity={1}
            />
            <TouchableOpacity 
              style={styles.storyNavRight}
              onPress={onNext}
              activeOpacity={1}
            />
          </View>
        </SafeAreaView>
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

  storiesSection: {
    paddingTop: 16,
    paddingBottom: 4,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    gap: 8,
  },
  storyGradientBorder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2.5,
  },
  storyInnerBorder: {
    flex: 1,
    borderRadius: 25.5,
    backgroundColor: Colors.primary,
    padding: 2.5,
  },
  storyAvatar: {
    flex: 1,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
  },
  storyAvatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8E8E93',
  },
  storyLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
    maxWidth: 56,
    textAlign: 'center' as const,
  },

  storyViewerContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  storyViewerGradient: {
    flex: 1,
  },
  storyViewerSafeArea: {
    flex: 1,
  },
  storyProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 2,
    overflow: 'hidden',
  },
  storyProgressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  storyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyHeaderAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
  storyHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  storyCloseButton: {
    padding: 4,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  storyContentPreview: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 600,
  },
  storyContentText: {
    fontSize: 64,
    marginBottom: 20,
  },
  storyContentTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 8,
  },
  storyContentSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  storyNavigationArea: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  storyNavLeft: {
    flex: 1,
  },
  storyNavRight: {
    flex: 1,
  },
});
