import createContextHook from '@nkzw/create-context-hook';
import { useState } from 'react';
import { GameType } from '@/constants/games';

export const [AppProvider, useApp] = createContextHook(() => {
  const [selectedGame, setSelectedGame] = useState<GameType>('valorant');

  console.log('[AppContext] Current game:', selectedGame);

  return {
    selectedGame,
    setSelectedGame,
  };
});
