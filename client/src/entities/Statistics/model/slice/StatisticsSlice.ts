import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getStatistics } from '../services/getStatistics';
import type { Statistics } from '../types/Statistics';
import type { StatisticsSchema } from '../types/StatisticsSchema';

const initialState: StatisticsSchema = {
    isLoading: false,
    statistics: undefined,
};

export const StatisticsSlice = createSlice({
    name: 'Statistics',
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(getStatistics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStatistics.fulfilled, (state, action: PayloadAction<Statistics>) => {
                state.isLoading = false;
                state.statistics = action.payload;
            })
            .addCase(getStatistics.rejected, (state) => {
                state.isLoading = false;
            }),
});

export const { reducer: StatisticsReducer } = StatisticsSlice;
