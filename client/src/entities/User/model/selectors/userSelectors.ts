import type { StateSchema } from '@/app/store';

export const getUserData = (state: StateSchema) => state.user.user;
export const getIsUserLoading = (state: StateSchema) => state.user.isLoading;
export const getUserError = (state: StateSchema) => state.user.error;
export const getUsersLeaderboard = (state: StateSchema) => state.user.leaderboard;
