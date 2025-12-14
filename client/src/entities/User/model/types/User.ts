import { type UserRankKeys } from './Ranks';

export interface User {
    username: string;
    password: string;
    rank: UserRankKeys;
    rating: number;
    gamesPlayed: number;
    gamesWon: number;
    lastGameDate: Date;
    lastOnlineDate: Date;
}

export interface SignupAnswer {
    message: string;
    token: string;
    user: User;
}

export interface LoginSchema {
    username: string;
    password: string;
}
