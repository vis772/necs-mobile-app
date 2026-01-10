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
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { getTeamWithDynamicRecord } from '@/mocks/teamRecords';
import { MATCHES } from '@/mocks/matches';
import { getPlayersByTeamAndMatch, GamePlayerStats } from '@/mocks/matchPlayerStats';

function getFirstLetter(name: string): string {
  return name.trim()[0].toUpperCase();
}

const formatScore = (score: number): string => {
  return score > 9 ? '9' : score.toString();
};

export default function GameStatsScreen() {
  const { matchId } = useLocalSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');

  const match = useMemo(() => {
    return MATCHES.find(m => m.id === matchId);
  }, [matchId]);

  const homeTeam = match ? getTeamWithDynamicRecord(match.homeTeamId) : null;
  const awayTeam = match ? getTeamWithDynamicRecord(match.awayTeamId) : null;

  const playerStats = useMemo(() => {
    if (!match) return [];
    const teamId = selectedTeam === 'home' ? match.homeTeamId : match.awayTeamId;
    return getPlayersByTeamAndMatch(match.id, teamId);
  }, [match, selectedTeam]);

  if (!match || !homeTeam || !awayTeam) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.white} />
          </TouchableOpacity>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Match not found</Text>
        </View>
      </View>
    );
  }

  const currentTeam = selectedTeam === 'home' ? homeTeam : awayTeam;
  const currentScore = selectedTeam === 'home' ? match.homeScore : match.awayScore;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Stats</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={styles.matchSummary}>
        <View style={styles.matchInfo}>
          <View style={styles.teamSummary}>
            <Image source={{ uri: homeTeam.image }} style={styles.summaryTeamImage} />
            <Text style={styles.summaryTeamName} numberOfLines={1}>{homeTeam.name}</Text>
          </View>
          
          <View style={styles.summaryScoreContainer}>
            <Text style={styles.summaryScore}>{formatScore(match.homeScore)}</Text>
            <Text style={styles.summaryScoreDash}>-</Text>
            <Text style={styles.summaryScore}>{formatScore(match.awayScore)}</Text>
          </View>

          <View style={styles.teamSummary}>
            <Image source={{ uri: awayTeam.image }} style={styles.summaryTeamImage} />
            <Text style={styles.summaryTeamName} numberOfLines={1}>{awayTeam.name}</Text>
          </View>
        </View>

        {match.round && (
          <Text style={styles.matchRound}>{match.round}</Text>
        )}
      </View>

      <View style={styles.teamToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonLeft,
            selectedTeam === 'home' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedTeam('home')}
        >
          <Image source={{ uri: homeTeam.image }} style={styles.toggleTeamImage} />
          <Text style={[
            styles.toggleText,
            selectedTeam === 'home' && styles.toggleTextActive,
          ]}>
            {homeTeam.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.toggleButtonRight,
            selectedTeam === 'away' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedTeam('away')}
        >
          <Image source={{ uri: awayTeam.image }} style={styles.toggleTeamImage} />
          <Text style={[
            styles.toggleText,
            selectedTeam === 'away' && styles.toggleTextActive,
          ]}>
            {awayTeam.name}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsHeader}>
          <View style={styles.teamBanner}>
            <Image source={{ uri: currentTeam.image }} style={styles.bannerTeamImage} />
            <View>
              <Text style={styles.bannerTeamName}>{currentTeam.name}</Text>
              <Text style={styles.bannerScore}>Final Score: {formatScore(currentScore)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsTable}>
          {match.game === 'valorant' && (
            <ValorantStatsTable players={playerStats} />
          )}
          {match.game === 'smash' && (
            <SmashStatsTable players={playerStats} />
          )}
          {match.game === 'rocketleague' && (
            <RocketLeagueStatsTable players={playerStats} />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function ValorantStatsTable({ players }: { players: GamePlayerStats[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.playerColumn]}>Player</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>K</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>D</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>A</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>ACS</Text>
      </View>

      {players.map((player) => (
        <View key={player.playerId} style={styles.tableRow}>
          <View style={styles.playerCell}>
            <View style={styles.playerImage}>
              <Text style={styles.playerImageText}>{getFirstLetter(player.name)}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
              <Text style={styles.playerUsername}>{player.username}</Text>
            </View>
          </View>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.kills || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.deaths || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.assists || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.acs || 0}</Text>
        </View>
      ))}
    </View>
  );
}

function SmashStatsTable({ players }: { players: GamePlayerStats[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.playerColumn]}>Player</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>Stocks</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>KOs</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>Dmg</Text>
      </View>

      {players.map((player) => (
        <View key={player.playerId} style={styles.tableRow}>
          <View style={styles.playerCell}>
            <View style={styles.playerImage}>
              <Text style={styles.playerImageText}>{getFirstLetter(player.name)}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
              <Text style={styles.playerUsername}>{player.username}</Text>
            </View>
          </View>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.stocks || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.kos || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.damage || 0}</Text>
        </View>
      ))}
    </View>
  );
}

function RocketLeagueStatsTable({ players }: { players: GamePlayerStats[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.playerColumn]}>Player</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>G</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>A</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>S</Text>
        <Text style={[styles.tableHeaderText, styles.statColumn]}>Pts</Text>
      </View>

      {players.map((player) => (
        <View key={player.playerId} style={styles.tableRow}>
          <View style={styles.playerCell}>
            <View style={styles.playerImage}>
              <Text style={styles.playerImageText}>{getFirstLetter(player.name)}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
              <Text style={styles.playerUsername}>{player.username}</Text>
            </View>
          </View>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.goals || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.assists || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.saves || 0}</Text>
          <Text style={[styles.statText, styles.statColumn]}>{player.stats.points || 0}</Text>
        </View>
      ))}
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
  },
  headerSpacer: {
    width: 40,
  },
  matchSummary: {
    backgroundColor: Colors.secondary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teamSummary: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryTeamImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkGray,
  },
  summaryTeamName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center' as const,
    maxWidth: 90,
  },
  summaryScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  summaryScore: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
  },
  summaryScoreDash: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray,
  },
  matchRound: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  teamToggle: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.darkGray,
  },
  toggleButtonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  toggleButtonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  toggleTeamImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.darkGray,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray,
    maxWidth: 100,
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  statsHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  teamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bannerTeamImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.darkGray,
  },
  bannerTeamName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  bannerScore: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  statsTable: {
    paddingHorizontal: 16,
  },
  table: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.darkGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  playerColumn: {
    flex: 1,
  },
  statColumn: {
    width: 48,
    textAlign: 'center' as const,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkGray,
  },
  playerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerImageText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  playerUsername: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
  },
  statText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '600',
  },
});
