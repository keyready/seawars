import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ThunkConfig } from '@/app/store';

import type { LoginSchema, SignupAnswer } from '../types/User';

export const signupUser = createAsyncThunk<SignupAnswer, LoginSchema, ThunkConfig<string>>(
    'User/signupUser',
    async (credentials, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<SignupAnswer>('/api/auth/register', credentials);

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
