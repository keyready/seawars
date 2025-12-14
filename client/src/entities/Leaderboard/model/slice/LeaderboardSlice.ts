import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Leaderboard } from '@/entities/Leaderboard';

import { fetchLeaderboards } from '../services/getLeaderboards';
import type { LeaderboardSchema } from '../types/LeaderboardSchema';

const initialState: LeaderboardSchema = {
    leaderboards: [],
    isLoading: false,
};

export const LeaderboardSlice = createSlice({
    name: 'LeaderboardSlice',
    initialState,
    reducers: {
        setLeaderBoard: (state, action: PayloadAction<Leaderboard[]>) => {
            state.leaderboards = action.payload.reverse().slice(0, 4);
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchLeaderboards.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLeaderboards.fulfilled, (state, action: PayloadAction<Leaderboard[]>) => {
                state.leaderboards = action.payload.reverse().slice(0, 4);
                state.isLoading = false;
            }),
});

export const { reducer: LeaderboardReducer, actions: LeaderboardActions } = LeaderboardSlice;
