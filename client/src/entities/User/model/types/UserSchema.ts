import type { User } from './User';

export interface UserSchema {
    user?: User;
    isLoading: boolean;
    error?: string;
}
