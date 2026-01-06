export type GameType = 'valorant' | 'smash' | 'rocketleague';

export interface Game {
  id: GameType;
  name: string;
  shortName: string;
  color: string;
  icon: string;
}

export const GAMES: Game[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    shortName: 'VAL',
    color: '#FF4655',
    icon: '🎯',
  },
  {
    id: 'smash',
    name: 'Super Smash Bros',
    shortName: 'SSBU',
    color: '#E4000F',
    icon: '⚔️',
  },
  {
    id: 'rocketleague',
    name: 'Rocket League',
    shortName: 'RL',
    color: '#0066FF',
    icon: '🚗',
  },
];
