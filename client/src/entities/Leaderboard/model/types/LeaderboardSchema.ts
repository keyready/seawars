import type { Leaderboard } from './Leaderboard';

export interface LeaderboardSchema {
    leaderboards: Leaderboard[];
    hasMore?: boolean;
    totalGames?: number;
    isLoading: boolean;
}
