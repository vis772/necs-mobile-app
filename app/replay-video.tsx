import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  Trophy,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { getMatchesByGame } from '@/mocks/matches';
import { getPlayersByTeamAndMatch, GamePlayerStats } from '@/mocks/matchPlayerStats';

function getFirstLetter(name: string): string {
  const trimmed = name?.trim();
  return (trimmed && trimmed[0]) ? trimmed[0].toUpperCase() : '?';
}

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * (9 / 16);

export default function ReplayVideoScreen() {
  console.log('[ReplayVideoScreen] Rendering...');
  
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const match = getMatchesByGame('valorant').find(m => m.id === matchId) || 
    getMatchesByGame('smash').find(m => m.id === matchId) || 
    getMatchesByGame('rocketleague').find(m => m.id === matchId);

  const homeTeam = match ? getTeamWithDynamicRecord(match.homeTeamId) : null;
  const awayTeam = match ? getTeamWithDynamicRecord(match.awayTeamId) : null;

  const currentTeamId = selectedTeam === 'home' ? match?.homeTeamId : match?.awayTeamId;
  const playerStats = match && currentTeamId ? getPlayersByTeamAndMatch(match.id, currentTeamId) : [];
  const currentTeam = selectedTeam === 'home' ? homeTeam : awayTeam;

  const homePlayerStats = match ? getPlayersByTeamAndMatch(match.id, match.homeTeamId) : [];
  const awayPlayerStats = match ? getPlayersByTeamAndMatch(match.id, match.awayTeamId) : [];

  const getGameType = () => {
    if (!match) return null;
    if (getMatchesByGame('valorant').find(m => m.id === match.id)) return 'valorant';
    if (getMatchesByGame('smash').find(m => m.id === match.id)) return 'smash';
    if (getMatchesByGame('rocketleague').find(m => m.id === match.id)) return 'rocketleague';
    return null;
  };

  const gameType = getGameType();

  const getPlayerOfTheMatch = (): (GamePlayerStats & { teamName: string; teamLogo: string }) | null => {
    if (!match || !homeTeam || !awayTeam) return null;

    const allPlayers = [
      ...homePlayerStats.map(p => ({ ...p, teamName: homeTeam.name, teamLogo: homeTeam.image })),
      ...awayPlayerStats.map(p => ({ ...p, teamName: awayTeam.name, teamLogo: awayTeam.image })),
    ];

    if (allPlayers.length === 0) return null;

    let bestPlayer = allPlayers[0];

    if (gameType === 'valorant') {
      bestPlayer = allPlayers.reduce((best, current) => 
        (current.stats.kills || 0) > (best.stats.kills || 0) ? current : best
      );
    } else if (gameType === 'rocketleague') {
      bestPlayer = allPlayers.reduce((best, current) => 
        (current.stats.goals || 0) > (best.stats.goals || 0) ? current : best
      );
    } else if (gameType === 'smash') {
      bestPlayer = allPlayers.reduce((best, current) => 
        (current.stats.kos || 0) > (best.stats.kos || 0) ? current : best
      );
    }

    return bestPlayer;
  };

  const playerOfTheMatch = getPlayerOfTheMatch();

  const getPlayerOfMatchHighlight = () => {
    if (!playerOfTheMatch) return '';
    
    if (gameType === 'valorant') {
      return `${playerOfTheMatch.stats.kills} Kills`;
    } else if (gameType === 'rocketleague') {
      return `${playerOfTheMatch.stats.goals} Goals`;
    } else if (gameType === 'smash') {
      return `${playerOfTheMatch.stats.kos} KOs`;
    }
    return '';
  };

  const renderStatValue = (stat: GamePlayerStats) => {
    if (gameType === 'valorant') {
      return (
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>K</Text>
            <Text style={styles.statValue}>{stat.stats.kills || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>D</Text>
            <Text style={styles.statValue}>{stat.stats.deaths || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>A</Text>
            <Text style={styles.statValue}>{stat.stats.assists || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>ACS</Text>
            <Text style={styles.statValue}>{stat.stats.acs || 0}</Text>
          </View>
        </View>
      );
    } else if (gameType === 'rocketleague') {
      return (
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>G</Text>
            <Text style={styles.statValue}>{stat.stats.goals || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>A</Text>
            <Text style={styles.statValue}>{stat.stats.assists || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>S</Text>
            <Text style={styles.statValue}>{stat.stats.saves || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PTS</Text>
            <Text style={styles.statValue}>{stat.stats.points || 0}</Text>
          </View>
        </View>
      );
    } else if (gameType === 'smash') {
      return (
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>KOs</Text>
            <Text style={styles.statValue}>{stat.stats.kos || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>STK</Text>
            <Text style={styles.statValue}>{stat.stats.stocks || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DMG</Text>
            <Text style={styles.statValue}>{stat.stats.damage || 0}</Text>
          </View>
        </View>
      );
    }
    return null;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    console.log('Fullscreen requested');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#000000', '#0a0a0a']}
        style={styles.gradientBackground}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Match Replay</Text>
            <View style={styles.headerSpacer} />
          </View>
        </SafeAreaView>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
          style={styles.videoContainer}
        >
          <View style={styles.demoVideoPlaceholder}>
            <LinearGradient
              colors={['#1a1a1a', '#0a0a0a']}
              style={styles.demoGradient}
            >
              <Text style={styles.demoNecsText}>NECS</Text>
            </LinearGradient>
          </View>

          {showControls && (
            <View style={styles.controlsOverlay}>
              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause size={32} color={Colors.white} fill={Colors.white} />
                  ) : (
                    <Play size={32} color={Colors.white} fill={Colors.white} />
                  )}
                </TouchableOpacity>

                <View style={styles.controlsRight}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleMuteToggle}
                  >
                    {isMuted ? (
                      <VolumeX size={24} color={Colors.white} />
                    ) : (
                      <Volume2 size={24} color={Colors.white} />
                    )}
                  </TouchableOpacity>

                  {Platform.OS !== 'web' && (
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={handleFullscreen}
                    >
                      <Maximize size={24} color={Colors.white} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {playerOfTheMatch && (
            <View style={styles.potmSection}>
              <View style={styles.potmHeader}>
                <Trophy size={20} color={Colors.accent} />
                <Text style={styles.potmTitle}>PLAYER OF THE MATCH</Text>
              </View>
              
              <View style={styles.potmCard}>
                <View style={styles.potmImage}>
                  <Text style={styles.potmImageText}>{getFirstLetter(playerOfTheMatch.name)}</Text>
                </View>
                <View style={styles.potmInfo}>
                  <Text style={styles.potmName}>{playerOfTheMatch.name}</Text>
                  <Text style={styles.potmUsername}>@{playerOfTheMatch.username}</Text>
                  <View style={styles.potmTeamInfo}>
                    <Text style={styles.potmTeamName}>{playerOfTheMatch.teamName}</Text>
                  </View>
                </View>
                <View style={styles.potmHighlight}>
                  <Text style={styles.potmHighlightValue}>{getPlayerOfMatchHighlight()}</Text>
                  <Text style={styles.potmHighlightLabel}>Performance</Text>
                </View>
              </View>
            </View>
          )}

          {homeTeam && awayTeam && match && (
            <View style={styles.matchInfo}>
              <View style={styles.matchInfoHeader}>
                <Text style={styles.matchRound}>{match.round}</Text>
                <Text style={styles.matchDate}>{match.date}</Text>
              </View>

              <View style={styles.matchScore}>
                <View style={styles.teamInfoCompact}>
                  <View style={[styles.teamLogoSmall, { backgroundColor: homeTeam.color }]}>
                    <Text style={styles.teamLogoSmallText}>{homeTeam.shortName}</Text>
                  </View>
                  <Text style={styles.teamNameSmall} numberOfLines={1}>{homeTeam.name}</Text>
                </View>

                <View style={styles.scoreDisplay}>
                  <Text style={styles.score}>{match.homeScore}</Text>
                  <Text style={styles.scoreDash}>–</Text>
                  <Text style={styles.score}>{match.awayScore}</Text>
                </View>

                <View style={styles.teamInfoCompact}>
                  <View style={[styles.teamLogoSmall, { backgroundColor: awayTeam.color }]}>
                    <Text style={styles.teamLogoSmallText}>{awayTeam.shortName}</Text>
                  </View>
                  <Text style={styles.teamNameSmall} numberOfLines={1}>{awayTeam.name}</Text>
                </View>
              </View>
            </View>
          )}

          {homeTeam && awayTeam && (
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>PLAYER STATS</Text>
              
              <View style={styles.teamToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedTeam === 'home' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedTeam('home')}
                >
                  <View style={[styles.toggleTeamLogo, { backgroundColor: homeTeam.color }]}>
                    <Text style={styles.toggleTeamLogoText}>{homeTeam.shortName}</Text>
                  </View>
                  <Text
                    style={[
                      styles.toggleText,
                      selectedTeam === 'home' && styles.toggleTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {homeTeam.name}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedTeam === 'away' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedTeam('away')}
                >
                  <View style={[styles.toggleTeamLogo, { backgroundColor: awayTeam.color }]}>
                    <Text style={styles.toggleTeamLogoText}>{awayTeam.shortName}</Text>
                  </View>
                  <Text
                    style={[
                      styles.toggleText,
                      selectedTeam === 'away' && styles.toggleTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {awayTeam.name}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.statsContainer}>
                {playerStats.map((stat, index) => (
                  <View key={stat.playerId} style={styles.playerCard}>
                    <View style={styles.playerInfo}>
                      <View style={styles.playerImage}>
                        <Text style={styles.playerImageText}>{getFirstLetter(stat.name)}</Text>
                      </View>
                      <View style={styles.playerDetails}>
                        <Text style={styles.playerName}>{stat.name}</Text>
                        <Text style={styles.playerUsername}>@{stat.username}</Text>
                        {currentTeam && (
                          <Text style={styles.playerTeam}>{currentTeam.name}</Text>
                        )}
                      </View>
                    </View>
                    {renderStatValue(stat)}
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  headerSpacer: {
    width: 40,
  },
  videoContainer: {
    width: '100%',
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
    position: 'relative' as const,
  },
  demoVideoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
  },
  demoGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoNecsText: {
    fontSize: 72,
    fontWeight: '900' as const,
    color: Colors.white,
    letterSpacing: 8,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  potmSection: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.accent + '40',
  },
  potmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  potmTitle: {
    fontSize: 12,
    fontWeight: '900' as const,
    color: Colors.accent,
    letterSpacing: 1,
  },
  potmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  potmImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.tertiary,
    borderWidth: 3,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  potmImageText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.white,
  },
  potmInfo: {
    flex: 1,
  },
  potmName: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  potmUsername: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.accent,
    marginBottom: 8,
  },
  potmTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  potmTeamLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  potmTeamName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.gray,
  },
  potmHighlight: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: Colors.darkGray,
  },
  potmHighlightValue: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: Colors.accent,
    marginBottom: 4,
  },
  potmHighlightLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.gray,
    textTransform: 'uppercase' as const,
  },
  matchInfo: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  matchInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchRound: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.gray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  matchDate: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.gray,
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  teamInfoCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamLogoSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogoSmallText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
  },
  teamNameSmall: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.white,
    flex: 1,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  score: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: Colors.white,
  },
  scoreDash: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.gray,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900' as const,
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  statsSection: {
    marginTop: 16,
    paddingBottom: 32,
  },
  teamToggle: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(40, 40, 40, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: Colors.accent,
  },
  toggleTeamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTeamLogoText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.white,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.gray,
    flex: 1,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  statsContainer: {
    gap: 12,
    paddingHorizontal: 16,
  },
  playerCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerImageText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 2,
  },
  playerUsername: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
    marginBottom: 2,
  },
  playerTeam: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.gray,
  },
  playerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 32,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.gray,
    marginBottom: 4,
    textTransform: 'uppercase' as const,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900' as const,
    color: Colors.white,
  },
});
