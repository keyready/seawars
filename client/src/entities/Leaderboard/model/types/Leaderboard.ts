export interface Leaderboard {
    id: string;
    players: string[];
    winnerName: string;
    createdAt: Date;
    endedAt: Date;
    scores: { [playerName: string]: number };
}

export interface FetchLeaderboardsParams {
    games: Leaderboard[];
    total: number;
    hasMore: boolean;
}
