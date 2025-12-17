import { createAsyncThunk } from '@reduxjs/toolkit';

import type { User } from '../types/User';

import type { ThunkConfig } from '@/store/StateSchema';

export const getUsersLeaderboard = createAsyncThunk<User[], void, ThunkConfig<string>>(
    'User/getUsersLeaderboard',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<User[]>('/api/users/leaderboard');

            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
