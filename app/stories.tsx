import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Trophy, TrendingUp, Radio, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { getLiveMatches } from '@/mocks/matches';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { getTeamsByGame } from '@/mocks/teams';
import { getPlayersByGame } from '@/mocks/players';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_DURATION = 5000;

type StoryType = 'live' | 'highlights' | 'standings' | 'stats' | 'teams';

interface StorySlide {
  id: string;
  type: StoryType;
  data?: any;
}

export default function StoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { selectedGame } = useApp();
  
  const storyType = params.type as StoryType;
  
  const [stories, setStories] = useState<StorySlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = React.useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < stories.length - 1) {
        return prev + 1;
      } else {
        router.back();
        return prev;
      }
    });
  }, [stories.length, router]);

  const startProgress = React.useCallback(() => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }

    progress.setValue(0);
    
    Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  }, [progress, handleNext]);

  useEffect(() => {
    const loadStories = () => {
      try {
        const slides: StorySlide[] = [];

        if (storyType === 'live') {
          const liveMatches = getLiveMatches(selectedGame);
          if (liveMatches && liveMatches.length > 0) {
            liveMatches.forEach(match => {
              slides.push({ id: `live-${match.id}`, type: 'live', data: match });
            });
          } else {
            slides.push({ id: 'no-live', type: 'live', data: null });
          }
        } else if (storyType === 'highlights') {
          slides.push({ id: 'highlights-1', type: 'highlights' });
        } else if (storyType === 'standings') {
          slides.push({ id: 'standings-1', type: 'standings' });
        } else if (storyType === 'stats') {
          const statTypes = ['kills', 'acs', 'assists'];
          statTypes.forEach(stat => {
            slides.push({ id: `stats-${stat}`, type: 'stats', data: { statType: stat } });
          });
        } else if (storyType === 'teams') {
          const teams = getTeamsByGame(selectedGame);
          if (teams && teams.length > 0) {
            teams.forEach(team => {
              slides.push({ id: `team-${team.id}`, type: 'teams', data: team });
            });
          } else {
            slides.push({ id: 'no-teams', type: 'teams', data: null });
          }
        }

        if (slides.length === 0) {
          slides.push({ id: 'empty', type: storyType, data: null });
        }

        setStories(slides);
        setCurrentIndex(0);
      } catch (error) {
        console.error('[StoriesScreen] Error loading stories:', error);
        setStories([{ id: 'error', type: 'live', data: null }]);
      }
    };

    loadStories();
  }, [storyType, selectedGame]);

  useEffect(() => {
    if (stories.length > 0) {
      startProgress();
    }
  }, [currentIndex, stories.length, startProgress]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleClose = () => {
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }
    router.back();
  };

  const handleTap = (x: number) => {
    const tapZone = SCREEN_WIDTH / 2;
    if (x < tapZone) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (stories.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
          <SafeAreaView edges={['top']} style={styles.overlay}>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={28} color={Colors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>No stories available</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.tapArea}
        onPress={(e) => handleTap(e.nativeEvent.locationX)}
      >
        {currentStory.type === 'live' && <LiveStory data={currentStory.data} />}
        {currentStory.type === 'highlights' && <HighlightsStory />}
        {currentStory.type === 'standings' && <StandingsStory />}
        {currentStory.type === 'stats' && <StatsStory data={currentStory.data} />}
        {currentStory.type === 'teams' && <TeamsStory data={currentStory.data} />}
      </TouchableOpacity>

      <SafeAreaView edges={['top']} style={styles.overlay}>
        <View style={styles.progressContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width:
                      index < currentIndex
                        ? '100%'
                        : index === currentIndex
                        ? progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={28} color={Colors.white} strokeWidth={2.5} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function LiveStory({ data }: { data: any }) {
  const { selectedGame } = useApp();
  
  if (!data) {
    return (
      <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
        <View style={styles.liveHeader}>
          <Text style={styles.liveText}>No live games at the moment</Text>
        </View>
      </LinearGradient>
    );
  }
  
  const homeTeam = getTeamWithDynamicRecord(data.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(data.awayTeamId);
  const players = getPlayersByGame(selectedGame) || [];
  
  const homeTeamPlayers = players.filter(p => p.teamId === data.homeTeamId).slice(0, 5);
  const awayTeamPlayers = players.filter(p => p.teamId === data.awayTeamId).slice(0, 5);

  if (!homeTeam || !awayTeam) {
    return (
      <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
        <View style={styles.liveHeader}>
          <Text style={styles.liveText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
      <View style={styles.liveHeader}>
        <View style={styles.liveBadge}>
          <Radio size={16} color={Colors.white} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <Text style={styles.liveRound}>{data.round}</Text>
      </View>

      <View style={styles.liveMatchup}>
        <View style={styles.liveTeamSection}>
          <View style={[styles.liveTeamLogo, { backgroundColor: homeTeam.color }]}>
            <Text style={styles.liveTeamInitial}>{homeTeam.shortName}</Text>
          </View>
          <Text style={styles.liveTeamName}>{homeTeam.name}</Text>
          <Text style={styles.liveScore}>{data.homeScore}</Text>
        </View>

        <Text style={styles.liveVs}>VS</Text>

        <View style={styles.liveTeamSection}>
          <View style={[styles.liveTeamLogo, { backgroundColor: awayTeam.color }]}>
            <Text style={styles.liveTeamInitial}>{awayTeam.shortName}</Text>
          </View>
          <Text style={styles.liveTeamName}>{awayTeam.name}</Text>
          <Text style={styles.liveScore}>{data.awayScore}</Text>
        </View>
      </View>

      <View style={styles.liveStats}>
        <Text style={styles.liveSectionTitle}>LIVE PLAYER STATS</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statsColumn}>
            <Text style={styles.statsTeamLabel}>{homeTeam.shortName}</Text>
            {homeTeamPlayers.map((player, index) => (
              <View key={player.id} style={styles.playerStatRow}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.username}
                </Text>
                <Text style={styles.playerStat}>
                  {player.stats.valorant?.kills || 0}K / {player.stats.valorant?.deaths || 0}D
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.statsColumn}>
            <Text style={styles.statsTeamLabel}>{awayTeam.shortName}</Text>
            {awayTeamPlayers.map((player, index) => (
              <View key={player.id} style={styles.playerStatRow}>
                <Text style={styles.playerName} numberOfLines={1}>
                  {player.username}
                </Text>
                <Text style={styles.playerStat}>
                  {player.stats.valorant?.kills || 0}K / {player.stats.valorant?.deaths || 0}D
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

function HighlightsStory() {
  return (
    <LinearGradient colors={['#1A0A2E', '#0F051F']} style={styles.storyContent}>
      <View style={styles.highlightFooter}>
        <Play size={48} color={Colors.accent} />
        <Text style={styles.highlightTitle}>VALORANT HIGHLIGHTS</Text>
        <Text style={styles.highlightSubtitle}>Epic plays from the tournament</Text>
      </View>
    </LinearGradient>
  );
}

function StandingsStory() {
  const { selectedGame } = useApp();
  const allTeams = getTeamsByGame(selectedGame) || [];
  const teams = allTeams
    .map(team => getTeamWithDynamicRecord(team.id))
    .filter(Boolean)
    .sort((a: any, b: any) => b.record.wins - a.record.wins);

  return (
    <LinearGradient colors={['#1A0F2E', '#0F0A1F']} style={styles.storyContent}>
      <View style={styles.standingsHeader}>
        <Trophy size={32} color={Colors.accent} />
        <Text style={styles.standingsTitle}>STANDINGS</Text>
        <Text style={styles.standingsSubtitle}>Current Tournament Rankings</Text>
      </View>

      <View style={styles.standingsList}>
        {teams.map((team: any, index: number) => (
          <View key={team.id} style={styles.standingItem}>
            <Text style={styles.standingRank}>{index + 1}</Text>
            <View style={[styles.standingLogo, { backgroundColor: team.color }]}>
              <Text style={styles.standingLogoText}>{team.shortName}</Text>
            </View>
            <Text style={styles.standingTeamName}>{team.name}</Text>
            <Text style={styles.standingRecord}>
              {team.record.wins}-{team.record.losses}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

function StatsStory({ data }: { data: { statType: string } }) {
  const { selectedGame } = useApp();
  const players = getPlayersByGame(selectedGame) || [];

  const statConfig = {
    kills: { label: 'KILLS LEADERS', key: 'kills' as const },
    acs: { label: 'ACS LEADERS', key: 'acs' as const },
    assists: { label: 'ASSISTS LEADERS', key: 'assists' as const },
  };

  const config = statConfig[data.statType as keyof typeof statConfig];
  
  const sortedPlayers = [...players].sort((a, b) => {
    const aVal = a.stats.valorant?.[config.key] || 0;
    const bVal = b.stats.valorant?.[config.key] || 0;
    return bVal - aVal;
  }).slice(0, 10);

  return (
    <LinearGradient colors={['#0A1929', '#132F4C']} style={styles.storyContent}>
      <View style={styles.statsHeader}>
        <TrendingUp size={32} color={Colors.accent} />
        <Text style={styles.statsTitle}>{config.label}</Text>
        <Text style={styles.statsSubtitle}>Top 10 Players</Text>
      </View>

      <ScrollView style={styles.statsList} showsVerticalScrollIndicator={false}>
        {sortedPlayers.map((player, index) => {
          const teams = getTeamsByGame(selectedGame) || [];
          const team = teams.find(t => t.id === player.teamId);
          
          return (
            <View key={player.id} style={styles.statsPlayerItem}>
              <Text style={styles.statsPlayerRank}>{index + 1}</Text>
              <View style={styles.statsPlayerInfo}>
                <Text style={styles.statsPlayerName}>{player.username}</Text>
                <Text style={styles.statsPlayerTeam}>{team?.shortName || ''}</Text>
              </View>
              <Text style={styles.statsPlayerValue}>
                {player.stats.valorant?.[config.key] || 0}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

function TeamsStory({ data }: { data: any }) {
  const { selectedGame } = useApp();
  
  if (!data) {
    return (
      <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
        <View style={styles.liveHeader}>
          <Text style={styles.liveText}>No teams available</Text>
        </View>
      </LinearGradient>
    );
  }
  
  const team = getTeamWithDynamicRecord(data.id);
  const allPlayers = getPlayersByGame(selectedGame) || [];
  const players = allPlayers.filter(p => p.teamId === data.id);

  if (!team) {
    return (
      <LinearGradient colors={['#0F0F0F', '#1A1A1A']} style={styles.storyContent}>
        <View style={styles.liveHeader}>
          <Text style={styles.liveText}>Team not found</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[data.color, '#000000']}
      style={styles.storyContent}
    >
      <View style={styles.teamHeader}>
        <View style={[styles.teamLogo, { backgroundColor: data.color }]}>
          <Text style={styles.teamLogoText}>{data.shortName}</Text>
        </View>
        <Text style={styles.teamName}>{data.name}</Text>
        <Text style={styles.teamRecord}>
          {team.record.wins}W - {team.record.losses}L
        </Text>
      </View>

      <View style={styles.teamRoster}>
        <Text style={styles.teamSectionTitle}>ROSTER</Text>
        {players.map(player => (
          <View key={player.id} style={styles.teamPlayerCard}>
            <View style={styles.teamPlayerHeader}>
              <Text style={styles.teamPlayerName}>{player.name}</Text>
              <Text style={styles.teamPlayerUsername}>@{player.username}</Text>
            </View>
            {selectedGame === 'valorant' && player.stats.valorant && (
              <View style={styles.teamPlayerStats}>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatLabel}>K/D</Text>
                  <Text style={styles.teamStatValue}>{player.stats.valorant.kd}</Text>
                </View>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatLabel}>ACS</Text>
                  <Text style={styles.teamStatValue}>{player.stats.valorant.acs}</Text>
                </View>
                <View style={styles.teamStatItem}>
                  <Text style={styles.teamStatLabel}>HS%</Text>
                  <Text style={styles.teamStatValue}>{player.stats.valorant.headshotPercent}%</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tapArea: {
    flex: 1,
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  closeButton: {
    position: 'absolute' as const,
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  storyContent: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  liveHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.error,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 1.5,
  },
  liveRound: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
    textTransform: 'uppercase' as const,
  },
  liveMatchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  liveTeamSection: {
    alignItems: 'center',
    gap: 12,
  },
  liveTeamLogo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTeamInitial: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
  },
  liveTeamName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
  },
  liveScore: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.accent,
  },
  liveVs: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.gray,
  },
  liveStats: {
    flex: 1,
  },
  liveSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 20,
    textAlign: 'center' as const,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statsColumn: {
    flex: 1,
  },
  statsTeamLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  playerStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    marginBottom: 6,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    flex: 1,
  },
  playerStat: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
  },
  highlightVideo: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  highlightFooter: {
    padding: 24,
    paddingBottom: 60,
  },
  highlightTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 8,
  },
  highlightSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.gray,
  },
  standingsHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  standingsTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 16,
    letterSpacing: 1,
  },
  standingsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    marginTop: 8,
  },
  standingsList: {
    gap: 12,
  },
  standingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  standingRank: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.accent,
    width: 30,
  },
  standingLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  standingLogoText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  standingTeamName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  standingRecord: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.gray,
  },
  statsHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 16,
    letterSpacing: 0.5,
  },
  statsSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    marginTop: 8,
  },
  statsList: {
    flex: 1,
  },
  statsPlayerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    gap: 16,
  },
  statsPlayerRank: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.accent,
    width: 30,
  },
  statsPlayerInfo: {
    flex: 1,
  },
  statsPlayerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  statsPlayerTeam: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  statsPlayerValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.white,
  },
  teamHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  teamLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  teamLogoText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
  },
  teamName: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  teamRecord: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gray,
  },
  teamRoster: {
    flex: 1,
  },
  teamSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  teamPlayerCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamPlayerHeader: {
    marginBottom: 12,
  },
  teamPlayerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  teamPlayerUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  teamPlayerStats: {
    flexDirection: 'row',
    gap: 20,
  },
  teamStatItem: {
    alignItems: 'center',
  },
  teamStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 4,
  },
  teamStatValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
  },
});
