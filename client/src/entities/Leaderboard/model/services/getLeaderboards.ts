import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ThunkConfig } from '@/app/store';

import type { FetchLeaderboardsParams } from '../types/Leaderboard';

export const fetchLeaderboards = createAsyncThunk<
    FetchLeaderboardsParams,
    number,
    ThunkConfig<string>
>('Leaderboard/signupUser', async (page, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.get<FetchLeaderboardsParams>(
            `/api/users/games?page=${page}`,
        );

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        console.log(e);
        return rejectWithValue('error');
    }
});
