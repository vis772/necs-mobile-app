import React, { useState, useRef } from 'react';
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
import { Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  Radio
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { getMatchesByGame } from '@/mocks/matches';
import { getPlayersByTeamAndMatch, GamePlayerStats } from '@/mocks/matchPlayerStats';

const { width } = Dimensions.get('window');
const VIDEO_HEIGHT = width * (9 / 16);

export default function LiveVideoScreen() {
  console.log('[LiveVideoScreen] Rendering...');
  
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const videoRef = useRef<Video>(null);
  
  const [isPlaying, setIsPlaying] = useState(true);
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

  const getGameType = () => {
    if (!match) return null;
    if (getMatchesByGame('valorant').find(m => m.id === match.id)) return 'valorant';
    if (getMatchesByGame('smash').find(m => m.id === match.id)) return 'smash';
    if (getMatchesByGame('rocketleague').find(m => m.id === match.id)) return 'rocketleague';
    return null;
  };

  const gameType = getGameType();

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

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      await videoRef.current.presentFullscreenPlayer();
    }
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
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
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
              <View style={styles.demoBadge}>
                <View style={styles.demoLiveDot} />
                <Text style={styles.demoBadgeText}>DEMO BROADCAST</Text>
              </View>
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
          {homeTeam && awayTeam && match && (
            <View style={styles.matchInfo}>
              <View style={styles.matchInfoHeader}>
                <Text style={styles.matchRound}>{match.round}</Text>
                <View style={styles.matchLiveBadge}>
                  <Radio size={12} color={Colors.error} />
                  <Text style={styles.matchLiveText}>LIVE</Text>
                </View>
              </View>

              <View style={styles.matchScore}>
                <View style={styles.teamInfoCompact}>
                  <Image source={{ uri: homeTeam.image }} style={styles.teamLogoSmall} />
                  <Text style={styles.teamNameSmall} numberOfLines={1}>{homeTeam.name}</Text>
                </View>

                <View style={styles.scoreDisplay}>
                  <Text style={styles.score}>{match.homeScore}</Text>
                  <Text style={styles.scoreDash}>–</Text>
                  <Text style={styles.score}>{match.awayScore}</Text>
                </View>

                <View style={styles.teamInfoCompact}>
                  <Image source={{ uri: awayTeam.image }} style={styles.teamLogoSmall} />
                  <Text style={styles.teamNameSmall} numberOfLines={1}>{awayTeam.name}</Text>
                </View>
              </View>
            </View>
          )}

          {homeTeam && awayTeam && (
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>LIVE PLAYER STATS</Text>
              
              <View style={styles.teamToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    selectedTeam === 'home' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setSelectedTeam('home')}
                >
                  <Image source={{ uri: homeTeam.image }} style={styles.toggleTeamLogo} />
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
                  <Image source={{ uri: awayTeam.image }} style={styles.toggleTeamLogo} />
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
                      <Image
                        source={{ uri: stat.image }}
                        style={styles.playerImage}
                      />
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  liveText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900' as const,
    letterSpacing: 1,
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
    marginBottom: 16,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  demoLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: 1,
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
  matchLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchLiveText: {
    fontSize: 10,
    fontWeight: '900' as const,
    color: Colors.error,
    letterSpacing: 0.8,
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
  content: {
    flex: 1,
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
