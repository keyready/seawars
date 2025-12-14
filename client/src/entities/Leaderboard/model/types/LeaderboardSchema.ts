import type { Leaderboard } from './Leaderboard';

export interface LeaderboardSchema {
    leaderboards: Leaderboard[];
    isLoading: boolean;
}
