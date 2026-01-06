import { GameType } from '@/constants/games';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  game: GameType;
  record: {
    wins: number;
    losses: number;
  };
  image: string;
  color: string;
  region: string;
}

export const TEAMS: Team[] = [
  {
    id: 'val-1',
    name: 'Nova Vanguard',
    shortName: 'NV',
    game: 'valorant',
    record: { wins: 12, losses: 3 },
    image: '',
    color: '#2C3E50',
    region: 'Nashville',
  },
  {
    id: 'val-2',
    name: 'Shadow Elite',
    shortName: 'SE',
    game: 'valorant',
    record: { wins: 11, losses: 4 },
    image: '',
    color: '#1A1A2E',
    region: 'Nashville',
  },
  {
    id: 'val-3',
    name: 'Titan Force',
    shortName: 'TF',
    game: 'valorant',
    record: { wins: 10, losses: 5 },
    image: '',
    color: '#34495E',
    region: 'Nashville',
  },
  {
    id: 'val-4',
    name: 'Cyber Guardians',
    shortName: 'CG',
    game: 'valorant',
    record: { wins: 9, losses: 6 },
    image: '',
    color: '#16213E',
    region: 'Nashville',
  },
  {
    id: 'smash-1',
    name: 'Smash Masters',
    shortName: 'SM',
    game: 'smash',
    record: { wins: 13, losses: 2 },
    image: '',
    color: '#C0392B',
    region: 'Nashville',
  },
  {
    id: 'smash-2',
    name: 'Knockout Brigade',
    shortName: 'KB',
    game: 'smash',
    record: { wins: 11, losses: 4 },
    image: '',
    color: '#8E44AD',
    region: 'Nashville',
  },
  {
    id: 'smash-3',
    name: 'Stock Crushers',
    shortName: 'SC',
    game: 'smash',
    record: { wins: 10, losses: 5 },
    image: '',
    color: '#E74C3C',
    region: 'Nashville',
  },
  {
    id: 'smash-4',
    name: 'Final Destination',
    shortName: 'FD',
    game: 'smash',
    record: { wins: 9, losses: 6 },
    image: '',
    color: '#27AE60',
    region: 'Nashville',
  },
  {
    id: 'rl-1',
    name: 'Supersonic Racers',
    shortName: 'SR',
    game: 'rocketleague',
    record: { wins: 14, losses: 1 },
    image: '',
    color: '#2980B9',
    region: 'Nashville',
  },
  {
    id: 'rl-2',
    name: 'Aerial Experts',
    shortName: 'AE',
    game: 'rocketleague',
    record: { wins: 12, losses: 3 },
    image: '',
    color: '#3498DB',
    region: 'Nashville',
  },
  {
    id: 'rl-3',
    name: 'Boost Overload',
    shortName: 'BO',
    game: 'rocketleague',
    record: { wins: 11, losses: 4 },
    image: '',
    color: '#E67E22',
    region: 'Nashville',
  },
  {
    id: 'rl-4',
    name: 'Goal Storm',
    shortName: 'GS',
    game: 'rocketleague',
    record: { wins: 9, losses: 6 },
    image: '',
    color: '#95A5A6',
    region: 'Nashville',
  },
];

export const getTeamsByGame = (game: GameType): Team[] => {
  return TEAMS.filter(team => team.game === game);
};

export const getTeamById = (id: string): Team | undefined => {
  return TEAMS.find(team => team.id === id);
};
