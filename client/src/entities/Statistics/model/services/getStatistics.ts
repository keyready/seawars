import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ThunkConfig } from '@/app/store';

import type { ServerStatisticsResponse, Statistics } from '../types/Statistics';

export const getStatistics = createAsyncThunk<Statistics, void, ThunkConfig<string>>(
    'Statistics/getStatistics',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get<ServerStatisticsResponse>(
                '/api/users/me/statistics',
            );

            if (!response.data) {
                throw new Error();
            }

            return {
                common: response.data.statistics,
                opponents: response.data.matchups,
                streaks: response.data.streaks,
                gamesProgress: response.data.scores,
                gamesDuration: response.data.durations,
            } as Statistics;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
