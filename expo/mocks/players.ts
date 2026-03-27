import { GameType } from '@/constants/games';

export interface Player {
  id: string;
  name: string;
  username: string;
  teamId: string;
  game: GameType;
  image: string;
  stats: {
    valorant?: {
      kd: number;
      acs: number;
      headshotPercent: number;
      kills: number;
      deaths: number;
      assists: number;
      agentUsage: string;
      clutchWinPercent: number;
      mvps: number;
    };
    smash?: {
      wins: number;
      losses: number;
      mainCharacter: string;
      damagePerMatch: number;
      stocksTaken: number;
      stocksLost: number;
      avgMatchDuration: string;
      tournamentPlacements: number;
      setWinPercent: number;
    };
    rocketleague?: {
      goals: number;
      assists: number;
      saves: number;
      shotAccuracy: number;
      boostUsage: number;
      demos: number;
      wins: number;
      losses: number;
      mvps: number;
      avgPointsPerMatch: number;
    };
  };
}

let cachedPlayers: Player[] | null = null;

const createPlayers = (): Player[] => [
  {
    id: 'val-p1',
    name: 'Tejveer Shergill (Vex)',
    username: 'Vex',
    teamId: 'val-1',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.92,
        acs: 285,
        headshotPercent: 34,
        kills: 358,
        deaths: 186,
        assists: 132,
        agentUsage: 'Jett',
        clutchWinPercent: 48,
        mvps: 22,
      },
    },
  },
  {
    id: 'val-p2',
    name: 'Sid Alla (Kairo)',
    username: 'Kairo',
    teamId: 'val-1',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.45,
        acs: 198,
        headshotPercent: 26,
        kills: 248,
        deaths: 171,
        assists: 196,
        agentUsage: 'Killjoy',
        clutchWinPercent: 38,
        mvps: 11,
      },
    },
  },
  {
    id: 'val-p3',
    name: 'Mahant Devalla (Rogue)',
    username: 'Rogue',
    teamId: 'val-1',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.58,
        acs: 235,
        headshotPercent: 29,
        kills: 284,
        deaths: 180,
        assists: 168,
        agentUsage: 'Sova',
        clutchWinPercent: 41,
        mvps: 14,
      },
    },
  },
  {
    id: 'val-p4',
    name: 'Sankalp Dey (Storm)',
    username: 'Storm',
    teamId: 'val-1',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.38,
        acs: 185,
        headshotPercent: 22,
        kills: 232,
        deaths: 168,
        assists: 212,
        agentUsage: 'Omen',
        clutchWinPercent: 34,
        mvps: 8,
      },
    },
  },
  {
    id: 'val-p5',
    name: 'Ashvath Dinesh (Ash)',
    username: 'Ash',
    teamId: 'val-1',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.62,
        acs: 242,
        headshotPercent: 30,
        kills: 292,
        deaths: 180,
        assists: 145,
        agentUsage: 'Raze',
        clutchWinPercent: 43,
        mvps: 16,
      },
    },
  },
  {
    id: 'val-p6',
    name: 'Abhinav Challagundla (Reaper)',
    username: 'Reaper',
    teamId: 'val-2',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.88,
        acs: 276,
        headshotPercent: 33,
        kills: 342,
        deaths: 182,
        assists: 128,
        agentUsage: 'Reyna',
        clutchWinPercent: 46,
        mvps: 20,
      },
    },
  },
  {
    id: 'val-p7',
    name: 'Abhimanyu Eshwaran (Orion)',
    username: 'Orion',
    teamId: 'val-2',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.42,
        acs: 192,
        headshotPercent: 25,
        kills: 242,
        deaths: 170,
        assists: 188,
        agentUsage: 'Cypher',
        clutchWinPercent: 37,
        mvps: 10,
      },
    },
  },
  {
    id: 'val-p8',
    name: 'Sahasra Basava (Volt)',
    username: 'Volt',
    teamId: 'val-2',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.54,
        acs: 228,
        headshotPercent: 28,
        kills: 278,
        deaths: 180,
        assists: 162,
        agentUsage: 'Skye',
        clutchWinPercent: 40,
        mvps: 13,
      },
    },
  },
  {
    id: 'val-p9',
    name: 'Saishree Dhavilesawarapu (Viper)',
    username: 'Viper',
    teamId: 'val-2',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.35,
        acs: 182,
        headshotPercent: 21,
        kills: 228,
        deaths: 169,
        assists: 205,
        agentUsage: 'Viper',
        clutchWinPercent: 33,
        mvps: 7,
      },
    },
  },
  {
    id: 'val-p10',
    name: 'Navya Dhavileswarapu (Ace)',
    username: 'Ace',
    teamId: 'val-2',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.65,
        acs: 245,
        headshotPercent: 31,
        kills: 295,
        deaths: 179,
        assists: 142,
        agentUsage: 'Phoenix',
        clutchWinPercent: 44,
        mvps: 17,
      },
    },
  },
  {
    id: 'val-p11',
    name: 'Mohan Dhavileswarapu (Echo)',
    username: 'Echo',
    teamId: 'val-3',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.78,
        acs: 268,
        headshotPercent: 32,
        kills: 332,
        deaths: 186,
        assists: 135,
        agentUsage: 'Jett',
        clutchWinPercent: 45,
        mvps: 19,
      },
    },
  },
  {
    id: 'val-p12',
    name: 'Ramesh Dhavileswarapu (Forge)',
    username: 'Forge',
    teamId: 'val-3',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.48,
        acs: 205,
        headshotPercent: 27,
        kills: 252,
        deaths: 170,
        assists: 192,
        agentUsage: 'Sage',
        clutchWinPercent: 39,
        mvps: 12,
      },
    },
  },
  {
    id: 'val-p13',
    name: 'Aditi Kousikan (Sova)',
    username: 'Sova',
    teamId: 'val-3',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.52,
        acs: 232,
        headshotPercent: 29,
        kills: 275,
        deaths: 181,
        assists: 172,
        agentUsage: 'Sova',
        clutchWinPercent: 40,
        mvps: 13,
      },
    },
  },
  {
    id: 'val-p14',
    name: 'Anshika Gupta (Axel)',
    username: 'Axel',
    teamId: 'val-3',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.32,
        acs: 178,
        headshotPercent: 20,
        kills: 224,
        deaths: 170,
        assists: 198,
        agentUsage: 'Brimstone',
        clutchWinPercent: 32,
        mvps: 6,
      },
    },
  },
  {
    id: 'val-p15',
    name: 'Saanvi Shah (Ghost)',
    username: 'Ghost',
    teamId: 'val-3',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.59,
        acs: 238,
        headshotPercent: 30,
        kills: 287,
        deaths: 180,
        assists: 148,
        agentUsage: 'Neon',
        clutchWinPercent: 42,
        mvps: 15,
      },
    },
  },
  {
    id: 'val-p16',
    name: 'Arnav Gupta (Strike)',
    username: 'Strike',
    teamId: 'val-4',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.72,
        acs: 262,
        headshotPercent: 31,
        kills: 318,
        deaths: 185,
        assists: 138,
        agentUsage: 'Raze',
        clutchWinPercent: 44,
        mvps: 18,
      },
    },
  },
  {
    id: 'val-p17',
    name: 'Tony Cheng (Wall)',
    username: 'Wall',
    teamId: 'val-4',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.46,
        acs: 202,
        headshotPercent: 26,
        kills: 248,
        deaths: 170,
        assists: 185,
        agentUsage: 'Chamber',
        clutchWinPercent: 38,
        mvps: 11,
      },
    },
  },
  {
    id: 'val-p18',
    name: 'Gautam Goyal (Arrow)',
    username: 'Arrow',
    teamId: 'val-4',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.55,
        acs: 235,
        headshotPercent: 28,
        kills: 282,
        deaths: 182,
        assists: 165,
        agentUsage: 'Fade',
        clutchWinPercent: 41,
        mvps: 14,
      },
    },
  },
  {
    id: 'val-p19',
    name: 'Ethan Zou (Mist)',
    username: 'Mist',
    teamId: 'val-4',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.34,
        acs: 180,
        headshotPercent: 22,
        kills: 228,
        deaths: 170,
        assists: 202,
        agentUsage: 'Astra',
        clutchWinPercent: 33,
        mvps: 7,
      },
    },
  },
  {
    id: 'val-p20',
    name: 'Meer Jagtap (Fade)',
    username: 'Fade',
    teamId: 'val-4',
    game: 'valorant',
    image: '',
    stats: {
      valorant: {
        kd: 1.61,
        acs: 242,
        headshotPercent: 29,
        kills: 290,
        deaths: 180,
        assists: 152,
        agentUsage: 'KAY/O',
        clutchWinPercent: 43,
        mvps: 16,
      },
    },
  },

  {
    id: 'smash-p1',
    name: 'Pranav Kousikan (Blaze)',
    username: 'Blaze',
    teamId: 'smash-1',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 82,
        losses: 10,
        mainCharacter: 'Fox',
        damagePerMatch: 148,
        stocksTaken: 248,
        stocksLost: 82,
        avgMatchDuration: '4:22',
        tournamentPlacements: 2,
        setWinPercent: 89,
      },
    },
  },
  {
    id: 'smash-p2',
    name: 'Vishwa Esakimuthu (Frost)',
    username: 'Frost',
    teamId: 'smash-1',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 80,
        losses: 12,
        mainCharacter: 'Pikachu',
        damagePerMatch: 136,
        stocksTaken: 238,
        stocksLost: 88,
        avgMatchDuration: '4:42',
        tournamentPlacements: 3,
        setWinPercent: 87,
      },
    },
  },
  {
    id: 'smash-p3',
    name: 'Venkat Jagadeesh (Sentinel)',
    username: 'Sentinel',
    teamId: 'smash-2',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 74,
        losses: 16,
        mainCharacter: 'Mario',
        damagePerMatch: 140,
        stocksTaken: 222,
        stocksLost: 94,
        avgMatchDuration: '4:38',
        tournamentPlacements: 4,
        setWinPercent: 82,
      },
    },
  },
  {
    id: 'smash-p4',
    name: 'Akhil Kumerasan (Cheetah)',
    username: 'Cheetah',
    teamId: 'smash-2',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 70,
        losses: 20,
        mainCharacter: 'Captain Falcon',
        damagePerMatch: 145,
        stocksTaken: 215,
        stocksLost: 102,
        avgMatchDuration: '4:28',
        tournamentPlacements: 2,
        setWinPercent: 78,
      },
    },
  },
  {
    id: 'smash-p5',
    name: 'Dhejan Rajan Babu (Meteor)',
    username: 'Meteor',
    teamId: 'smash-3',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 68,
        losses: 22,
        mainCharacter: 'Falco',
        damagePerMatch: 138,
        stocksTaken: 208,
        stocksLost: 108,
        avgMatchDuration: '4:52',
        tournamentPlacements: 3,
        setWinPercent: 76,
      },
    },
  },
  {
    id: 'smash-p6',
    name: 'Vashi Maran (Ledge)',
    username: 'Ledge',
    teamId: 'smash-3',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 66,
        losses: 24,
        mainCharacter: 'Marth',
        damagePerMatch: 132,
        stocksTaken: 202,
        stocksLost: 112,
        avgMatchDuration: '5:08',
        tournamentPlacements: 4,
        setWinPercent: 73,
      },
    },
  },
  {
    id: 'smash-p7',
    name: 'Amey Godekar (Stock)',
    username: 'Stock',
    teamId: 'smash-4',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 62,
        losses: 28,
        mainCharacter: 'Peach',
        damagePerMatch: 135,
        stocksTaken: 195,
        stocksLost: 118,
        avgMatchDuration: '5:15',
        tournamentPlacements: 3,
        setWinPercent: 69,
      },
    },
  },
  {
    id: 'smash-p8',
    name: 'Sriansh Maroju (Shield)',
    username: 'Shield',
    teamId: 'smash-4',
    game: 'smash',
    image: '',
    stats: {
      smash: {
        wins: 60,
        losses: 30,
        mainCharacter: 'Link',
        damagePerMatch: 140,
        stocksTaken: 188,
        stocksLost: 122,
        avgMatchDuration: '5:02',
        tournamentPlacements: 2,
        setWinPercent: 67,
      },
    },
  },
  {
    id: 'rl-p1',
    name: 'Pramsu Narayamam (Turbo)',
    username: 'Turbo',
    teamId: 'rl-1',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 168,
        assists: 92,
        saves: 105,
        shotAccuracy: 71,
        boostUsage: 74,
        demos: 38,
        wins: 88,
        losses: 10,
        mvps: 32,
        avgPointsPerMatch: 398,
      },
    },
  },
  {
    id: 'rl-p2',
    name: 'Bhadri Kottapalli (Boost)',
    username: 'Boost',
    teamId: 'rl-1',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 124,
        assists: 142,
        saves: 98,
        shotAccuracy: 64,
        boostUsage: 78,
        demos: 22,
        wins: 88,
        losses: 10,
        mvps: 24,
        avgPointsPerMatch: 352,
      },
    },
  },
  {
    id: 'rl-p3',
    name: 'Dhanya Gangadharan (Wall)',
    username: 'Wall',
    teamId: 'rl-1',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 82,
        assists: 108,
        saves: 185,
        shotAccuracy: 58,
        boostUsage: 72,
        demos: 15,
        wins: 88,
        losses: 10,
        mvps: 18,
        avgPointsPerMatch: 318,
      },
    },
  },
  {
    id: 'rl-p4',
    name: 'Ansihk Nag (Flip)',
    username: 'Flip',
    teamId: 'rl-2',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 154,
        assists: 88,
        saves: 102,
        shotAccuracy: 68,
        boostUsage: 73,
        demos: 34,
        wins: 82,
        losses: 16,
        mvps: 28,
        avgPointsPerMatch: 382,
      },
    },
  },
  {
    id: 'rl-p5',
    name: 'Rohan Mittal (Reset)',
    username: 'Reset',
    teamId: 'rl-2',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 118,
        assists: 135,
        saves: 95,
        shotAccuracy: 63,
        boostUsage: 76,
        demos: 20,
        wins: 82,
        losses: 16,
        mvps: 22,
        avgPointsPerMatch: 348,
      },
    },
  },
  {
    id: 'rl-p6',
    name: 'Revan Pothcamury (Save)',
    username: 'Save',
    teamId: 'rl-2',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 78,
        assists: 102,
        saves: 178,
        shotAccuracy: 56,
        boostUsage: 71,
        demos: 12,
        wins: 82,
        losses: 16,
        mvps: 16,
        avgPointsPerMatch: 312,
      },
    },
  },
  {
    id: 'rl-p7',
    name: 'Aarnav Kodthivada (Aerial)',
    username: 'Aerial',
    teamId: 'rl-3',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 148,
        assists: 85,
        saves: 98,
        shotAccuracy: 67,
        boostUsage: 72,
        demos: 32,
        wins: 76,
        losses: 22,
        mvps: 26,
        avgPointsPerMatch: 372,
      },
    },
  },
  {
    id: 'rl-p8',
    name: 'Akash Nimal (Demo)',
    username: 'Demo',
    teamId: 'rl-3',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 112,
        assists: 128,
        saves: 92,
        shotAccuracy: 62,
        boostUsage: 75,
        demos: 45,
        wins: 76,
        losses: 22,
        mvps: 20,
        avgPointsPerMatch: 342,
      },
    },
  },
  {
    id: 'rl-p9',
    name: 'Iritsh Saha (Block)',
    username: 'Block',
    teamId: 'rl-3',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 74,
        assists: 98,
        saves: 172,
        shotAccuracy: 55,
        boostUsage: 70,
        demos: 10,
        wins: 76,
        losses: 22,
        mvps: 14,
        avgPointsPerMatch: 308,
      },
    },
  },
  {
    id: 'rl-p10',
    name: 'Aditya Biswas (Flick)',
    username: 'Flick',
    teamId: 'rl-4',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 136,
        assists: 82,
        saves: 96,
        shotAccuracy: 65,
        boostUsage: 71,
        demos: 28,
        wins: 68,
        losses: 30,
        mvps: 24,
        avgPointsPerMatch: 358,
      },
    },
  },
  {
    id: 'rl-p11',
    name: 'Sharvil Deshpande (Pass)',
    username: 'Pass',
    teamId: 'rl-4',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 106,
        assists: 124,
        saves: 88,
        shotAccuracy: 61,
        boostUsage: 74,
        demos: 18,
        wins: 68,
        losses: 30,
        mvps: 18,
        avgPointsPerMatch: 332,
      },
    },
  },
  {
    id: 'rl-p12',
    name: 'Pramit Jagtap (Anchor)',
    username: 'Anchor',
    teamId: 'rl-4',
    game: 'rocketleague',
    image: '',
    stats: {
      rocketleague: {
        goals: 70,
        assists: 94,
        saves: 165,
        shotAccuracy: 54,
        boostUsage: 69,
        demos: 8,
        wins: 68,
        losses: 30,
        mvps: 12,
        avgPointsPerMatch: 298,
      },
    },
  },
];

export const PLAYERS = (): Player[] => {
  if (!cachedPlayers) {
    cachedPlayers = createPlayers();
  }
  return cachedPlayers;
};

export const getPlayersByGame = (game: GameType): Player[] => {
  return PLAYERS().filter(player => player.game === game);
};

export const getPlayerById = (id: string): Player | undefined => {
  return PLAYERS().find(player => player.id === id);
};
