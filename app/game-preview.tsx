import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MATCHES } from '@/mocks/matches';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { PLAYERS } from '@/mocks/players';

export default function GamePreviewScreen() {
  console.log('[GamePreviewScreen] Rendering...');
  
  const router = useRouter();
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  const match = MATCHES.find(m => m.id === matchId);
  
  if (!match) {
    console.error('[GamePreviewScreen] Match not found:', matchId);
    return null;
  }

  const homeTeam = getTeamWithDynamicRecord(match.homeTeamId);
  const awayTeam = getTeamWithDynamicRecord(match.awayTeamId);

  if (!homeTeam || !awayTeam) {
    console.error('[GamePreviewScreen] Teams not found');
    return null;
  }

  const currentSelectedId = selectedTeamId || homeTeam.id;
  const selectedTeam = currentSelectedId === awayTeam.id ? awayTeam : homeTeam;
  const teamPlayers = PLAYERS().filter(p => p.teamId === currentSelectedId);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={styles.gradientBackground}
      >
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Game Preview</Text>
            <View style={styles.backButton} />
          </View>
        </SafeAreaView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.matchInfoSection}>
            <Text style={styles.matchRound}>{match.round}</Text>
            <Text style={styles.matchTime}>{match.time}</Text>
            
            <View style={styles.teamsMatchup}>
              <View style={styles.teamPreview}>
                <Image source={{ uri: homeTeam.image }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{homeTeam.name}</Text>
                <Text style={styles.teamRecord}>{homeTeam.record.wins}-{homeTeam.record.losses}</Text>
              </View>

              <Text style={styles.vsText}>VS</Text>

              <View style={styles.teamPreview}>
                <Image source={{ uri: awayTeam.image }} style={styles.teamLogo} />
                <Text style={styles.teamName}>{awayTeam.name}</Text>
                <Text style={styles.teamRecord}>{awayTeam.record.wins}-{awayTeam.record.losses}</Text>
              </View>
            </View>
          </View>

          <View style={styles.teamToggleSection}>
            <View style={styles.teamToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  currentSelectedId === homeTeam.id && styles.toggleButtonActive
                ]}
                onPress={() => setSelectedTeamId(homeTeam.id)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  currentSelectedId === homeTeam.id && styles.toggleButtonTextActive
                ]}>
                  {homeTeam.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  currentSelectedId === awayTeam.id && styles.toggleButtonActive
                ]}
                onPress={() => setSelectedTeamId(awayTeam.id)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  currentSelectedId === awayTeam.id && styles.toggleButtonTextActive
                ]}>
                  {awayTeam.name}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.teamDetailsSection}>
            <View style={styles.teamHeader}>
              <Image source={{ uri: selectedTeam.image }} style={styles.selectedTeamLogo} />
              <View style={styles.teamHeaderInfo}>
                <Text style={styles.selectedTeamName}>{selectedTeam.name}</Text>
                <Text style={styles.selectedTeamRegion}>{selectedTeam.region}</Text>
                <Text style={styles.selectedTeamRecord}>
                  {selectedTeam.record.wins}W - {selectedTeam.record.losses}L
                </Text>
              </View>
            </View>

            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>TEAM STATS</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{selectedTeam.record.wins}</Text>
                  <Text style={styles.statLabel}>Wins</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{selectedTeam.record.losses}</Text>
                  <Text style={styles.statLabel}>Losses</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {((selectedTeam.record.wins / (selectedTeam.record.wins + selectedTeam.record.losses)) * 100).toFixed(0)}%
                  </Text>
                  <Text style={styles.statLabel}>Win Rate</Text>
                </View>
              </View>
            </View>

            <View style={styles.rosterSection}>
              <Text style={styles.sectionTitle}>ROSTER</Text>
              {teamPlayers.map((player, index) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={styles.playerNumber}>
                    <Text style={styles.playerNumberText}>{index + 1}</Text>
                  </View>
                  <Image source={{ uri: player.image }} style={styles.playerImage} />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerUsername}>@{player.username}</Text>
                  </View>
                  {match.game === 'valorant' && player.stats.valorant && (
                    <View style={styles.playerStats}>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.valorant.kills}</Text>
                        <Text style={styles.playerStatLabel}>K</Text>
                      </View>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.valorant.deaths}</Text>
                        <Text style={styles.playerStatLabel}>D</Text>
                      </View>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.valorant.assists}</Text>
                        <Text style={styles.playerStatLabel}>A</Text>
                      </View>
                    </View>
                  )}
                  {match.game === 'smash' && player.stats.smash && (
                    <View style={styles.playerStats}>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.smash.wins}</Text>
                        <Text style={styles.playerStatLabel}>W</Text>
                      </View>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.smash.losses}</Text>
                        <Text style={styles.playerStatLabel}>L</Text>
                      </View>
                    </View>
                  )}
                  {match.game === 'rocketleague' && player.stats.rocketleague && (
                    <View style={styles.playerStats}>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.rocketleague.goals}</Text>
                        <Text style={styles.playerStatLabel}>G</Text>
                      </View>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.rocketleague.assists}</Text>
                        <Text style={styles.playerStatLabel}>A</Text>
                      </View>
                      <View style={styles.playerStatItem}>
                        <Text style={styles.playerStatValue}>{player.stats.rocketleague.saves}</Text>
                        <Text style={styles.playerStatLabel}>S</Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  matchInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },
  matchRound: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  matchTime: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 24,
  },
  teamsMatchup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    gap: 20,
  },
  teamPreview: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  teamLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.tertiary,
  },
  teamName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
  },
  teamRecord: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1,
  },
  teamToggleSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  teamToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray,
  },
  toggleButtonTextActive: {
    color: Colors.white,
  },
  teamDetailsSection: {
    paddingHorizontal: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  selectedTeamLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.tertiary,
  },
  teamHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  selectedTeamName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  selectedTeamRegion: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  selectedTeamRecord: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.gray,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
  },
  rosterSection: {
    marginBottom: 24,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  playerNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
  },
  playerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkGray,
  },
  playerInfo: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  playerUsername: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  playerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  playerStatItem: {
    alignItems: 'center',
    minWidth: 32,
  },
  playerStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  playerStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.gray,
  },
});
