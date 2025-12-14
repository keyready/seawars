import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { signupUser } from '@/entities/User/model/services/signupUser';

import type { SignupAnswer } from '../types/User';
import type { UserSchema } from '../types/UserSchema';

const initialState: UserSchema = {
    error: undefined,
    user: undefined,
    isLoading: false,
};

export const UserSlice = createSlice({
    name: 'UserSlice',
    initialState,
    reducers: {},
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
            }),
});

export const { reducer: UserReducer, actions: UserActions } = UserSlice;
