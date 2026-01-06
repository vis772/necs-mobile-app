import { MATCHES } from './matches';
import { TEAMS } from './teams';

const recordCache = new Map<string, { wins: number; losses: number }>();

export const calculateTeamRecord = (teamId: string): { wins: number; losses: number } => {
  if (recordCache.has(teamId)) {
    return recordCache.get(teamId)!;
  }

  const completedMatches = MATCHES.filter(
    match => match.status === 'completed' && (match.homeTeamId === teamId || match.awayTeamId === teamId)
  );

  let wins = 0;
  let losses = 0;

  completedMatches.forEach(match => {
    const isHomeTeam = match.homeTeamId === teamId;
    const teamScore = isHomeTeam ? match.homeScore : match.awayScore;
    const opponentScore = isHomeTeam ? match.awayScore : match.homeScore;

    if (teamScore > opponentScore) {
      wins++;
    } else if (teamScore < opponentScore) {
      losses++;
    }
  });

  const record = { wins, losses };
  recordCache.set(teamId, record);
  return record;
};

export const getTeamWithDynamicRecord = (teamId: string) => {
  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return undefined;

  const record = calculateTeamRecord(teamId);
  
  return {
    ...team,
    record,
  };
};

export const getTeamStandings = (game: string) => {
  const gameTeams = TEAMS.filter(t => t.game === game);
  
  return gameTeams
    .map(team => getTeamWithDynamicRecord(team.id))
    .filter(Boolean)
    .sort((a, b) => {
      const aWinPct = a!.record.wins / (a!.record.wins + a!.record.losses || 1);
      const bWinPct = b!.record.wins / (b!.record.wins + b!.record.losses || 1);
      
      if (bWinPct !== aWinPct) {
        return bWinPct - aWinPct;
      }
      
      return b!.record.wins - a!.record.wins;
    });
};
