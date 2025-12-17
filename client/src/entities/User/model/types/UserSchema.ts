import type { User } from './User';

export interface UserSchema {
    user?: User;
    leaderboard: User[];
    isLoading: boolean;
    error?: string;
}
