import type { StateSchema } from '@/store/StateSchema';

export const getLeaderboards = (state: StateSchema) => state.leaderboard.leaderboards || [];
export const getLeaderboardsIsLoading = (state: StateSchema) => state.leaderboard.isLoading;
