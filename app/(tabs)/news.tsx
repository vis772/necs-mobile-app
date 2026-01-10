import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';
import GameSelector from '@/components/GameSelector';
import Colors from '@/constants/colors';
import { TrendingUp, Target, Trophy, Zap, ChevronRight, Award } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getPlayersByGame, Player } from '@/mocks/players';
import { getTeamById } from '@/mocks/teams';

function getFirstLetter(name: string): string {
  const trimmed = name?.trim();
  return (trimmed && trimmed[0]) ? trimmed[0].toUpperCase() : '?';
}

interface StatCardProps {
  title: string;
  player: Player;
  stat: string;
  value: string | number;
  icon?: React.ReactNode;
  statKey: string;
}

function StatCard({ title, player, stat, value, icon, statKey }: StatCardProps) {
  const team = getTeamById(player.teamId);
  const { selectedGame } = useApp();
  
  const handlePress = () => {
    router.push(`/leaderboard?game=${selectedGame}&statKey=${statKey}&statName=${encodeURIComponent(title)}` as any);
  };
  
  return (
    <TouchableOpacity style={styles.statCard} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.statCardHeader}>
        {icon && <View style={styles.statIcon}>{icon}</View>}
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <View style={styles.playerInfo}>
        <View style={styles.playerInitialsContainer}>
          <Text style={styles.playerInitials}>{getFirstLetter(player.name)}</Text>
        </View>
        <View style={styles.playerDetails}>
          <Text style={styles.playerName}>{player.username}</Text>
          {team && <Text style={styles.playerTeam}>{team.shortName}</Text>}
        </View>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{stat}</Text>
      </View>
      <View style={styles.viewMoreContainer}>
        <Text style={styles.viewMoreText}>View All</Text>
        <ChevronRight size={14} color={Colors.accent} />
      </View>
    </TouchableOpacity>
  );
}

function MVPCard({ player, value, statKey }: { player: Player; value: number; statKey: string }) {
  const team = getTeamById(player.teamId);
  const { selectedGame } = useApp();
  
  const handlePress = () => {
    router.push(`/leaderboard?game=${selectedGame}&statKey=${statKey}&statName=${encodeURIComponent('MVP Rankings')}` as any);
  };
  
  return (
    <TouchableOpacity style={styles.mvpCard} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.mvpHeader}>
        <View style={styles.mvpIconContainer}>
          <Award size={20} color={Colors.primary} />
        </View>
        <Text style={styles.mvpTitle}>MVP</Text>
      </View>
      
      <View style={styles.mvpContent}>
        <View style={styles.mvpInitialsContainer}>
          <Text style={styles.mvpInitials}>{getFirstLetter(player.name)}</Text>
        </View>
        
        <View style={styles.mvpPlayerInfo}>
          <Text style={styles.mvpPlayerName} numberOfLines={1}>{player.name}</Text>
          <Text style={styles.mvpPlayerUsername}>@{player.username}</Text>
          {team && (
            <View style={styles.mvpTeamContainer}>
              <View style={[styles.mvpTeamImage, { backgroundColor: team.color }]}>
                <Text style={styles.mvpTeamImageText}>{team.shortName}</Text>
              </View>
              <Text style={styles.mvpTeamName}>{team.name}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.mvpStatContainer}>
          <Text style={styles.mvpStatValue}>{value}</Text>
          <Text style={styles.mvpStatLabel}>MVP AWARDS</Text>
        </View>
        
        <View style={styles.mvpChevron}>
          <ChevronRight size={20} color={Colors.accent} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PlayerStatsScreen() {
  const { selectedGame } = useApp();
  const players = useMemo(() => getPlayersByGame(selectedGame), [selectedGame]);

  const statLeaders = useMemo(() => {
    if (selectedGame === 'valorant') {
      const sortedByKD = [...players].sort((a, b) => 
        (b.stats.valorant?.kd || 0) - (a.stats.valorant?.kd || 0)
      );
      const sortedByACS = [...players].sort((a, b) => 
        (b.stats.valorant?.acs || 0) - (a.stats.valorant?.acs || 0)
      );
      const sortedByHS = [...players].sort((a, b) => 
        (b.stats.valorant?.headshotPercent || 0) - (a.stats.valorant?.headshotPercent || 0)
      );
      const sortedByKills = [...players].sort((a, b) => 
        (b.stats.valorant?.kills || 0) - (a.stats.valorant?.kills || 0)
      );

      return [
        { title: 'K/D Leader', player: sortedByKD[0], stat: 'K/D', value: sortedByKD[0].stats.valorant?.kd || 0, icon: <Target size={16} color={Colors.accent} />, statKey: 'kd' },
        { title: 'ACS Leader', player: sortedByACS[0], stat: 'ACS', value: sortedByACS[0].stats.valorant?.acs || 0, icon: <TrendingUp size={16} color={Colors.accent} />, statKey: 'acs' },
        { title: 'Headshot %', player: sortedByHS[0], stat: 'HS %', value: `${sortedByHS[0].stats.valorant?.headshotPercent || 0}%`, icon: <Zap size={16} color={Colors.accent} />, statKey: 'headshotPercent' },
        { title: 'Total Kills', player: sortedByKills[0], stat: 'Kills', value: sortedByKills[0].stats.valorant?.kills || 0, icon: <Trophy size={16} color={Colors.accent} />, statKey: 'kills' },
      ];
    } else if (selectedGame === 'smash') {
      const sortedByWins = [...players].sort((a, b) => 
        (b.stats.smash?.wins || 0) - (a.stats.smash?.wins || 0)
      );
      const sortedByWinPercent = [...players].sort((a, b) => 
        (b.stats.smash?.setWinPercent || 0) - (a.stats.smash?.setWinPercent || 0)
      );
      const sortedByDamage = [...players].sort((a, b) => 
        (b.stats.smash?.damagePerMatch || 0) - (a.stats.smash?.damagePerMatch || 0)
      );
      const sortedByStocks = [...players].sort((a, b) => 
        (b.stats.smash?.stocksTaken || 0) - (a.stats.smash?.stocksLost || 0)
      );

      return [
        { title: 'Most Wins', player: sortedByWins[0], stat: 'Wins', value: sortedByWins[0].stats.smash?.wins || 0, icon: <Trophy size={16} color={Colors.accent} />, statKey: 'wins' },
        { title: 'Set Win %', player: sortedByWinPercent[0], stat: 'Win %', value: `${sortedByWinPercent[0].stats.smash?.setWinPercent || 0}%`, icon: <TrendingUp size={16} color={Colors.accent} />, statKey: 'setWinPercent' },
        { title: 'Damage/Match', player: sortedByDamage[0], stat: 'DMG', value: sortedByDamage[0].stats.smash?.damagePerMatch || 0, icon: <Zap size={16} color={Colors.accent} />, statKey: 'damagePerMatch' },
        { title: 'Stocks Taken', player: sortedByStocks[0], stat: 'Stocks', value: sortedByStocks[0].stats.smash?.stocksTaken || 0, icon: <Target size={16} color={Colors.accent} />, statKey: 'stocksTaken' },
      ];
    } else {
      const sortedByGoals = [...players].sort((a, b) => 
        (b.stats.rocketleague?.goals || 0) - (a.stats.rocketleague?.goals || 0)
      );
      const sortedByAssists = [...players].sort((a, b) => 
        (b.stats.rocketleague?.assists || 0) - (a.stats.rocketleague?.assists || 0)
      );
      const sortedBySaves = [...players].sort((a, b) => 
        (b.stats.rocketleague?.saves || 0) - (a.stats.rocketleague?.saves || 0)
      );
      const sortedByPoints = [...players].sort((a, b) => 
        (b.stats.rocketleague?.avgPointsPerMatch || 0) - (a.stats.rocketleague?.avgPointsPerMatch || 0)
      );

      return [
        { title: 'Goals Leader', player: sortedByGoals[0], stat: 'Goals', value: sortedByGoals[0].stats.rocketleague?.goals || 0, icon: <Target size={16} color={Colors.accent} />, statKey: 'goals' },
        { title: 'Assists Leader', player: sortedByAssists[0], stat: 'Assists', value: sortedByAssists[0].stats.rocketleague?.assists || 0, icon: <TrendingUp size={16} color={Colors.accent} />, statKey: 'assists' },
        { title: 'Saves Leader', player: sortedBySaves[0], stat: 'Saves', value: sortedBySaves[0].stats.rocketleague?.saves || 0, icon: <Zap size={16} color={Colors.accent} />, statKey: 'saves' },
        { title: 'Avg Points', player: sortedByPoints[0], stat: 'PPM', value: sortedByPoints[0].stats.rocketleague?.avgPointsPerMatch || 0, icon: <Trophy size={16} color={Colors.accent} />, statKey: 'avgPointsPerMatch' },
      ];
    }
  }, [players, selectedGame]);

  const mvpLeader = useMemo(() => {
    if (selectedGame === 'valorant') {
      const sortedByMVPs = [...players].sort((a, b) => 
        (b.stats.valorant?.mvps || 0) - (a.stats.valorant?.mvps || 0)
      );
      return {
        player: sortedByMVPs[0],
        value: sortedByMVPs[0].stats.valorant?.mvps || 0,
        statKey: 'mvps'
      };
    } else if (selectedGame === 'smash') {
      const sortedByPlacements = [...players].sort((a, b) => 
        (a.stats.smash?.tournamentPlacements || 999) - (b.stats.smash?.tournamentPlacements || 999)
      );
      return {
        player: sortedByPlacements[0],
        value: sortedByPlacements[0].stats.smash?.tournamentPlacements || 0,
        statKey: 'tournamentPlacements'
      };
    } else {
      const sortedByMVPs = [...players].sort((a, b) => 
        (b.stats.rocketleague?.mvps || 0) - (a.stats.rocketleague?.mvps || 0)
      );
      return {
        player: sortedByMVPs[0],
        value: sortedByMVPs[0].stats.rocketleague?.mvps || 0,
        statKey: 'mvps'
      };
    }
  }, [players, selectedGame]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TrendingUp size={28} color={Colors.accent} />
          <Text style={styles.headerTitle}>Player Stats</Text>
        </View>
      </SafeAreaView>

      <GameSelector />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Most Valuable Player</Text>
        <View style={styles.mvpSection}>
          <MVPCard
            player={mvpLeader.player}
            value={mvpLeader.value}
            statKey={mvpLeader.statKey}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Stat Leaders</Text>
        <View style={styles.grid}>
          {statLeaders.map((leader, index) => (
            <StatCard
              key={index}
              title={leader.title}
              player={leader.player}
              stat={leader.stat}
              value={leader.value}
              icon={leader.icon}
              statKey={leader.statKey}
            />
          ))}
        </View>
        
        <View style={{ height: 20 }} />
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
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  statIcon: {
    width: 24,
    height: 24,
    backgroundColor: Colors.accent + '20',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  playerInitialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  playerTeam: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  statValueContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  viewMoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  playersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.darkGray,
  },
  playerRowImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkGray,
  },
  playerRowInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerRowName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  playerRowTeamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playerRowTeamImage: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.darkGray,
  },
  playerRowTeam: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  playerRowStats: {
    alignItems: 'flex-end',
  },
  playerRowStatPrimary: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 2,
  },
  playerRowStatSecondary: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.gray,
  },
  mvpSection: {
    paddingHorizontal: 20,
  },
  mvpCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  mvpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mvpIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mvpContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mvpInitialsContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.darkGray,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.white,
  },
  mvpPlayerInfo: {
    flex: 1,
  },
  mvpPlayerName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  mvpPlayerUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 6,
  },
  mvpTeamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mvpTeamImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mvpTeamImageText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.white,
  },
  mvpTeamName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
  },
  mvpStatContainer: {
    alignItems: 'center',
    paddingLeft: 14,
    borderLeftWidth: 1,
    borderLeftColor: Colors.darkGray,
  },
  mvpStatValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.accent,
    marginBottom: 2,
  },
  mvpStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mvpChevron: {
    paddingLeft: 8,
  },
});
