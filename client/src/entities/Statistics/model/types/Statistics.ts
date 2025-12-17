export interface UserCommonPoint {
    date: string;
    games: number;
    wins: number;
}

export interface Opponents {
    opponent: string;
    games: number;
    wins: number;
    losses: number;
    winrate: number;
    lastGameDate: Date;
}

export interface GamesDuration {
    averageSeconds: number;
    shortestSeconds: number;
    longestSeconds: number;
    averageWinSeconds: number;
    averageLoseSeconds: number;
}

export interface GameProgress {
    averageCellsKilled: number;
    averageCellsLost: number;
    maxCellsKilled: number;
    minCellsKilled: number;
    averageCellDiff: number;
}

export interface Streaks {
    currentLoseStreak: number;
    currentWinStreak: number;
    maxLoseStreak: number;
    maxWinStreak: number;
}

export interface Statistics {
    common: UserCommonPoint[];
    opponents: Opponents[];
    streaks: Streaks;
    gamesProgress: GameProgress;
    gamesDuration: GamesDuration;
}

export interface ServerStatisticsResponse {
    statistics: UserCommonPoint[];
    matchups: Opponents[];
    streaks: Streaks;
    scores: GameProgress;
    durations: GamesDuration;
}
