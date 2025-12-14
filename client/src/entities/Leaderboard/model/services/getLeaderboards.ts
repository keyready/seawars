import { createAsyncThunk } from '@reduxjs/toolkit';

import type { Leaderboard } from '@/entities/Leaderboard';

import type { ThunkConfig } from '@/store/StateSchema';

export const fetchLeaderboards = createAsyncThunk<Leaderboard[], void, ThunkConfig<string>>(
    'Leaderboard/signupUser',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<Leaderboard[]>('/api/users/games');

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
