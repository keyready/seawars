import type { StateSchema } from '@/app/store';

export const getCommonStatistics = (state: StateSchema) => state.statistics.statistics?.common;
export const getGamesProgressStatistics = (state: StateSchema) =>
    state.statistics.statistics?.gamesProgress;
export const getOpponentsStatistics = (state: StateSchema) =>
    state.statistics.statistics?.opponents;
export const getGamesDurationStatistics = (state: StateSchema) =>
    state.statistics.statistics?.gamesDuration;
export const getStreaksStatistics = (state: StateSchema) => state.statistics.statistics?.streaks;
