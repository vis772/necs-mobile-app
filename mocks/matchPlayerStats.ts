
import { PLAYERS } from '@/mocks/players';

export interface GamePlayerStats {
  playerId: string;
  name: string;
  username: string;
  image: string;
  stats: {
    kills?: number;
    deaths?: number;
    assists?: number;
    acs?: number;
    goals?: number;
    saves?: number;
    points?: number;
    stocks?: number;
    kos?: number;
    damage?: number;
  };
}

const generateValorantStats = (playerId: string, isWinner: boolean): GamePlayerStats['stats'] => {
  const baseKills = isWinner ? Math.floor(Math.random() * 8) + 15 : Math.floor(Math.random() * 6) + 10;
  const baseDeaths = isWinner ? Math.floor(Math.random() * 5) + 8 : Math.floor(Math.random() * 6) + 10;
  const baseAssists = Math.floor(Math.random() * 4) + 3;
  const baseACS = isWinner ? Math.floor(Math.random() * 50) + 220 : Math.floor(Math.random() * 50) + 170;

  return {
    kills: baseKills,
    deaths: baseDeaths,
    assists: baseAssists,
    acs: baseACS,
  };
};

const generateSmashStats = (playerId: string, isWinner: boolean): GamePlayerStats['stats'] => {
  const baseStocks = isWinner ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 2) + 2;
  const baseKOs = isWinner ? Math.floor(Math.random() * 3) + 6 : Math.floor(Math.random() * 3) + 3;
  const baseDamage = Math.floor(Math.random() * 50) + 150;

  return {
    stocks: baseStocks,
    kos: baseKOs,
    damage: baseDamage,
  };
};

const generateRocketLeagueStats = (playerId: string, isWinner: boolean): GamePlayerStats['stats'] => {
  const baseGoals = isWinner ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2);
  const baseAssists = Math.floor(Math.random() * 2) + 1;
  const baseSaves = Math.floor(Math.random() * 3) + 2;
  const basePoints = (baseGoals * 100) + (baseAssists * 50) + (baseSaves * 50) + Math.floor(Math.random() * 100);

  return {
    goals: baseGoals,
    assists: baseAssists,
    saves: baseSaves,
    points: basePoints,
  };
};

const matchStatsCache: Record<string, Record<string, GamePlayerStats[]>> = {};

export const getPlayersByTeamAndMatch = (matchId: string, teamId: string): GamePlayerStats[] => {
  if (matchStatsCache[matchId]?.[teamId]) {
    return matchStatsCache[matchId][teamId];
  }

  const players = PLAYERS().filter(p => p.teamId === teamId);
  
  if (players.length === 0) {
    return [];
  }

  const game = players[0].game;
  
  const isWinner = determineIfWinner(matchId, teamId);

  const stats: GamePlayerStats[] = players.map(player => {
    let gameStats: GamePlayerStats['stats'] = {};

    if (game === 'valorant') {
      gameStats = generateValorantStats(player.id, isWinner);
    } else if (game === 'smash') {
      gameStats = generateSmashStats(player.id, isWinner);
    } else if (game === 'rocketleague') {
      gameStats = generateRocketLeagueStats(player.id, isWinner);
    }

    return {
      playerId: player.id,
      name: player.name,
      username: player.username,
      image: player.image,
      stats: gameStats,
    };
  });

  if (!matchStatsCache[matchId]) {
    matchStatsCache[matchId] = {};
  }
  matchStatsCache[matchId][teamId] = stats;

  return stats;
};

const determineIfWinner = (matchId: string, teamId: string): boolean => {
  const matchData: Record<string, { homeTeamId: string; awayTeamId: string; homeScore: number; awayScore: number }> = {
    'val-may6-1': { homeTeamId: 'val-1', awayTeamId: 'val-2', homeScore: 13, awayScore: 11 },
    'val-may6-2': { homeTeamId: 'val-3', awayTeamId: 'val-4', homeScore: 13, awayScore: 9 },
    'smash-may6-1': { homeTeamId: 'smash-1', awayTeamId: 'smash-2', homeScore: 3, awayScore: 2 },
    'smash-may6-2': { homeTeamId: 'smash-3', awayTeamId: 'smash-4', homeScore: 3, awayScore: 1 },
    'rl-may6-1': { homeTeamId: 'rl-1', awayTeamId: 'rl-2', homeScore: 4, awayScore: 3 },
    'rl-may6-2': { homeTeamId: 'rl-3', awayTeamId: 'rl-4', homeScore: 5, awayScore: 2 },
    'val-may7-1': { homeTeamId: 'val-1', awayTeamId: 'val-3', homeScore: 13, awayScore: 8 },
    'val-may7-2': { homeTeamId: 'val-2', awayTeamId: 'val-4', homeScore: 11, awayScore: 13 },
    'smash-may7-1': { homeTeamId: 'smash-1', awayTeamId: 'smash-3', homeScore: 3, awayScore: 1 },
    'smash-may7-2': { homeTeamId: 'smash-2', awayTeamId: 'smash-4', homeScore: 2, awayScore: 3 },
    'rl-may7-1': { homeTeamId: 'rl-1', awayTeamId: 'rl-3', homeScore: 6, awayScore: 2 },
    'rl-may7-2': { homeTeamId: 'rl-2', awayTeamId: 'rl-4', homeScore: 4, awayScore: 3 },
    'val-may8-1': { homeTeamId: 'val-1', awayTeamId: 'val-4', homeScore: 13, awayScore: 10 },
    'val-may8-2': { homeTeamId: 'val-2', awayTeamId: 'val-3', homeScore: 11, awayScore: 13 },
    'smash-may8-1': { homeTeamId: 'smash-1', awayTeamId: 'smash-4', homeScore: 3, awayScore: 2 },
    'smash-may8-2': { homeTeamId: 'smash-2', awayTeamId: 'smash-3', homeScore: 1, awayScore: 3 },
    'rl-may8-1': { homeTeamId: 'rl-1', awayTeamId: 'rl-4', homeScore: 5, awayScore: 3 },
    'rl-may8-2': { homeTeamId: 'rl-2', awayTeamId: 'rl-3', homeScore: 3, awayScore: 4 },
  };

  const match = matchData[matchId];
  if (!match) return false;

  const isHome = match.homeTeamId === teamId;
  return isHome ? match.homeScore > match.awayScore : match.awayScore > match.homeScore;
};
