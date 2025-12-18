import { createAsyncThunk } from '@reduxjs/toolkit';

import type { ThunkConfig } from '@/app/store';

import type { LoginSchema, SignupAnswer } from '../types/User';

export const loginUSer = createAsyncThunk<SignupAnswer, LoginSchema, ThunkConfig<string>>(
    'User/loginUSer',
    async (credentials, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<SignupAnswer>('/api/auth/login', credentials);

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
