import type { StateSchema } from '@/app/store';

export const getGames = (state: StateSchema) => state.leaderboard.leaderboards || [];
export const getTotalGames = (state: StateSchema) => state.leaderboard.totalGames || 1;
export const getHasMoreGames = (state: StateSchema) => state.leaderboard.hasMore || false;
export const getGamesIsLoading = (state: StateSchema) => state.leaderboard.isLoading;
