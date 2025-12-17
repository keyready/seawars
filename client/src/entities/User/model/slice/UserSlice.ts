import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { getMe } from '../services/getUserData';
import { getUsersLeaderboard } from '../services/getUsersLeaderboard';
import { loginUSer } from '../services/loginUser';
import { signupUser } from '../services/signupUser';
import type { SignupAnswer, User } from '../types/User';
import type { UserSchema } from '../types/UserSchema';

const initialState: UserSchema = {
    error: undefined,
    leaderboard: [],
    user: undefined,
    isLoading: false,
};

export const UserSlice = createSlice({
    name: 'UserSlice',
    initialState,
    reducers: {
        setTemporaryName: (state, action: PayloadAction<string>) => {
            // @ts-expect-error bebebbebe
            state.user = { username: action.payload };
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signupUser.fulfilled, (state, action: PayloadAction<SignupAnswer>) => {
                state.isLoading = false;
                localStorage.setItem('token', action.payload.token);
                state.user = action.payload.user;
            })
            .addCase(signupUser.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Something went wrong during signup';
            })

            .addCase(loginUSer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUSer.fulfilled, (state, action: PayloadAction<SignupAnswer>) => {
                state.isLoading = false;
                localStorage.setItem('token', action.payload.token);
                state.user = action.payload.user;
            })
            .addCase(loginUSer.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Something went wrong during login';
            })

            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getMe.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Something went wrong during getting user data';
            })

            .addCase(getUsersLeaderboard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsersLeaderboard.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.isLoading = false;
                state.leaderboard = action.payload;
            })
            .addCase(getUsersLeaderboard.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Something went wrong during getting leaderboard';
            }),
});

export const { reducer: UserReducer, actions: UserActions } = UserSlice;
